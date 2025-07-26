import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching doctors
export const fetchSalutations = createAsyncThunk(
  'salutation/fetchSalutations',
  async ({ API_URL}) => {

    const response = await fetch(`${API_URL}getPatientSalutation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json(); // ✅ Parse the JSON
    return data.data || []; // ✅ Fallback to empty array if data is null
  }
);

const salutationsSlice = createSlice({
  name: 'salutations',
  initialState: {
    salutations: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalutations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSalutations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.salutations = action.payload;
      })
      .addCase(fetchSalutations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default salutationsSlice.reducer;
