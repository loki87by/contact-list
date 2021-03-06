import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../utils/types";

const initialState = {} as UserData;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addValue: (
      state,
      action: PayloadAction<{
        current: string;
        description: string;
        isArray: boolean;
      }>
    ) => {
      if (action.payload.isArray) {
        if (!state[action.payload.current]) {
          const arr = [] as unknown as [string];
          arr.push(action.payload.description);
          state[action.payload.current] = arr as [string];
        } else {
          (state[action.payload.current] as [string]).push(
            action.payload.description
          );
        }
      } else {
        state[action.payload.current] = action.payload.description;
      }
    },
    editValue(
      state,
      action: PayloadAction<{
        current: string;
        description: string;
        index?: number;
      }>
    ) {
      if (action.payload.index) {
        (state[action.payload.current] as [string])[action.payload.index - 1] =
          action.payload.description;
      } else {
        state[action.payload.current] = action.payload.description;
      }
    },
    removeValue(
      state,
      action: PayloadAction<{
        current: string;
        isArray?: boolean;
        index?: number;
      }>
    ) {
      if (action.payload.isArray) {
        (state[action.payload.current] as [string]).splice(
          action.payload.index || 0,
          1
        );
      }
    },
    resetUser(state, action) {
      if (action.payload) {
        state.name = ''
        state.email = ''
        state.avatar = ''
        state.phones = ['']
      }
    },
  },
});

export const { addValue, editValue, removeValue, resetUser } =
  userSlice.actions;
export default userSlice.reducer;
