"use client";
import Navbar from '@/app/ui/dashboard/navbar/Navbar';
import Sidebar from '@/app/ui/dashboard/sidebar/Sidebar';
import React, { useState } from 'react';
import { FaRegWindowClose } from "react-icons/fa";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/admin-sidebar';


const Layout = ({ children }: any) => {
  // State to toggle the sidebar visibility on small screens
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close the sidebar
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <SidebarProvider>

    <div className="flex flex-col lg:flex-row w-full  min-h-screen bg-background ">

      {/* left side content : sidebar */}
      <div className=''>
          <AppSidebar />
    
      </div>


      {/* Right side content */}
      <div className="flex-1 mx-3  ">

        <Navbar toggleSidebar={toggleSidebar} />
        <div className="mt-2 ">{children}</div>
        
      </div>
    </div>
    </SidebarProvider>

  );
};

export default Layout;
