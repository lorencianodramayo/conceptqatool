import { createSlice } from "@reduxjs/toolkit";

export const playgroundSlice = createSlice({
  name: "playground",
  initialState: {
    value: {
      data: [],
      selected: [],
      selectedID: '',
      selectedWidth: '',
      selectedHeight: '',
      selectedCount: 0,
      selectedName: '',
      selectedURL: "",
      selectedPV: [],
      selectedDV: [],
      entity: {},
      settings: [],
    },
  },
  reducers: {
    setData: (state, action) => {
      state.value.data = [action.payload, ...state.value.data];
    },
    setSelected: (state, action) => {
      state.value.selected = action.payload.dynamicElements;
      state.value.selectedURL = `https://storage.googleapis.com/adlib-showcase-bucket/${
        action.payload.uid
      }/${decodeURIComponent(action.payload.directory)}/index.html`;
      state.value.selectedID = action.payload._id;
      state.value.selectedCount = action.payload.dynamicElements.length;
      state.value.selectedPV = action.payload.possibleValues;
      state.value.selectedDV = action.payload.dynamicValues;
      state.value.selectedName = action.payload.name;
      state.value.selectedWidth = `${action.payload.size.split("x")[0]}px`;
      state.value.selectedHeight = `${action.payload.size.split("x")[1]}px`;
    },
    setEntity: (state, action) => {
      state.value.entity[state.value.selectedID] = action.payload;
    }
  },
});

export const { setData, setSelected, setEntity } = playgroundSlice.actions;

export default playgroundSlice.reducer;
