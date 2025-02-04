
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  _id?: string;
  id?: string;
  user_img?: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  createdAt?: string;
  isAdmin: boolean;
  isActive: boolean;
}


export interface AllUser {
  _id?: string;
  id?: string;
  user_img?: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  createdAt?: string;
  isAdmin: boolean;
  isActive: boolean;
}

// Fetch users accroding pagination
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ q = "", page = 1, limit = 10 }: { q?: string; page?: number; limit?: number }) => {
    const response = await axios.get(`/api/users?q=${q}&page=${page}&limit=${limit}`);
    return response.data;
  }
);

//fetch all users
export const fetchAllUsers = createAsyncThunk("users/fetchAllUsers", async () => {
  try {
    const response = await axios.get("/api/users/fetchallUsers"); // Replace with your API endpoint
    console.log("data is", response.data);
    
    return response.data; // Axios stores the response data in the `data` field
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
});


// Create a new user
export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData: User, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/users", userData); // Replace with your API endpoint
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a specific user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/users/${userId}`);
      if (response.status !== 200) {
        throw new Error("Failed to delete user");
      }
      return userId; // Return the userId to remove from the state
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete user");
    }
  }
);

// Update a specific user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (
    { userId, updatedData }: { userId: string; updatedData: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/api/users/${userId}`, updatedData);
      if (response.status !== 200) {
        throw new Error("Failed to update user");
      }
      return response.data; // Return the updated user data
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update user");
    }
  }
);

interface UsersState {
  users: User[];
  allUsers: AllUser[];
  count: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  users: [],  //store users in an array (pagination wise)
  allUsers: [],  //store all users in an array 
  count: 0,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users accroding pagination---------------------------------------------------------------------------------------------------------
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<{ count: number; userData: User[] }>) => {
        state.status = "succeeded";
        state.users = action.payload.userData;
        state.count = action.payload.count;

        // Sort users by createdAt (most recent first)
        state.users.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      })

      // Create user---------------------------------------------------------------------------------------------------------
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        state.users.unshift(action.payload); // Add new user to the beginning
        state.count += 1; // Increment total count

        // Sort users by createdAt (most recent first)
        state.users.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Delete user---------------------------------------------------------------------------------------------------------
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.users = state.users.filter((user) => user._id !== action.payload);
        state.count -= 1; // Decrement total count
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Update user---------------------------------------------------------------------------------------------------------
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = "succeeded";
        const index = state.users.findIndex((user) => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }

        // Sort users by createdAt (most recent first)
        state.users.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      //fetch all users -----------------------------------------------------------------------------------------------
      .addCase(fetchAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<{ count: number; userData: AllUser[] }>) => {
        // console.log('Fetched users:', action.payload.userData); // Add this line
        state.status = "succeeded";
        state.allUsers = action.payload.userData; // Set fetched all users
        state.count = action.payload.count;

      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});


  
    

export default userSlice.reducer;
