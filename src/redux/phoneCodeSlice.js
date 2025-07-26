import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching doctors
export const fetchPhoneCodes = createAsyncThunk(
  'phoneCodes/fetchPhoneCodes',
  async ({ API_URL}) => {

    const response = await fetch(`${API_URL}getPhoneCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json(); // ✅ Parse the JSON
    return data.data || []; // ✅ Fallback to empty array if data is null
  }
);

const phoneCodesSlice = createSlice({
  name: 'phoneCodes',
  initialState: {
    phoneCodes: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhoneCodes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPhoneCodes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.phoneCodes = action.payload;
      })
      .addCase(fetchPhoneCodes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default phoneCodesSlice.reducer;
