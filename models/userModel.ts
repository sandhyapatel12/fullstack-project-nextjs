import mongoose, { Model } from "mongoose";
// import bcrypt from "bcryptjs";

// Define the interface for User data
interface UserData {
  _id?: string;
  username: string;
  email: string;
  password: string;
  user_img: string;
  isActive: boolean;
  isAdmin: boolean;
  phone: number;
  address: string;
  createdAt: Date;
}

// Define the schema for the user collection
const userSchema = new mongoose.Schema<UserData>(
  {
    
    username: {
      type: String,
      required: [true, "Please provide a valid username"],
      // minlength: 3,
      // maxlength: 20,
    },
    email: {
      type: String,
      // required: [true, "Please provide an email"],
      // unique: true,
    },
    password: {
      type: String,
      // required: [true, "Please provide a password"],
    },
    user_img: {
      type : String,
      // required: [true, "provide user profile photo"]
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt
);


// Create the user model
export const UserModal: Model<UserData> =
  mongoose.models.users || mongoose.model("users", userSchema);
