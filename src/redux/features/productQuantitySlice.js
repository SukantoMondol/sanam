import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const productQuantitySlice = createSlice({
  name: "productQuantity",
  initialState,
  reducers: {
    totalProductQuantity: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

export const { totalProductQuantity } = productQuantitySlice.actions;

export default productQuantitySlice.reducer;
