import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig"; // MongoDB connection logic

import { ProductModel } from "@/models/productModel";

// ROUTE :: http://localhost:3000/api/products
export async function POST(request: Request) {
  try {
    // Parse the incoming JSON request body
    const { title, desc, price, color, size, stock } = await request.json();

    // Check if all required fields are provided
    if (!title || !desc || !price  || !color || !size || !stock) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // Connect to the database
    await connect();

    // Create a new user document
    const newUser = new ProductModel({
      title,
      desc,
      price, // Password will be hashed automatically before saving
      color,
      size,
      stock, // Convert to boolean if passed as string
    });

    // Save the user to the database
    await newUser.save();

    // Return a success response
    return NextResponse.json({ success: true, message: "product uploaded successfully" }, { status: 201 });
  } catch (error) {
    console.error("upload product error:", error);
    return NextResponse.json({ success: false, message: "Failed to upload product" }, { status: 500 });
  }
}
