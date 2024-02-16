"use client"
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EmployeeFormSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    paymentType: Yup.string().required('Payment Type is required'),
    paymentAmount: Yup.number().required('Payment Amount is required'),
    hoursWorked: Yup.number().required('Hours Worked is required'),
});

const EmployeeForm = ({ onSubmit, initialValues }: { onSubmit: (values: any) => void, initialValues?: any }) => {
    const idUser = typeof window !== 'undefined' ? localStorage.getItem('idUser') : null;

    return (
        <Formik
            initialValues={{
                name: initialValues?.name || '',
                paymentType: initialValues?.paymentType || '',
                paymentAmount: initialValues?.paymentAmount || 0,
                hoursWorked: initialValues?.hoursWorked || 0,
                userId: Number(idUser),
            }}
            validationSchema={EmployeeFormSchema}
            onSubmit={(values) => {
				console.log(values);
				
                onSubmit(values);
            }}
        >
            {() => (
                <Form>
                    <div className='mb-4'>
                        <label htmlFor="name" className='block text-gray-700 text-sm font-bold mb-2'>Name</label>
                        <Field type="name" name="name" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600' />
                        <ErrorMessage name="name" component="div" className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="paymentType" className='block text-gray-700 text-sm font-bold mb-2'>Payment Type</label>
                        <Field as="select" name="paymentType" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600'>
                            <option value="">Select Payment Type</option>
                            <option value="Salary">Salary</option>
                            <option value="Per Hour">Per Hour</option>
                        </Field>
                        <ErrorMessage name="paymentType" component="div" className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="paymentAmount" className='block text-gray-700 text-sm font-bold mb-2'>Payment Amount</label>
                        <Field type="number" name="paymentAmount" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600' />
                        <ErrorMessage name="paymentAmount" component="div" className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="hoursWorked" className='block text-gray-700 text-sm font-bold mb-2'>Hours Worked</label>
                        <Field type="number" name="hoursWorked" className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600' />
                        <ErrorMessage name="hoursWorked" component="div" className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4' />
                    </div>

                    <button type="submit" className='bg-gray-600 w-full mt-5 p-2 text-white uppercase hover:bg-gray-800 cursor-pointer rounded-md'>Add Employee</button>
                </Form>
            )}
        </Formik>
    );
};

export default EmployeeForm;
