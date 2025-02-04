"use client"
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation'; 
import { FaShoppingBag, FaUsers } from 'react-icons/fa';
import { IoIosSettings } from 'react-icons/io';
import { MdLogout, MdSpaceDashboard } from 'react-icons/md';
import Image from 'next/image';

const menuItems = [
  { id: 1, name: 'Dashboard', icon: <MdSpaceDashboard />, href: '/admin/dashboard' },
  { id: 2, name: 'Products', icon: <FaShoppingBag />, href: '/admin/dashboard/products' },
  { id: 3, name: 'Users', icon: <FaUsers />, href: '/admin/dashboard/users' },
  { id: 4, name: 'Settings', icon: <IoIosSettings />, href: '/admin/settings' },
];

const Sidebar = () => {
  const pathname = usePathname(); 

  return (
    <div className=" h-screen  w-64  bg-white text-white shadow-xl p-5">
          {/* <div className="fixed top-3 rounded-xl left-3 h-full w-64 bg-white text-white shadow-xl p-5"> */}


      <Link href={'/admin/dashboard'}>
        <Image src={'/1.svg'} alt='logo' height={10} width={40} className='h-12 w-44' />
      </Link>

      <div className='mt-10'>
        {menuItems.map((item) => (
          <Link
            href={item.href}
            key={item.id}
            className={`flex items-center space-x-2 mb-3 py-3 px-8 
              ${pathname === item.href 
                ? 'bg-[#6aa84f] rounded-md' 
                : 'hover:border border-[#6aa84f] rounded-md'
              }`}
          >
            <span className="text-lg text-black">{item.icon}</span>
            <h1 className="text-sm text-black">{item.name}</h1>
          </Link>
        ))}
        
      </div>
      
      <Link href='/'>
        <div className='flex items-center justify-center py-3 px-5 ml-5 fixed bottom-3 rounded-md space-x-2'>
          <MdLogout className='font-bold text-lg text-[#6aa84f]' />
          <button className='font-bold text-[#6aa84f]'>Logout</button>
        </div>
      </Link>
    </div>
  );
};

export default Sidebar;
