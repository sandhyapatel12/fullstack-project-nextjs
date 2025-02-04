"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store/globalstore";
import FadeLoader from "react-spinners/FadeLoader";
import { createUser } from "@/app/slices/AdminSlice/userSlice";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AddUser = () => {

  const [formVisible, setFormVisible] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    isAdmin: false,
    isActive: true,
    message: "",
    user_img: ""
  });

  const [formError, setFormError] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { status, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    setFormVisible(true);
  }, []);


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

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      setFormError("Missing required fields");
      return;
    }
    setFormError("");

    try {
      await dispatch(createUser(formData)).unwrap();
      router.push("/admin/dashboard/users");   //after creating new user redirect at
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  if (status === "loading") {
    return (
      <div className="mt-20 flex items-center justify-center">
        <FadeLoader />
      </div>
    );
  }

  return (
    <div className="  flex items-center justify-center mt-9">
      <div
        className={`bg-white opacity-85   shadow-lg rounded-lg py-4 px-3 w-full max-w-5xl relative transform transition-all duration-500 ease-in-out ${formVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
      >
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
        <form onSubmit={handleCreateUser} className="space-y-3 px-5 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div className="mt-5">
              <label className="block mb-2">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#38761d] rounded " autoFocus />
            </div>
            <div className="mt-5">
              <label className="block mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border  border-[#38761d]  rounded" />
            </div>
            <div>
              <label className="block mb-2">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#38761d]  rounded" />
            </div>
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
          <button type="submit" className="w-full bg-[#38761d] text-white py-2 rounded hover:bg-[#6aa84f]">
            Add User +
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;




