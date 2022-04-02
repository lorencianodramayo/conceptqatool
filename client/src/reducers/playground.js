import { createSlice } from "@reduxjs/toolkit";

export const playgroundSlice = createSlice({
  name: "playground",
  initialState: { value: { data: [], selected: [], selectedCount: 0, settings: [] } },
  reducers: {
    setData: (state, action) => {
        state.value.data = [action.payload, ...state.value.data];
    },
    setSelected: (state, action) => {
      state.value.selectedCount = action.payload.dynamicElements.length;
      state.value.selected = action.payload.dynamicElements;
    }
  },
});

export const { setData, setSelected } = playgroundSlice.actions;

export default playgroundSlice.reducer;
