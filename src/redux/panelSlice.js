import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching doctors
export const fetchPanels = createAsyncThunk(
  'panels/fetchPanels',
  async ({ API_URL, branchId, panelid= 0 }) => {

    const response = await fetch(`${API_URL}getPanelData`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ branchId, panelid }), // ✅ Send as JSON string
    });

    const data = await response.json(); // ✅ Parse the JSON
    return data.data || []; // ✅ Fallback to empty array if data is null
  }
);

const panelsSlice = createSlice({
  name: 'panels',
  initialState: {
    panels: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPanels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPanels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.panels = action.payload;
      })
      .addCase(fetchPanels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default panelsSlice.reducer;
