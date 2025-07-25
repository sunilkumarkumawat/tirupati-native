import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import genderReducer from './genderSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    gender: genderReducer,
  },
});
