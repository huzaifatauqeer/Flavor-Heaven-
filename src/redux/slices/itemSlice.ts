// src/redux/slices/itemSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface FoodItem {
  id: string;
  name: string;
  price: number;
}

interface BillItem extends FoodItem {
  quantity: number;
}

const initialState: BillItem[] = [];

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    addItemToBill: (state, action: PayloadAction<FoodItem>) => {
      const index = state.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state[index].quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },

    removeItemFromBill: (state, action: PayloadAction<string>) => {
      // Remove item based on ID
      return state.filter(item => item.id !== action.payload);
    },

    clearBill: () => {
      // Return empty array
      return [];
    },
  },
});

export const { addItemToBill, removeItemFromBill, clearBill } = itemSlice.actions;
export default itemSlice.reducer;
