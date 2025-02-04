"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const AddProductPage = () => {

  //set default value as a new user data
  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    price: 0,
    size: "",
    stock: 0,
    color: "",
    product_img: "",
  });

  //for upload image from gallery
  const [imagePreview, setImagePreview] = useState<string | null>(null);


  const Router = useRouter()

  // Handle text inputs and select dropdowns
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  //handle submit form data
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      //api call
      const response = await axios.post("/api/products", formData,
       {
        headers: { "Content-Type": "application/json" },

      });
      console.log("Product added successfully:", response.data);
      Router.push('/admin/dashboard/products')
    } catch (error: any) {
      console.error("Failed to add user:", error?.response?.data || error.message);
    }
  };

  // Handle file upload and preview
  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => setImagePreview(reader.result as string);
  //     reader.readAsDataURL(file);
  //   }
  // };

  return (
    <div className="flex justify-center items-center ">
      <form
      onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-6xl"
      >
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Add New Product
        </h2>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">

            {/* title */}
            <input
              value={formData.title}
              onChange={handleChange}
              type="text"
              placeholder="Title"
              name="title"
              required
              className="w-full px-4 py-4 border  border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* category */}
            {/* <select
              value={formData.username}
              onChange={handleChange}
              name="cat"
              id="cat"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="general">Choose a Category</option>
              <option value="kitchen">Kitchen</option>
              <option value="phone">Phone</option>
              <option value="computer">Computer</option>
            </select> */}

            {/* price */}
            <input
              value={formData.price}
              onChange={handleChange}
              type="number"
              placeholder="Price"
              name="price"
              required
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* stock */}
            <input
              value={formData.stock}
              onChange={handleChange}
              type="number"
              placeholder="Stock"
              name="stock"
              required
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* image */}
            <label className="block text-gray-700 font-bold mb-2" htmlFor="image">
              Upload Product Image
            </label>
            <input
              value={formData.product_img}
              onChange={handleChange}
              type="file"
              id="image"
              accept="image/*"
              // onChange={handleImageUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

          </div>

          {/* Right Column */}
          <div className="space-y-4">

            {/* color */}
            <input
              value={formData.color}
              onChange={handleChange}
              type="text"
              placeholder="Color"
              name="color"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* size */}
            <input
              value={formData.size}
              onChange={handleChange}
              type="text"
              placeholder="Size"
              name="size"
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {/* address */}
            <textarea
              value={formData.desc}
              onChange={handleChange}
              required
              name="desc"
              id="desc"
              placeholder="Description"
              rows={4}
              className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>

            {/* Image preview */}
            <div className="mt-2">

              {imagePreview && (
                <div className="mt-3">
                  <p className="text-gray-700 mb-2">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Uploaded Preview"
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="w-full  font-bold md:w-auto bg-purple-600 text-white py-2 px-8 rounded-lg hover:bg-purple-700 transition-all duration-300"
          >
            Add +
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
