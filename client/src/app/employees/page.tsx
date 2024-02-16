"use client";
import React, { useState, useEffect } from 'react';
import EmployeeForm from '../components/EmployeeForm';

const EmployeesPage = () => {
    const [message, setMessage] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [totalGrossWages, setTotalGrossWages] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    const handleEdit = (employee: any) => {
        setSelectedEmployee(employee);
        openModal();
    };

    const handleDelete = async (employeeId: number) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                const response = await fetch(`http://localhost:8000/employees/${employeeId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    const data = await response.json();
                    setMessage(data.message);
                    setTimeout(() => {
                        setMessage(null);
                    }, 3000);
                    getEmployees();
                } else {
                    throw new Error('Failed to delete employee');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    useEffect(() => {
        getEmployees();
    }, []);

    const idUser = typeof window !== 'undefined' ? localStorage.getItem('idUser') : null;

    const handleSubmit = async (values: any) => {
        try {
            let url = 'http://localhost:8000/employees';
            let method = 'POST';

            if (selectedEmployee) {
                url += `/${selectedEmployee.id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
				console.log(data);
				
                setMessage(data.message);
                setTimeout(() => {
                    setMessage(null);
                    setIsModalOpen(false);
                }, 2000);

                getEmployees();
            } else {
				console.log(response);
				
                throw new Error('Failed to create/update employee');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const showMessage = () => {
        return (
            <div className='bg-green-100 border-l-4 border-green-500 text-green-700 py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{message}</p>
            </div>
        );
    };

    const getEmployees = async () => {
        try {
            if (!idUser) {
                throw new Error('idUser not found in localStorage');
            }

            const response = await fetch(`http://localhost:8000/employees?userId=${idUser}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const filteredEmployees = data.filter((employee: any) => employee.userId === parseInt(idUser));
                const employeesWithGrossWages = filteredEmployees.map((employee: any) => {
                    let grossWages;
                    if (employee.paymentType === 'Per Hour') {
                        grossWages = employee.paymentAmount * employee.hoursWorked;
                    } else {
                        grossWages = employee.paymentAmount;
                    }
                    return { ...employee, grossWages };
                });
                setEmployees(employeesWithGrossWages);
                const total = employeesWithGrossWages.reduce((acc: number, employee: any) => acc + employee.grossWages, 0);
                setTotalGrossWages(total);
            } else {
                throw new Error('Failed to get employees');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
		setSelectedEmployee(null);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
    };

    return (
        <div>
            <h1 className='text-2xl text-gray-800 font-light mb-4'>Employees</h1>

            <div className='flex gap-4'>
                <button onClick={openModal} className='bg-gray-600 text-white p-2 mb-4 rounded-md hover:bg-gray-800 cursor-pointer'>Add Employee</button>
                <button className='bg-gray-600 text-white p-2 mb-4 rounded-md hover:bg-gray-800 cursor-pointer' title="Reload">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
                        onClick={() => getEmployees()}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
            </div>

            {isModalOpen && (
                <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 '>
                    <div className='bg-white p-8 rounded-lg relative '>
                        {message && showMessage()}
                        <h2 className='text-xl font-semibold mb-4'>Employee Form</h2>
                        <button onClick={closeModal} className='absolute top-0 right-0 p-4 text-red-500'>X Close</button>
                        <EmployeeForm onSubmit={handleSubmit} initialValues={selectedEmployee} />
                    </div>
                </div>
            )}

            <div>
                <table className='table-auto shadow-md mt-10 w-full w-lg'>
                    <thead className='bg-gray-800'>
                        <tr className='text-white'>
                            <th className='w-1/5 p-2'>Name</th>
                            <th className='w-1/5 p-2'>Payment Type</th>
                            <th className='w-1/5 p-2'>Payment Amount</th>
                            <th className='w-1/5 p-2'>Hours Worked</th>
                            <th className='w-1/5 p-2'>Gross Wages</th>
                            <th className='w-1/5 p-2'>Tools</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white'>
                        {employees.map((employee: any, index: number) => (
                            <tr key={index}>
                                <td className='border px-4 py-2'>{employee.name}</td>
                                <td className='border px-4 py-2'>{employee.paymentType}</td>
                                <td className='border px-4 py-2'>{employee.paymentAmount}</td>
                                <td className='border px-4 py-2'>{employee.hoursWorked}</td>
                                <td className='border px-4 py-2'>{employee.grossWages}</td>
                                <td className='border px-4 py-2 flex'>
                                    <button onClick={() => handleEdit(employee)} className='bg-blue-500 hover:bg-blue-700 text-white p-2 mr-2 rounded-md'>Edit</button>
                                    <button onClick={() => handleDelete(employee.id)} className='bg-red-500 hover:bg-red-700 text-white p-2 rounded-md'>Delete</button>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={4} className='border px-4 py-2 font-semibold'>Total Gross Wages</td>
                            <td className='border px-4 py-2 font-semibold'>{totalGrossWages}</td>
                            <td className='border px-4 py-2'></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeesPage;
