



/// ----------------------------right code but with pagination----------------------

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk to fetch users based on the search query
export const fetchSearchUsers = createAsyncThunk(
  "search/fetchSearchUsers",
  async (searchQuery: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/search?searchQuery=${searchQuery}`);
      console.log(response.data.users);
      
      return response.data.users;
    } catch (error : any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  searchQuery: "",
  filteredUsers: [],
  loading: false,
  error: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSearchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredUsers = action.payload;
        state.error = "";
      })
      .addCase(fetchSearchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string|| "Failed to fetch users.";
      });
  },
});

export const { setSearchQuery } = searchSlice.actions;

export default searchSlice.reducer;
