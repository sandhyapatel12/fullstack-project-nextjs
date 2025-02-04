import { connect } from "@/dbconfig/dbconfig";
import { UserModal } from "@/models/userModel";
import { NextResponse } from "next/server";

// Route: POST http://localhost:3000/api/users/{id}
export const DELETE = async (req: Request, value: any) => {
  try {
    await connect();

    //get user unique id which is created atomatically by mongodb
    const getId = value.params.id; //id  is dynamic route

    //store user id which is created by mongodb into userId variable
    const id = { _id: getId }; //in mongodb user id mention by _id

    const result = await UserModal.findByIdAndDelete(id);

    return NextResponse.json({
      result,
      success: true,
      message: "delete user successfully....",
    });
  } 
  catch (error) {
    return NextResponse.json({
      success: false,
      message: "failed delete process",
    });
  }
};


// Route: PUT http://localhost:3000/api/users/{id}
export const PUT = async (req: Request, { params }: { params: { id: string } }) => {   //id is dynamic route name
  try {
    // Connect to the database
    await connect();

    const { id } = params; // Extract dynamic route parameter
    const { username, email, phone, address, isAdmin, isActive } = await req.json(); // Parse JSON body

    // Find the user by ID and update their details
    const updatedUser = await UserModal.findByIdAndUpdate(
      id,
      {
        username,
        email,
        phone,
        address,
        isAdmin: isAdmin === "true", // Ensure boolean values are handled correctly
        isActive: isActive === "true",
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
};

