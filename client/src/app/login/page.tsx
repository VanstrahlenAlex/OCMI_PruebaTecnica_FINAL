"use client"
import React, { useState} from 'react'
import RootLayout from '../layout';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

const LoginPage = () => {

	
	const [message, setMessage] = useState(null);

	const router = useRouter();

	const formik = useFormik({
		initialValues: {
            email: '',
            password: '',
        },
		validationSchema: Yup.object({
            email: Yup.string().email('The Email is invalid').required('The Email is Obligatory'),
            password: Yup.string().required('The Password is Obligatory').min(6, "The Password must be a minimum of 6 characters")
        }),
        onSubmit: values => {
            handleSubmit(values);
        }
	});

	const handleSubmit = async (userData: { email: string, password: string}) => {
        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
			const data = await response.json();
			setMessage(data.message);
			setTimeout(() =>{
					setMessage(null)
			}, 3000)

				
			const token = data.backendTokens.accessToken; 
    		localStorage.setItem('token', token); 
			const role = data.user.role; 
			localStorage.setItem('role', role);
			const idUser = data.user.id;

			localStorage.setItem('idUser', idUser);
			const name = data.user.name; 
			localStorage.setItem('name', name)

            if (response.ok) {
				if(role === 'ADMIN'){
					setMessage(data.message)
					setTimeout(() =>{
						setMessage(null)
						router.push('/alluser')
					}, 3000)
				} else if(role === 'CLIENT'){
					setMessage(data.message)
					setTimeout(() =>{
						setMessage(null)
						router.push('/employees')
					}, 3000)
				}
            } else {			
				setMessage(data.message);
				setTimeout(() =>{
					setMessage(null)
				}, 3000)
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
				
				<h1 className='text-center text-2xl text-white font-light'>Login for PEOPayGo</h1>
				{message && showMessage()}
				<div className='flex justify-center mt-5'>
					<div className='w-full max-w-sm'>
						<form action="" onSubmit={formik.handleSubmit} className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4'>


								<div className='mb-4'>
									<label htmlFor="email" className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
									<input type="email" id='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-sky-600' placeholder='User Email'/>
								</div>
								{formik.errors.email ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            	) : null}
								<div className='mb-4'>
									<label htmlFor="password" className='block text-gray-700 text-sm font-bold mb-2'>Password</label>
									<input type="password" id='password' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}  className='shadow appearence-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-pink-600' placeholder='User Password'/>
								</div>
								{formik.errors.password ? (
                                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                    <p className='font-bold'>Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>
                            	) : null}

								<input type="submit" className='bg-gray-600 w-full mt-5 p-2 text-white uppercase hover:bg-gray-800 cursor-pointer'  value={"Log in"}/>
						</form>

						<div className='flex p-2 gap-2'>
							<p className='text-white'>Don`t you have an account yet?</p>
							<Link href={"/newuser"}>
								<p className='text-purple-600'>
									Create account	
								</p>
								
							</Link>
						</div>
					</div>
				</div>
			
		</>
	)
}

export default LoginPage
