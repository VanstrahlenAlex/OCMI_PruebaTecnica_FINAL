"use client"
import React, {useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const NewUser = () => {

	
	const [message, setMessage] = useState(null);
	const router = useRouter();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            role: 'CLIENT'
        },
        validationSchema: Yup.object({
            name: Yup.string().required('The Name is obligatory'),
            email: Yup.string().email('The Email is invalid').required('The Email is Obligatory'),
            password: Yup.string().required('The Password is Obligatory').min(6, "The Password must be a minimum of 6 characters")
        }),
        onSubmit: values => {
            handleSubmit(values);
        }
    });

	const handleSubmit = async (userData: { name: string, email: string, password: string, role: string }) => {
		try {
			let response = await fetch('http://localhost:8000/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(userData)
			});
			let data = await response.json();

			if (response.ok) {
				setMessage(data.message);
				setTimeout(() => {
					setMessage(null);
					router.push('/login');
				}, 3000);
			} else {
				setMessage(data.message);
				setTimeout(() => {
					setMessage(null);
				}, 3000);
			}
		} catch (error) {
			console.error('Error:', error);
		}
	};

	
	const showMessage = () => {
		return (
			<div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
				<p>{message}</p>
			</div>
		)
	}
    return (
        <>
			{message && showMessage()}
            <h1 className='text-center text-2xl text-white font-light'> New User for PEOPayGo</h1>
            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-sm'>
                    <form onSubmit={formik.handleSubmit} className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'>
                        <div className='mb-4'>
                            <label htmlFor="name" className='block text-gray-700 text-sm font-bold mb-2'>Name</label>
                            <input type="text" id='name' value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600' placeholder='User Name'/>
                            {formik.touched.name && formik.errors.name ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.name}</p>
                                </div>
                            ) : null}
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="email" className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
                            <input type="email" id='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600' placeholder='User Email'/>
                            {formik.errors.email ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            ) : null}
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="password" className='block text-gray-700 text-sm font-bold mb-2'>Password</label>
                            <input type="password" id='password' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-pink-600' placeholder='User Password'/>
                            {formik.errors.password ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>
                            ) : null}
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="role" className='block text-gray-700 text-sm font-bold mb-2'>Role</label>
                            <select id="role" {...formik.getFieldProps('role')} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-pink-600'>
                                <option value="CLIENT">Client</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <input type="submit" className='bg-gray-600 w-full mt-5 p-2 text-white uppercase hover:bg-gray-800 cursor-pointer' value={"Create User"}/>
                    </form>

					<div className='flex p-2 gap-2'>
							<p className='text-white'>Already have a PeoPayGo account?</p>
							<Link href={"/login"}>
								<p className='text-purple-600'>
									Log In	
								</p>
								
							</Link>
					</div>
                </div>
            </div>
        </>
    );
}

export default NewUser;
