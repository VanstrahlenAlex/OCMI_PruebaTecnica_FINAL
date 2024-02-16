"use client"
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


const Sidebar = () => {
    const pathname = usePathname();

	const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

    return (
			<>
				<aside className='bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5'>
					<div>
						<p className='text-white text-2xl font-black'>PEOPayGo</p>
					</div>
					
						<nav className='mt-5 list-none'>	
								{role === 'ADMIN' || pathname === '/alluser' ? (
									<div>
										<li className={pathname === '/alluser' ? 'bg-blue-800 p-3' : 'p-3'}>
											<Link href={'/alluser'}>
												<p className='text-white mb-3 block'>All Users</p>	
											</Link>
										</li>
										<li className={pathname === '/timesheetscompanys' ? 'bg-blue-800 p-3' : 'p-3'}>
											<Link href={'/timesheetscompanys'}>
												<p className='text-white mb-3 block'>Timesheets Companys</p>
											</Link>
										</li>
									</div>
								) : role === 'CLIENT' || pathname === '/employees'  ? (
									<div>
										<li className={pathname === '/employees' ? 'bg-blue-800 p-3' : 'p-3'}>
											<Link href={'/employees'}>
												<p className='text-white mb-3 block'>Employees</p>
											</Link>
										</li>
										<li className={pathname === '/timesheets' ? 'bg-blue-800 p-3' : 'p-3'}>
											<Link href={'/timesheets'}>
												<p className='text-white mb-3 block'>Timesheets</p>
											</Link>
										</li>
									</div>
								) : null}
						</nav>
					
				</aside>
			</>			
    );
};

export default Sidebar;
