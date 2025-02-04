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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    <div className="p-4 flex items-center justify-center mt-10">
      <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-3xl relative">
        <div className="relative flex items-center justify-center mb-10">
          <div className="absolute -top-16 w-32 h-32 rounded-full bg-white">
            <div className="relative w-32 h-32 rounded-full ring-4 ring-white shadow-2xl overflow-hidden">
              <Image
                src={formData.user_img || "/unknown.svg"} // Changed from img to user_img
                alt="User Profile"
                layout="fill"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <form className="space-y-6 mt-20" onSubmit={handleUpdateUser}>
          <div className="grid px-5 grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-black font-bold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-black font-bold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-black font-bold mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-black font-bold mb-2">Is Admin?</label>
              <select
                name="isAdmin"
                value={formData.isAdmin ? "true" : "false"}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-black font-bold mb-2">Is Active?</label>
              <select
                name="isActive"
                value={formData.isActive ? "true" : "false"}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-black font-bold mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition duration-200"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePage;
