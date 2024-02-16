"use client"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from './components/Providers'
import Sidebar from './components/Sidebar';
import { usePathname, useRouter } from 'next/navigation';
import Head from 'next/head'
import { useEffect, useState } from 'react';
import LogoutButton from './components/LogoutButton';


const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<string>(''); 

	const router = useRouter()

	const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
	
	
    useEffect(() => {
		const role = localStorage.getItem('role');
		if(role?.toString() === 'ADMIN'){
			router.push('/alluser');
			setUserRole(role)
		} else if(role?.toString() === 'CLIENT'){
			router.push('/employees');
			setUserRole(role)
		}		
    }, []);


    return (
        <html lang="en">
        <body className={inter.className}>
            <Providers>
            <Head>
                <title>PEOPayGo</title>
            </Head>
            

            {pathname === '/login' || pathname === '/newuser' ? (
                <div className='bg-gray-800 min-h-screen flex flex-col justify-center'>
                    <div>
                        {children}
                    </div>
                </div>
            ) : (
                
                <div className='bg-gray-200 min-h-screen'>
                    <nav className='bg-gray-800 flex justify-between items-center px-4 py-2'>
                        <div className="flex items-center">
                            {/* */}
                        </div>
                        <div>
                            <LogoutButton />
                        </div>
                    </nav>
                    <div className='flex min-h-screen '>                
                        <Sidebar />
                        <main className='sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5'>
                            {children}
                        </main>
                    </div>
                </div>
            )}
            </Providers>
        </body>
        </html>
    )
}
