"use client";

import Image from "next/image";
import Link from "next/link";
import Pagination from "@/app/ui/dashboard/pagination/Pagination";
import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchUsers, deleteUser, fetchAllUsers } from "@/app/slices/AdminSlice/userSlice";
import { AppDispatch, RootState } from "@/app/store/globalstore";
import FadeLoader from "react-spinners/FadeLoader";
import Search from "@/app/ui/dashboard/search/Search";
import { IoMdMore } from "react-icons/io";
import DialogBox from "../../components/DialogBox";
import { MdCancel, MdOutlineDeleteSweep } from "react-icons/md";

const Users: FC = () => {

  // Get search parameters and current page for pagination
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);   // for displaying pagination

  const dispatch = useDispatch<AppDispatch>();

  // Get users data from Redux store
  const { users, count, status, error } = useSelector(
    (state: RootState) => state.users
  );

  // Fetch all users without pagination
  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);


  // fetch all users data from Redux store
  const allUsers = useSelector((state: RootState) => state.users.allUsers);

  // Local states for handling user interactions
  const [filteredUsers, setFilteredUsers] = useState(allUsers);  //set allusers as a initial state
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isBulkDeleteMode, setBulkDeleteMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [searching, setSearching] = useState(false);   //set false searching as a initial state
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null); // Store userId for single delete user


  // Fetch users on initial load or when page changes
  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit: 10 }));  //display 6 users in a page
  }, [currentPage, dispatch]);

  // Update filtered users when users state changes
  useEffect(() => {
    setFilteredUsers(allUsers);
  }, [allUsers]);

  // Function to handle search input and filter users based on the username
  const handleSearchChange = (searchQuery: string) => {
    // Check if the search input is empty or contains only whitespace
    if (searchQuery.trim() === "") {
      setSearching(false);    // Indicate that the user is not currently searching
      setFilteredUsers(users); // Reset the filtered users to display  users with pagination
    } else {
      setSearching(true);     // Indicate that the user is performing a search
      const filtered = allUsers.filter((curUser) =>
        curUser.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered); // Update the state with the filtered list of users
    }
  };

  // Effect to reset the filtered users list when not searching
  useEffect(() => {
    // If not in searching mode, reset the filtered users to the current users list
    if (!searching) {
      setFilteredUsers(users);
    }
  }, [searching, users]); // This effect runs whenever 'searching' or 'users' changes



  // handle multiple selected users for delete 
  const handleDeleteSelectedUsers = () => {
    if (selectedUsers.size === 0) return;
    setDeleteUserId(null); // Set to null to indicate bulk delete
    console.log("selectedUsers", selectedUsers);   //display selected users id     
    setIsDialogOpen(true);
  };

  // confirm delete selected multiple users and single user
  const confirmDeleteSelectedUsers = async () => {
    try {


      // Bulk deletion
      await Promise.all([...selectedUsers].map((userId) => dispatch(deleteUser(userId))));

      setFilteredUsers((prevUsers) => prevUsers.filter((user) => user._id && !selectedUsers.has(user._id)));
      setSelectedUsers(new Set());


      setBulkDeleteMode(false);
      setMenuOpen(false);
      setIsDialogOpen(false);

      // Refresh users list so that the pagination is updated and not display previous deleted users at the search time 
      dispatch(fetchAllUsers());   //display all users
      dispatch(fetchUsers({ page: 1, limit: 10 }));   //display pagination wise users
      router.push(`/admin/dashboard/users?page=1`);   //after deletion process redirect to the first page
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  };

  // Cancel the delete process and reset the state
  const cancelDelete = () => {
    setIsDialogOpen(false);
    setBulkDeleteMode(false);
    setSelectedUsers(new Set());
  };

  // Handle selecting or deselecting individual users
  const handleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => {
      const newSelectedUsers = new Set(prev);
      if (newSelectedUsers.has(userId)) {
        newSelectedUsers.delete(userId);
      } else {
        newSelectedUsers.add(userId);
      }

      // Update selectAll state based on whether all users on the current page are selected
      setSelectAll(newSelectedUsers.size === users.length);

      return newSelectedUsers;
    });
  };

  // Handle "Select All" checkbox for bulk actions
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedUsers(new Set());  // Unselect all users
    } else {
      const allUserIds = new Set(users.map((user) => user._id || ""));
      setSelectedUsers(allUserIds);  // Select all users on the page
    }
    setSelectAll(!selectAll);
  };


  // Change the page when pagination is triggered
  const handlePageChange = (page: number) => {
    router.push(`/admin/dashboard/users?page=${page}`);
  };

  // Handle loading state
  if (status === "loading") {
    return (
      <div className="mt-20 flex items-center justify-center">
        <FadeLoader />
      </div>
    );
  }

  // Handle error state
  if (status === "failed") {
    return (
      <div className="p-5 bg-gray-100 min-h-screen">
        <p>Error: {error}</p>
      </div>
    );
  }


  return (
    <div className="rounded-md px-5 pt-5 bg-white opacity-85 shadow-xl h-[calc(100vh-80px)] md:h-[calc(100vh-83px)] lg:h-[calc(100vh-70px)]">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-3">
        {/* Left Side */}
        <div>
          {!isBulkDeleteMode && <Search onSearchChange={handleSearchChange} />}
          {isBulkDeleteMode && (
            <div className="flex items-center space-x-4 ml-7">

              {/* delete multiple users */}
              <button
                onClick={handleDeleteSelectedUsers}
                className="text-2xl font-bold hover:text-gray-400 text-red-600"
                disabled={selectedUsers.size === 0}
              >
                <MdOutlineDeleteSweep />
              </button>

              {/* cancel button for close the bulk delete mode */}
              <button
                onClick={() => setBulkDeleteMode(false)}
                className="text-2xl font-bold hover:text-gray-400 text-red-600"
              >
                <MdCancel />
              </button>

            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex md:justify-between justify-end md:items-center px-2 space-x-3">
          <Link href="/admin/dashboard/users/adduser">
            <button
              className={`bg-[#6aa84f] hover:bg-[#38761d] py-1 px-4 text-sm md:text-md md:py-2 md:px-5 md:w-32 mt-2 md:mt-0 font-bold rounded-md shadow-2xl ${isBulkDeleteMode ? "hidden md:inline-block" : ""
                }`}
            >
              Add New
            </button>
          </Link>
          <div className={`relative mt-2 md:mt-0 ${isBulkDeleteMode ? "hidden md:inline-block " : ""}`}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="border-2 border-[#6aa84f] hover:bg-[#6aa84f] p-1 md:p-2 rounded-full md:rounded-md"
            >
              <IoMdMore className={"h-4 w-4"} />
            </button>
            {menuOpen && (
              <div className="absolute top-0 right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-2xl text-xs font-bold">
                <button
                  onClick={() => {
                    setBulkDeleteMode(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-4 hover:bg-gray-200"
                >
                  Delete Multiple
                </button>
                <button
                  onClick={() => {
                    setBulkDeleteMode(false);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-4 hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Table for larger screens */}
      <div className="overflow-hidden">
        <div className="hidden md:block overflow-y-auto h-[calc(100vh-160px)] lg:h-[calc(100vh-158px)]">
          {/* Table Container */}
          <table className="w-full table-auto text-sm text-left">
            {/* Header (sticky) */}
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="text-black font-bold">
                {isBulkDeleteMode && (
                  <th className="p-2 ">
                    {/* Main Checkbox for Bulk Delete Mode */}
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === users.length && users.length > 0}
                      onChange={handleSelectAllChange}
                      className="transition-all duration-300"
                    />

                  </th>
                )}
                <th className="p-2">Username</th>
                <th className="p-2">Email</th>
                <th className="p-2">Created At</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
              </tr>

              {/* Decorative line between header and body */}
              <tr className="">
                <td
                  colSpan={isBulkDeleteMode ? 6 : 5}
                  className="h-1 bg-[length:10px_10px] bg-[radial-gradient(circle,_#888888_30%,_transparent_30%)]"
                ></td>
              </tr>
            </thead>

            {/* Table Body (Scrollable) */}
            <tbody>
              {/* if no users found then display this message */}
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={100}>
                    <div className="flex mt-8 flex-col max-w-7xl mx-auto items-center justify-center">
                      <Image
                        src="/usernotfound.svg"
                        width={40}
                        height={40}
                        alt={"not found"}
                        className="w-72 h-72"
                      />
                      <p className="font-extrabold text-2xl text-[#38761d] mt-4">
                        No users found.
                      </p>
                    </div>
                  </td>
                </tr>
              ) :
                (filteredUsers.map((user, index) => (

                  <React.Fragment key={user._id || user.email}>
                    <tr key={user._id || user.email}>
                      {/* Checkboxes */}
                      {isBulkDeleteMode && (
                        <td className="p-2 text-center">
                          <input
                            type="checkbox"
                            checked={selectedUsers.has(user._id || "")}
                            onChange={() => handleUserSelection(user._id || "")}
                            className="transition-all duration-300"
                          />
                        </td>
                      )}

                      {/* User Profile */}
                      <td className="hidden p-3 md:flex  ">
                        <div className="flex items-center justify-center space-x-2">
                          <Link href={`/admin/dashboard/users/${user._id || ""}`}>
                            <Image
                              src={user.user_img || "/user2.png"}
                              alt={user.username || "User"}
                              width={35}
                              height={35}
                              className="rounded-full p-0.5 bg-white border border-[#38761d] shadow-xl hover:border-2 hover:border-[#274e13]"
                            />
                          </Link>

                          <span className="truncate block w-[120px]" title={user.username || "Unknown"}>
                            {user.username || "Unknown"}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td>
                        <span className=" p-3 truncate block w-[200px]" title={user.email}>
                          {user.email}
                        </span>
                      </td>


                      {/* Date */}
                      <td className="p-3">{user.createdAt?.slice(0, 10)}</td>(date.format('dddd, MMMM Do YYYY')); 

                      {/* Role */}
                      <td className="p-3">
                        <span
                          className={`py-1 px-3 text-xs rounded-md ${user.isAdmin ? "bg-[#6aa84f]" : "bg-gray-400"
                            }`}
                        >
                          {user.isAdmin ? "Admin" : "User"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-3">
                        <span
                          className={`py-1 px-3 text-xs rounded-full ${user.isActive ? "bg-[#5aca66]" : "bg-[#FF000080]"
                            }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>


                    </tr>

                    {/* Divider Row */}
                    {index < filteredUsers.length - 1 && (
                      <tr>
                        <td colSpan={100} className="border-t border-gray-300"></td>
                      </tr>
                    )}
                  </React.Fragment>
                )))}

              {/* Pagination Row */}
              {!searching && (
                <tr>
                  <td colSpan={100} className="py-2">
                    <div className="">
                      <Pagination
                        count={count}
                        limit={10}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>


      {/* Table for smaller screens */}
      <div className="flex items-center  text-sm font-bold ">

        {/* when user click on menu icon at that time display main checkbox in header part (menu icon which is display near the add new button) */}
        {isBulkDeleteMode && (
          <div className="flex md:hidden items-center justify-center mt-5 mdL">
            <input
              type="checkbox"
              checked={selectedUsers.size === users.length && users.length > 0}
              onChange={handleSelectAllChange}
              className="transition-all duration-300"
            />
          </div>
        )}

        <div className={`flex  md:hidden text-md font-bold px-7 ${isBulkDeleteMode ? "mt-5" : ""} `}>Users Info</div>
      </div>

      {/* line before heading */}
      <div className="md:hidden h-1 bg-[length:10px_10px] bg-[radial-gradient(circle,_#888888_30%,_transparent_30%)] md:mb-5"></div>

      {/* Existing card view for smaller screens */}
      <div className="md:hidden overflow-y-auto h-[calc(100vh-240px)] mt-2">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col max-w-7xl mx-auto items-center justify-center">
            <Image
              src="/usernotfound.svg"
              width={40}
              height={40}
              alt={"not found"}
              className="w-72 h-72 md:mt-20"
            />
            <p className="font-bold md:font-extrabold text-2xl md:text-2xl text-[#38761d]">
              No users found.
            </p>
          </div>
        ) : (
          filteredUsers.map((user, index) => (
            <div key={user._id || user.email}>
              {/* User Row */}
              <div className="flex items-center justify-between py-3 space-x-2">
                {/* Checkboxes for Bulk Delete Mode */}
                {isBulkDeleteMode && (
                  <div className="text-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user._id || "")}
                      onChange={() => handleUserSelection(user._id || "")}
                      className="transition-all duration-300"
                    />
                  </div>
                )}

                {/* Left Side: User Profile */}
                <div className="flex items-center space-x-1">
                  <Image
                    src={user.user_img || "/user2.png"}
                    alt={user.username || "User"}
                    width={40}
                    height={40}
                    className="rounded-full p-0.5 bg-white border border-[#38761d] shadow-xl"
                  />
                  <div className="space-y-1">
                    {/* Username */}
                    <h1 className="text-xs truncate w-[120px] font-bold">{user.username}</h1>

                    {/* Role and Date */}
                    <div className="flex items-center space-x-2">
                      <div
                        className={`px-3 py-1 flex items-center justify-center text-xs rounded-lg ${user.isAdmin ? "bg-[#6aa84f]" : "bg-gray-400"
                          }`}
                      >
                        {user.isAdmin ? "Admin" : "User"}
                      </div>
                      <h1 className="text-xs text-gray-500">{user.createdAt?.slice(0, 10)}</h1>
                    </div>
                  </div>
                </div>

                {/* Right Side: Menu Icon */}
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="border-2 border-[#6aa84f] hover:bg-[#6aa84f] rounded-full p-1 md:p-2 md:rounded-md ml-10"
                  >
                    <IoMdMore className="w-4 h-4" /> {/* Menu Icon for mobile */}
                  </button>
                  {menuOpen && (
                    <div className="absolute top-0 right-0 mt-2 w-32 bg-white border border-gray-300 rounded-md shadow-2xl text-xs font-bold">
                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          // Add the edit functionality here (e.g., navigate to edit page)
                          setMenuOpen(false);
                        }}
                        className="w-full text-left py-2 px-4 hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          // handleDeleteUser(user._id || "");
                          setMenuOpen(false);
                        }}
                        className="w-full text-left py-2 px-4 hover:bg-gray-200 text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Line Divider between users */}
              {index < filteredUsers.length - 1 && (
                <div className="border-t border-gray-300 w-full"></div>
              )}
            </div>
          ))
        )}

        {/* Pagination */}
        {!searching && ( // When searchbox is empty, display pagination
          <Pagination
            count={count}
            limit={10}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>


      {/* Dialog Box for confirming bulk delete */}
      <DialogBox
        isOpen={isDialogOpen}
        title="Delete Selected Users"
        message="Are you sure you want to delete these users?"
        onCancel={cancelDelete}
        onConfirm={confirmDeleteSelectedUsers}
      />


    </div>

  );
};

export default Users;





