"use client"
import React, { useState, useEffect } from 'react';
import TimesheetForm from '../components/TimesheetForm';

const Timesheets = () => {
    const [showModal, setShowModal] = useState(false);
	const [timesheets, setTimesheets] = useState([]);
	const [selectedTimesheetId, setSelectedTimesheetId] = useState<number | undefined>(undefined);
	const [message, setMessage] = useState<string>('')

	const showMessage = () => {
		return (
			<div className='my-2 bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 flex'>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
				</svg>
				<p >{message}</p>
			</div>
		)
	}

	useEffect(() =>{
		getTimesheets()
	}, []);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const closeModal = () => {
        setShowModal(false);
    };

	const getTimesheets = async () => {
		try {
			const response = await fetch(`http://localhost:8000/timesheets`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
			if(response.ok) { 
				const data = await response.json();
				const idUser = localStorage.getItem('idUser')
								
				if (idUser !== null && !isNaN(Number(idUser))) {
					const userIdNumber = Number(idUser);
					const filteredTimesheets = data.filter((timesheet : any) => timesheet.userId === userIdNumber);
					setTimesheets(filteredTimesheets)
				} else {
					setMessage('El userId no está presente o no es un número.');
				}
				
			}
		} catch (error) {
			console.log(error);
		}
	}

	const handleEdit = (timesheetId: number) => {
        setSelectedTimesheetId(timesheetId);
        setShowModal(true);
    };

    const handleDelete = async (timesheetId: number) => {
		if (window.confirm('Are you sure you want to delete this employee?')) {
        try {
            const response = await fetch(`http://localhost:8000/timesheets/${timesheetId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setTimesheets(timesheets.filter((timesheet) => timesheet.id !== timesheetId));
                setMessage('Timesheet deleted successfully');
				setTimeout(()=> {
					setMessage('');
				}, 3000)
            } else {
                setMessage('Failed to delete timesheet');
            }
        } catch (error) {
            console.error('Error deleting timesheet:', error);
        }
		}
    };


    return (
		<>
        <div>
            <h1 className='text-2xl text-gray-800 font-light mb-4'>Timesheets</h1>
			
            <div className='flex gap-4'>
                <button
                    onClick={toggleModal}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4'
                >
                    Add Timesheet
                </button>

				<button  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4' title="Reload">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
					onClick={() => getTimesheets()}
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
					</svg>
				</button>
            </div>

				{message && showMessage()}
            {showModal && (
                <div className='fixed inset-0 flex items-center justify-center z-50'>
                    <div className='absolute inset-0 bg-gray-900 opacity-50'></div>
                    <div className='bg-white p-8 rounded z-50 relative'>
                        <button className='absolute top-0 right-0 p-4 text-red-500' onClick={toggleModal}>
                            X Close
                        </button>
                        <TimesheetForm closeModal={closeModal} timesheetId={selectedTimesheetId}/>
                    </div>
                </div>
            )}
        </div>
		<div>
			<table className='table-auto shadow-md mt-10 w-full w-lg'>
				<thead className='bg-gray-800'>
					<tr className='text-white'>
						<th className='w-1/10 p-2'>Id</th>
						<th className='w-1/5 p-2'>Date</th>
						<th className='w-1/6 p-2'>Check Date</th>
						<th className='w-1/8 p-2'>State</th>
						<th className='w-1/5 p-2'>Note</th>
						<th className='w-1/5 p-2'>Employees</th>
						<th className='w-1/2 p-2'>Payment Start Date - End Date</th>
						<th className='w-1/5 p-2'>TotalGross</th>
						<th className='w-1/5 p-2'>Tools</th>
					</tr>
				</thead>
				<tbody className='bg-white'>
					{timesheets.map((timesheet: any, index: number) =>(
						<tr key={index}>
							<td className='border px-4 py-2 align-middle'>{timesheet.id}</td>
							<td className='border px-4 py-2'>{timesheet.date.substring(0, 10)}</td>
							<td className='border px-4 py-2'>{timesheet.checkDate.substring(0, 10)}</td>
							<td className='border px-4 py-2'>{timesheet.state}</td>
							<td className='border px-4 py-2'>{timesheet.note}</td>
							<td className='border px-4 py-2'>
								<ul>
									{timesheet.employees.map((employee: any, index: number) => (
										<li key={index}>{employee.name},</li>
									))}
								</ul>
							</td>
							<td className='border px-4 py-3'>{timesheet.paymentStartDate.substring(0, 10)} / {timesheet.paymentEndDate.substring(0, 10)}</td>
							<td className='border px-4 py-2'>{timesheet.totalGross}</td>
							<td className='border px-4 py-2 flex justify-center'>
								{/* <button onClick={() => handleEdit(timesheet.id)} className='bg-blue-500 hover:bg-blue-700 text-white p-2 mr-2 rounded-md'>Edit</button> */}
								<button onClick={() => handleDelete(timesheet.id)} className='bg-red-500 hover:bg-red-700 text-white p-2 rounded-md'>Delete</button> 
							</td>
							
						</tr>
					))}
				</tbody>
			</table>
		</div>
		</>
    );
};

export default Timesheets;
