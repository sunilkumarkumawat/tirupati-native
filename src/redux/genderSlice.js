import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Strings } from '../theme/Strings';

// Async thunk for fetching genders
export const fetchGenders = createAsyncThunk(
  'genders/fetchGenders',
  async ({ API_URL}) => {
    const response = await fetch(`${API_URL}getGender`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json(); // <-- Parse JSON manually
//Alert.alert('Gender', JSON.stringify(data, null, 2));
//console.log('Gender:', data.data || 'Unknown error');
    return data.data; // Safely return the gender data array
  }
);

const gendersSlice = createSlice({
  name: 'genders',
  initialState: {
    genders: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGenders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.genders = action.payload;
      })
      .addCase(fetchGenders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default gendersSlice.reducer;
