//update user data

"use client";
import { fetchUsers, updateUser } from "@/app/slices/AdminSlice/userSlice";
import { useState, useEffect } from "react";
import Image from "next/image";
import { use } from "react"; // Import React.use() for unwrapping the Promise
import { AppDispatch, RootState } from "@/app/store/globalstore";
import FadeLoader from "react-spinners/FadeLoader";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

interface User {
  _id?: string;
  user_img: string; // Changed from img to user_img
  username: string;
  email: string;
  phone: string; // Assuming phone is a string
  address: string;
  isAdmin: boolean;
  isActive: boolean;
}

interface ViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

const UpdatePage = ({ params }: ViewPageProps) => {

  // Unwrap the params to get the id
  const { id } = use(params);
  console.log("update user id is:", id);

  const dispatch = useDispatch<AppDispatch>();
  const { status, error, users } = useSelector((state: RootState) => state.users);
  console.log("user is:", users);



  // Set form data initially from users state
  const [formData, setFormData] = useState<User>({
    user_img: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    isAdmin: false,
    isActive: false,
  });


  const router = useRouter()

  // Fetch user data when the component mounts or when the id changes
  useEffect(() => {
    if (id) {
      // Adjust the dispatch call to pass the correct object shape
      dispatch(fetchUsers({ q: id })); // Passing `id` as the query param (assuming `q` is for filtering by `id`)
    }
  }, [id, dispatch]);

  // Once users are fetched, populate form data
  useEffect(() => {
    if (users && users.length > 0) {
      const user = users.find((user) => user._id === id); // Adjust this condition based on how you fetch users
      if (user) {
        setFormData({
          user_img: user.user_img || "", // Changed from img to user_img
          username: user.username,
          email: user.email,
          phone: user.phone,
          address: user.address,
          isAdmin: user.isAdmin,
          isActive: user.isActive,
        });
      }
    }
  }, [users, id]);

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : name === "isAdmin" || name === "isActive"
          ? value === "true"
          : value;
  
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };
  

  // Handle update user data
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();

    // Dispatch the update action with the correct structure
    dispatch(updateUser({
      userId: id,  // This is the correct name expected in the action payload
      updatedData: formData,  // The updated user data
    }));
    alert("user update successfully...")
    router.push('/admin/dashboard/users')
  };

  if (status === "loading") {
    return (
      <div className="mt-20 flex items-center justify-center">
        <FadeLoader />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-5 bg-gray-100 min-h-screen">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
     <div className="  flex items-center justify-center mt-12 mb-5 md:mt-0 md:mb-0  md:h-[calc(100vh-60px)]">
         <div className="bg-white opacity-90   shadow-lg rounded-lg py-4 px-3 w-full max-w-4xl relative ">
           <div className="relative flex items-center justify-center mb-10">
             <div className="absolute -top-12 w-24 h-24 rounded-full bg-white opacity-90">
               <div className="relative flex items-center justify-center w-24 h-24 rounded-full ring-4 ring-white shadow-2xl overflow-hidden">
                 <Image
                   src={formData?.user_img || "/user2.png"}
                   alt="User Profile"
                   width={80}
                   height={80}
                   className="object-cover"
                 />
               </div>
             </div>
           </div>
           <form onSubmit={handleUpdateUser} className=" px-5 mt-14 text-sm ">

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
               <div className="mt-5">
                 <label className="block mb-2">Username</label>
                 <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#38761d] rounded " autoFocus />
               </div>
               <div className="mt-5">
                 <label className="block mb-2">Email</label>
                 <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border  border-[#38761d]  rounded" />
               </div>
               {/* <div>
                 <label className="block mb-2">Password</label>
                 <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#38761d]  rounded" />
               </div> */}
               <div>
                 <label className="block mb-2">Phone</label>
                 <input type="number" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#38761d]  rounded" />
               </div>
               <div>
                 <label className="block mb-2">Is Admin?</label>
                 <select name="isAdmin" value={formData.isAdmin ? "true" : "false"} onChange={handleInputChange} className="w-full border-[#38761d]  px-4 py-2 border rounded">
                   <option value="true">Yes</option>
                   <option value="false">No</option>
                 </select>
               </div>
               <div>
                 <label className="block mb-2">Is Active?</label>
                 <select name="isActive" value={formData.isActive ? "true" : "false"} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#38761d]  rounded">
                   <option value="true">Yes</option>
                   <option value="false">No</option>
                 </select>
               </div>
               <div>
                 <label className="block mb-2">Address</label>
                 <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-2 border  border-[#38761d] rounded" />
               </div>
             </div>

             <button type="submit" className="w-full bg-[#38761d] text-white py-2 rounded hover:bg-[#6aa84f] mt-5 ">
               Update
             </button>

           </form>
         </div>
       </div>
  );
};

export default UpdatePage;
