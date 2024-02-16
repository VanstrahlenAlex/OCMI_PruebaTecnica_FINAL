"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreateNewUserForm from '../components/CreateNewUserForm';

const UserPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found in localStorage');
            }

            const response = await axios.get('http://localhost:8000/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsers(response.data);
			const userId = response.data.map((user:any) => user.id);
        	console.log('User ID:', userId);
			setSelectedUserId(response.data[0].id);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleEditUser = (userId) => {
        setSelectedUserId(userId);
        setIsModalOpen(true);
    };

    const handleUserCreated = () => {
        fetchUsers();
        setIsModalOpen(false);
        setSelectedUserId(null);
    };

	const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

	return (
		<>
		<div>
			<h1 className='text-2xl text-gray-800 font-light mb-4'>Users</h1>
			<div className='flex gap-4'>
				<button onClick={openModal} className='bg-gray-600 text-white p-2 mb-4 rounded-md hover:bg-gray-800 cursor-pointer'>Create New Users</button>
				<button  className='bg-gray-600 text-white p-2 mb-4 rounded-md hover:bg-gray-800 cursor-pointer' title="Reload Users">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"
					onClick={() => fetchUsers()}
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
					</svg>
				</button>
			</div>
			
		</div>
				{isModalOpen && (
					<div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 '>
						<div className='bg-white p-8 rounded-lg relative '>
							
							<h2 className='text-xl font-semibold mb-4'>Add User</h2>
							<button onClick={closeModal} className='absolute top-0 right-0 p-4 text-red-500'>X Close</button>
							<CreateNewUserForm onUserCreated={handleUserCreated} selectedUserId={selectedUserId}/>
						</div>
					</div>
				)}

		<div>
			<h1 className='text-2xl text-gray-800 font-light mb-4'>Users</h1>
			<div>
				{users.map((user) => (
					<div key={user.id} className="border border-gray-300 rounded p-2 mb-2">
						<p className=''>ID: <span>{user.id}</span></p>
						<p>Email: <span>{user.email}</span></p>
						<p>Name Company/User: <span>{user.name}</span></p>
						<p>Role: <span>{user.role}</span> </p>
						<button onClick={() => handleEditUser(user.id)} className='bg-blue-500 hover:bg-blue-700 text-white p-2 mr-2 rounded-md mt-2'>Edit</button>
					</div>
				))}
			</div>
        </div>
		</>
	)
}

export default UserPage
