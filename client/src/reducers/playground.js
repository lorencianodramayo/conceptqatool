import { createSlice } from "@reduxjs/toolkit";

export const playgroundSlice = createSlice({
  name: "playground",
  initialState: { value: { templates: [] } },
  reducers: {
    get: (state, action) => {
      state.value = action.payload;
    },
  },
});

export default playgroundSlice.reducer;
