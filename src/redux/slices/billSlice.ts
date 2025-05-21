// src/redux/slices/billSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface BillState {
  paymentMethod: "cash" | "card";
  taxRate: number; // tax percentage
}

const initialState: BillState = {
  paymentMethod: "cash",
  taxRate: 15, // default cash = 15%
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    setPaymentMethod: (state, action: PayloadAction<"cash" | "card">) => {
      state.paymentMethod = action.payload;
      state.taxRate = action.payload === "cash" ? 15 : 5;
    },
  },
});

export const { setPaymentMethod } = billSlice.actions;

// Optional selector for tax total
export const selectTaxAmount = (state: RootState) => {
  const subtotal = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  return (subtotal * state.bill.taxRate) / 100;
};

export default billSlice.reducer;
