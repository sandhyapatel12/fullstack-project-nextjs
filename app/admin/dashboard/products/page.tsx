// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { FaSearch } from "react-icons/fa";
// import Pagination from "@/app/ui/dashboard/pagination/Pagination";
// // import { searchParams } from "next/navigation";

// type Product = {
//   id: string,
//   title: string,
//   desc: string;
//   product_img: string
//   price: number;
//   color: string;
//   size: string;
//   stock: number,
//   createdAt: string;
// };

// // Props for the Users component
// interface ProductProps {
//   searchParams: {
//     q?: string; // Query string for search
//     page?: number; // Page number for pagination
//   };
// }

// const Products: React.FC<ProductProps> = async ({ searchParams }) => {

//   const q = searchParams?.q || "";
//   const page = searchParams?.page || 1;

//   // Fetch users and count
//   const { count, productData }: { count: number, productData: Product[] } = await fetchProduct({ q, page });


//   return (
//     <div className="p-5 bg-gray-100 min-h-screen">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-5">
//         {/* Search Bar */}
//         <div className="relative w-full max-w-xs">
//           <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
//             <FaSearch className="text-gray-500" />
//           </span>
//           <input
//             type="text"
//             placeholder="Search products..."
//             className="w-full bg-white border py-2 pl-10 pr-4 rounded-md text-gray-700 focus:outline-none shadow"
//           />
//         </div>

//         {/* Add Product Button */}
//         <Link href="/admin/dashboard/products/addproduct">
//           <button className="bg-purple-600 hover:bg-purple-700 py-2 px-5 rounded text-white shadow">
//             Add Product
//           </button>
//         </Link>
//       </div>

//       {/* Products Table */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Table Header */}
//         <div className="grid grid-cols-6 bg-gray-200 text-gray-700 font-bold py-3 px-5">
//           <div>Product</div>
//           <div>Description</div>
//           <div className="ml-10">Price</div>
//           <div>Created At</div>
//           <div>Stock</div>
//           <div className="text-center">Actions</div>
//         </div>

//         {/* Product Rows */}
//         {productData?.map(( curProduct : Product ) => (
//           <div
//             key={curProduct.id}
//             className="grid grid-cols-6  items-center py-3 px-5 border-t hover:bg-gray-50"
//           >
//             {/* Product Info */}
//             <div className="flex items-center space-x-3">
//               <Image
//                               src={curProduct.product_img || "/default-product.jpg"}

//                 alt={curProduct.title}
//                 width={40}
//                 height={40}
//                 className="w-10 h-10 object-cover rounded-md"
//               />
//               <span className="font-medium text-gray-800">
//                 {curProduct.title}
//               </span>
//             </div>

//             {/* Description */}
//             <div className="text-gray-600 truncate">{curProduct.desc}</div>

//             {/* Price */}
//             <div className="text-gray-800 ml-10">{curProduct.price}</div>

//             {/* Created At */}
//             <div className="text-gray-500">{curProduct.createdAt}</div>

//             {/* Stock */}
//             <div
//               className={`font-medium ${curProduct.stock > 0 ? "text-green-600" : "text-red-600"
//                 }`}
//             >
//               {curProduct.stock > 0 ? `${curProduct.stock} in stock` : "Out of stock"}
//             </div>

//             {/* Actions */}
//             <div className="flex justify-center space-x-3">
//               <Link href={`/dashboard/products/${curProduct.id}`}>
//                 <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded shadow">
//                   View
//                 </button>
//               </Link>
//               <button className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded shadow">
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pagination */}
//       <Pagination count={count} />
//     </div>
//   );
// };

// export default Products;
