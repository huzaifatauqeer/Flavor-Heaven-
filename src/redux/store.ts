// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import itemReducer from "./slices/itemSlice";
import billReducer from "./slices/billSlice";

export const store = configureStore({
  reducer: {
    items: itemReducer,
    bill: billReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
