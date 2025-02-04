// // ROUTE :: GET http://localhost:3000/app/api/search/route.ts

// testing using postman  --> http://localhost:3000/api/search?searchQuery=new user

import { NextResponse } from 'next/server'; // Importing NextResponse to return JSON responses
import { UserModal } from '@/models/userModel'; // Importing the User model to interact with the MongoDB users collection

export async function GET(request: Request) { // This function handles GET requests to the search endpoint
  try {
    // Extract the full URL of the incoming request
    const url = new URL(request.url);
    console.log("url is", url); 
    
    // Get the search query from the URL parameters (e.g., ?searchQuery=john)
    const searchQuery = url.searchParams.get('searchQuery')?.trim().toLowerCase() || '';
    // If the search query exists, trim it (remove extra spaces) and convert it to lowercase for case-insensitive comparison
    // If no search query is provided, default to an empty string

    // Check if searchQuery is empty (i.e., no query parameter provided)
    if (!searchQuery) {
      // If no query is provided, return an empty list of users with a message
      return NextResponse.json({
        users: [], // Empty array since no search was provided
        message: 'Please provide a search query.'
      });
    }

    // Perform a search in the MongoDB users collection to find users with usernames or emails matching the searchQuery
    const users = await UserModal.find({
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } }, // Search by username (case-insensitive)
        { email: { $regex: searchQuery, $options: 'i' } } // Search by email (case-insensitive)
      ]
    });

    // Check if any users were found
    if (users.length > 0) {
      // If users are found, return them with a success message
      return NextResponse.json({
        users, // Return the found users
        message: 'Users found successfully.' // Message indicating users were found
      });
    } else {
      // If no users were found, return an empty array and a "not found" message
      return NextResponse.json({
        users: [], // Empty array as no users matched the search
        message: 'No users found matching the search query.' // Message indicating no users were found
      });
    }
  } catch (error) {
    // If an error occurs (e.g., MongoDB query fails), log the error and return a 500 status with an error message
    console.error('Error fetching users:', error); // Log the error for debugging
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 }); // Return a 500 status with an error message
  }
}

