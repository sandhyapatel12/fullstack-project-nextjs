import { configureStore } from '@reduxjs/toolkit';
import  userReducer  from '../slices/AdminSlice/userSlice'
import searchReducer from '../slices/AdminSlice/searchSlice'

const store = configureStore({
  reducer: {
    users: userReducer,
    search: searchReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;



