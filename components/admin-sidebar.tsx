"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { MdLogout, MdSpaceDashboard } from "react-icons/md"
import { FaShoppingBag, FaUsers } from "react-icons/fa"
import { IoIosSettings } from "react-icons/io"



// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: <MdSpaceDashboard />,
      isActive: true,

    },
    {
      title: "Users",
      url: "/admin/dashboard/users",
      icon: <FaUsers />,
    },
    {
      title: "Products",
      url: "/admin/dashboard/products",
      icon: <FaShoppingBag />,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: <IoIosSettings />,
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>

      {/* logo */}
      <Link href={'/admin/dashboard'}>
        <Image src={'/1.svg'} alt='logo' height={10} width={40} className='h-14 w-44 mt-5' />
      </Link>

      {/* sidebar main content */}
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* sidebar logout  */}
      <Link href='/' >
        <div className='flex items-center justify-center py-3 px-5 ml-5 fixed bottom-3 rounded-md space-x-2'>
          <MdLogout className='font-bold text-lg text-[#6aa84f]' />
          <button className='font-bold text-[#6aa84f]'>Logout</button>
        </div>
      </Link>

    </Sidebar>
  )
}
