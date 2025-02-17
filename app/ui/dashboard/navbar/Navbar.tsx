"use client";

import { fetchUserById } from "@/app/slices/AdminSlice/userSlice";
import { AppDispatch, RootState } from "@/app/store/globalstore";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Navbar = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);

  // Extract path segments
  const segments = pathname.split("/").filter(Boolean);
  const lastSegment = segments[segments.length - 1] || "";
  const secondLastSegment = segments[segments.length - 2] || "";

  const [menuTitle, setMenuTitle] = useState<string>("Dashboard");

  // Check if last segment is a user ID
  const isUserId = /^[a-f\d]{24}$/i.test(lastSegment);

  console.log("Last segment:", lastSegment, "Is user ID:", isUserId);
  // Find user in Redux store
  const foundUser = users.find((user) => user._id === lastSegment);

  console.log("Found user:", foundUser);
  // Fetch user if not found
  useEffect(() => {
    if (isUserId && !foundUser) {
      dispatch(fetchUserById(lastSegment));
      console.log("Dispatching fetchUserById for:", lastSegment);
    }
  }, [lastSegment, dispatch, foundUser, isUserId]);

  // Update menu title based on path
  useEffect(() => {
    if (isUserId) {
      if (foundUser) {
        // If user is found, set the username
        setMenuTitle(foundUser.username);
      } 
    } else if (lastSegment) {
      // If last segment is not a user ID, set the menu title based on the last segment
      setMenuTitle(lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1));
    } else {
      // Default to "Dashboard"
      setMenuTitle("Dashboard");
    }
  }, [foundUser, lastSegment, isUserId]);

  return (
    <div className="mt-1 bg-white shadow-xl rounded-md px-3 flex items-center justify-between z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-green-700 font-bold">{menuTitle}</h1>
      </div>

      {/* Admin Profile */}
      <div className="flex space-x-2 items-center">
        <div className="bg-white border-2 border-gray-500 shadow-xl flex rounded-full items-center justify-center h-8 w-8">
          <Image src="/user2.png" height={24} width={24} alt="admin" />
        </div>
        <div className="text-xs text-black">
          <h1>email</h1>
          <h1>Admin</h1>
        </div>
      </div>
    </div>
  );
};

export default Navbar;