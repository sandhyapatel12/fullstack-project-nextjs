"use client"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Image from 'next/image'
import { usePathname } from 'next/navigation'; // Importing the hook
import React from 'react'
import { FaSearch, FaBars } from 'react-icons/fa'  // Importing menu icon

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const pathname = usePathname()
  console.log(pathname);

  return (
    <div className='  mt-1 bg shadow-xl rounded-md px-3  flex items-center justify-between z-10'>

<div className='flex items-center gap-2'>
      {/* trigger button */}
      <div className=''>
        <SidebarTrigger />
        {/* {children} */}
      </div>

      {/* Display menu name */}
      <div>
        <h1 className='text-green-700 font-bold'>
          {/* Display current pathname */}
          {(() => {
            const lastSegment = pathname.split('/').pop();
            return lastSegment ? lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) : '';
          })()}
        </h1>
      </div>
      </div>

      {/* Admin profile */}
      <div className='flex space-x-2 items-center'>



        <div className='bg-white border-2 border-gray-500 shadow-xl flex rounded-full items-center justify-center h-8 w-8'>
          <Image src='/user2.png' height={24} width={24} alt='admin' className='text-white' />
        </div>
        <div className='text-xs text-black'>
          <h1>email</h1>
          <h1>Admin</h1>
        </div>
      </div>

    </div>
  )
}

export default Navbar;
