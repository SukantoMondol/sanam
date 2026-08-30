import { configureStore } from "@reduxjs/toolkit";
import productQuantityReducer from "@/redux/features/productQuantitySlice";

export const store = configureStore({
  reducer: {
    totalProductQuantity: productQuantityReducer,
  },
});
