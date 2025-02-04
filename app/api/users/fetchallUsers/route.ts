
// Route: GET http://localhost:3000/api/users/fetchallUsers

import { connect } from "@/dbconfig/dbconfig";
import { UserModal } from "@/models/userModel";
import { NextResponse } from "next/server";

// Fetch all users without pagination
export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const q = searchParams.get("q") || ""; // Optional search query parameter
  
      await connect();

      const filterCriteria = q
        ? { username: { $regex: q, $options: "i" } } // If search query exists, filter by username (case-insensitive)
        : {}; // If no query, fetch all users

       //find total users count
      const totalUsers = await UserModal.countDocuments(filterCriteria);
  
      // Fetch all users matching the filter criteria without pagination
      const userData = await UserModal.find(filterCriteria).sort({ createdAt: -1 });
  
      return NextResponse.json(
        { success: true, 
          count: totalUsers,
          userData },
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
  