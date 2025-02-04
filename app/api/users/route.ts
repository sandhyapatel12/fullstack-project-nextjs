import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import { UserModal } from "@/models/userModel";

// Route: POST http://localhost:3000/api/users
// Create a new user
export async function POST(request: Request) {
  try {
    const { username, email, password, phone, address, isAdmin, isActive } =
      await request.json();

    // Check if all required fields are provided
    if (!username || !email || !password || !phone || !address) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connect();

    // Check for existing email
    const existingUser = await UserModal.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 409 }
      );
    }

    // Create a new user document
    const newUser = new UserModal({
      username,
      email,
      password,
      phone,
      address,
      isAdmin: Boolean(isAdmin),
      isActive: Boolean(isActive),
    });

    // Save the user
    await newUser.save();

    return NextResponse.json(
      { success: true, message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create user" },
      { status: 500 }
    );
  }
}

// Route: GET http://localhost:3000/api/users?page=2
// Fetch users with pagination and search
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10); // Default set to 10 users per page

    await connect();

    // if search query exists, filter by username otherwise fetch all users
    const filterCriteria = q ? { username: { $regex: q, $options: "i" } } : {};

    //find total users count
    const totalUsers = await UserModal.countDocuments(filterCriteria);

    const userData = await UserModal.find(filterCriteria)
      .sort({ createdAt: -1 }) // Sort in descending order  (display the latest user first)
      .skip((page - 1) * limit)
      .limit(limit);

    // Count the total users on the current page
    const currentPageUsersCount = userData.length;

    return NextResponse.json(
      {
        success: true,
        count: totalUsers, // Total users based on filter criteria
        currentPageUsersCount, // Users count for the current page
        userData, // Users data for the current page
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
