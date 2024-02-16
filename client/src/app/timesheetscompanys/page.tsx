"use client"
import React from 'react'
import { useEffect, useState } from 'react';



const TimesheetsCompany = () => {
	
	const [timesheets, setTimesheets] = useState([]);

	useEffect(() => {
        getTimesheets();
    }, []);

	
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
				setTimesheets(data)
				
			}
		} catch (error) {
			console.log(error);
		}
	}
	return (
		<>
			<div>
				<h1 className='text-2xl text-gray-800 font-light mb-4'>Timesheets companys</h1>
			</div>

			<div>
				
				<table className='table-auto shadow-md mt-10 w-full w-lg'>
				<thead className='bg-gray-800'>
					<tr className='text-white'>
						<th className='w-1/10 p-2'>Id</th>
						<th className='w-1/10 p-2'>User</th>
						<th className='w-1/5 p-2'>Date</th>
						<th className='w-1/6 p-2'>Check Date</th>
						<th className='w-1/8 p-2'>State</th>
						<th className='w-1/5 p-2'>Note</th>
						<th className='w-1/5 p-2'>Employees</th>
						<th className='w-1/2 p-2'>Payment Start Date - End Date</th>

						<th className='w-1/5 p-2'>TotalGross</th>
						{/* <th className='w-1/5 p-2'>Tools</th> */}
					</tr>
				</thead>
				<tbody className='bg-white'>
					{timesheets.map((timesheet: any, index: number) =>(
						<tr key={index}>
							<td className='border px-4 py-2 align-middle'>{timesheet.id}</td>
							<td className='border px-4 py-2 align-middle'>{timesheet.userId}</td>
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
							{/* <td className='border px-4 py-2 flex justify-center'>
								 <button onClick={() => handleEdit(timesheet.id)} className='bg-blue-500 hover:bg-blue-700 text-white p-2 mr-2 rounded-md'>Edit</button>
								<button onClick={() => handleDelete(timesheet.id)} className='bg-red-500 hover:bg-red-700 text-white p-2 rounded-md'>Delete</button> 
							</td> */}
							
						</tr>
					))}
				</tbody>
			</table>

			</div>
		</>
	)
}

export default TimesheetsCompany
