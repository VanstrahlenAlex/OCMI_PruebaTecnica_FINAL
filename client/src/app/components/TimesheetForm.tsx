"use client"
import React, { useState, useEffect } from 'react';
import { useFormik, Formik, Form, Field, FieldArray, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';

interface Employee {
    id: number;
    name: string;
    paymentAmount: number;
    paymentType: string;
    hoursWorked?: number;
    userId: number;
}

interface TimesheetFormValues {
    date: Date;
    checkDate: Date;
    state: string;
    note?: string;
    totalGross: number;
    userId: number;
    employees: Employee[];
    paymentStartDate: Date;
    paymentEndDate: Date;
}

interface TimesheetFormProps {
    closeModal: () => void;
    timesheetId?: number; 
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({ closeModal, timesheetId }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [message, setMessage] = useState<string>('');
	const currentDate = format(new Date(), 'yyyy-MM-dd');
	const [totalGross, setTotalGross] = useState<number>(0);
	const [timesheetData, setTimesheetData] = useState<TimesheetFormValues | null>(null);
	const [formValues, setFormValues] = useState<TimesheetFormValues>({
			date: new Date(),
			checkDate: new Date(),
			state: '',
			note: '',
			totalGross: 0,
			userId: Number(localStorage.getItem('idUser')),
			employees: [],
			paymentStartDate: new Date(),
			paymentEndDate: new Date(),
	});

	useEffect(() => {
		if (timesheetData) {
			setFormValues({
				date: new Date(timesheetData.date),
				checkDate: new Date(timesheetData.checkDate),
				state: timesheetData.state,
				note: timesheetData.note || '',
				totalGross: timesheetData.totalGross,
				userId: timesheetData.userId,
				employees: timesheetData.employees,
				paymentStartDate: new Date(timesheetData.paymentStartDate),
				paymentEndDate: new Date(timesheetData.paymentEndDate),
			});
		}
	}, [timesheetData]);


	useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const idUser = localStorage.getItem('idUser');
                if (!idUser) {
                    throw new Error('idUser not found in localStorage');
                }

                const response = await fetch(`http://localhost:8000/employees`);
                if (response.ok) {
                    const data = await response.json();
                    const filteredEmployees = data.filter((employee: any) => employee.userId === parseInt(idUser));
                    setEmployees(filteredEmployees);
                } else {
                    throw new Error('Failed to fetch employees');
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

	useEffect(() => {
        if (timesheetId !== undefined) {
            fetchTimesheetData(timesheetId);
        }
    }, [timesheetId]);

	const fetchTimesheetData = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8000/timesheets/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setTimesheetData(data);
            } else {
                throw new Error('Failed to fetch timesheet data');
            }
        } catch (error) {
            console.error('Error fetching timesheet data:', error);
        }
    };

    const handleSubmit = async (values: TimesheetFormValues, formikHelpers: FormikHelpers<TimesheetFormValues>) => {
        const { setSubmitting, setErrors } = formikHelpers;

        try {
            let url = 'http://localhost:8000/timesheets';
            let method = 'POST';

            if (timesheetId) {
                url += `/${timesheetId}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
					totalGross: totalGross, 
                	employees: values.employees.map((employee) => ({
                        id: employee.id,
                        name: employee.name,
                        paymentAmount: employee.paymentAmount,
                        paymentType: employee.paymentType,
                        hoursWorked: employee.hoursWorked || 0, 
                        userId: employee.userId,
                	})),
                    
                    date: new Date(values.date).toISOString(),
                    checkDate: new Date(values.checkDate).toISOString(),
                    paymentStartDate: new Date(values.paymentStartDate).toISOString(),
                    paymentEndDate: new Date(values.paymentEndDate).toISOString(),
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(timesheetId ? 'Timesheet updated successfully!' : 'Timesheet submitted successfully!');

                setTimeout(() => {
                    setMessage('');
                    formikHelpers.resetForm();
                    closeModal();
                }, 3000);
            } else {
                throw new Error('Failed to submit timesheet');
            }
        } catch (error) {
            console.error('Error submitting timesheet:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            {message && <div className='my-2 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 flex'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                <p>{message}</p>
                </div>}
            <h1 className='text-xl font-semibold mb-4'>Timesheet Form</h1>
            <Formik
                initialValues={{
					date: new Date(),
					checkDate: new Date(),
					state: '',
					note: '',
					totalGross: 0,
					userId: Number(localStorage.getItem('idUser')),
					employees: [] as Employee[],
					paymentStartDate: new Date(),
					paymentEndDate: new Date(),
    			}}

                validationSchema={Yup.object().shape({
                    date: Yup.date().required('Date is required'),
                    checkDate: Yup.date().required('Check Date is required'),
                    state: Yup.string().required('State is required'),
                    note: Yup.string(),
                    totalGross: Yup.number().required('Total Gross is required'),
                    userId: Yup.number().required('User ID is required'),
                    paymentStartDate: Yup.date().required('Payment Start Date is required'),
                    paymentEndDate: Yup.date().required('Payment End Date is required'),
                })}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, handleSubmit, isSubmitting }) => (
                    <Form className='bg-white rounded shadow-md min-w-sm' onSubmit={handleSubmit}>

                        						
                       
												
						<div className='mt-2'>
							<label htmlFor="date" className='block text-gray-700 text-sm font-bold mb-2'>Date creation Timesheet</label>
                        	<Field
							type="date" name="date" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600 mb-2' />
                        	<ErrorMessage name="date" component="div" className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' />
						</div>

						<div className='mt-2'>
							<label htmlFor="checkDate" className='block text-gray-700 text-sm font-bold mb-2'>Check Date</label>
                        	<Field type="date" name="checkDate" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600 mb-2' />
                        	<ErrorMessage name="checkDate" component="div" className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' />
						</div>

						<div className='mt-2'>
							<label htmlFor="state" className='block text-gray-700 text-sm font-bold mb-2'>State:</label>
							<Field as="select" name="state" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600 mb-2'>
								<option value="">Select State</option>
								<option value="Incomplete">Incomplete</option>
								<option value="Complete">Complete</option>
								<option value="Sent">Sent</option>
								<option value="Not sent">Not sent</option>
								<option value="To be sent">To be sent</option>
							</Field>
							<ErrorMessage name="state" component="div" className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'/>
						</div>

						<div className='mt-2'>
							<label htmlFor="note" className='block text-gray-700 text-sm font-bold mb-2'>Note</label>
                        	<Field type="textarea" name="note" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600 mb-2' />
                        	<ErrorMessage name="note" component="div" className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' />
						</div>

						

						<div className='mt-2'>
							<label htmlFor="paymentStartDate" className='block text-gray-700 text-sm font-bold mb-2'>Payment Star tDate</label>
                        	<Field type="date" name="paymentStartDate" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600 mb-2' />
                        	<ErrorMessage name="paymentStartDate" component="div" className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' />
						</div>
						<div className='mt-2'>
							<label htmlFor="paymentEndDate" className='block text-gray-700 text-sm font-bold mb-2'>Payment End Date</label>
                        	<Field type="date" name="paymentEndDate" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600 mb-2' />
                        	<ErrorMessage name="paymentEndDate" component="div" className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' />
						</div>

                        <FieldArray name="employees">
                            {({ push, remove }) => (
                                <div className="max-h-40 overflow-y-auto mt-2">
                                    <h2 className='block text-gray-700 text-sm font-bold mb-2'>Employees</h2>
                                    {employees.map((employee) => (
                                        <div key={employee.id} className='gap-6'>
                                            <label className='p-2'>
                                                <input
                                                    type="checkbox"
                                                    checked={values.employees.some((emp) => emp.id === employee.id)}

													onChange={(e) => {
														const isChecked = e.target.checked;
														const employeeIndex = values.employees.findIndex((emp) => emp.id === employee.id);
														let updatedEmployees;
														if (isChecked) {
															updatedEmployees = [...values.employees, employee];
														} else {
															updatedEmployees = [...values.employees.slice(0, employeeIndex), ...values.employees.slice(employeeIndex + 1)];
														}
														setFieldValue('employees', updatedEmployees);


														let total = 0;
														updatedEmployees.forEach((emp) => {
															if (emp.paymentType === 'Salary') {
																total += emp.paymentAmount;
															} else if (emp.paymentType === 'Per Hour') {
																total += emp.paymentAmount * (emp.hoursWorked || 0);
															}
														});
														setTotalGross(total);
													}}

                                                    className='gap-2'
                                                />
                                                {employee.name} -
                                            </label>
											<label htmlFor="" className='text-blue-400 p-2'>Payment Type- <span className='text-blue-800'>{employee.paymentType}</span></label>
											<label htmlFor="" className='text-blue-400 p-2'>Hours Worked - <span className='text-blue-800'>{employee.hoursWorked}</span></label>
                                            <label htmlFor="" className='text-blue-400 p-2'>Payment Amount - <span className='text-blue-800'>{employee.paymentAmount}</span></label>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </FieldArray>

						<div className='mt-2'>
                            <label htmlFor="totalGross" className='block text-gray-700 text-sm font-bold mb-2'>Total Gross</label>
                            <input
                                type="text"
                                name="totalGross"
                                value={totalGross}
                                readOnly
                                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600 mb-2'
                            />
                            <ErrorMessage name="totalGross" component="div" className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' />
                        </div>

                        
                        <button type="submit" disabled={isSubmitting} className='bg-gray-600 w-full mt-5 p-2 text-white uppercase hover:bg-gray-800 cursor-pointer'>
                            {timesheetId ? 'Update Timesheet' : 'Add Timesheet'}
                        </button>
                    </Form>
                )}
            </Formik>
            
        </div>
    );
};

export default TimesheetForm;