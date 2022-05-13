import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData, UserResData } from "../utils/types";

const initialState = [] as unknown as [UserData];

const proposeSlice = createSlice({
  name: "proposes",
  initialState,
  reducers: {
    addPropose: {
      reducer: (state, action: PayloadAction<UserData>) => {
        if (!state.find((friend) => friend.email === action.payload.email)) {
          state.push(action.payload);
        }
      },
      prepare: (
        email: string,
        name?: string,
        avatar?: string,
        phones?: [string]
      ) => ({
        payload: {
          email,
          name,
          avatar,
          phones,
        } as UserResData,
      }),
    },
    removePropose(state, action: PayloadAction<string>) {
      const index = state.findIndex(
        (friend) => friend.email === action.payload
      );
      state.splice(index, 1);
    },
    resetProposes(state, action) {
      if (action.payload) {
        state.splice(0);
      }
    },
  },
});

export const { addPropose, removePropose, resetProposes } =
  proposeSlice.actions;
export default proposeSlice.reducer;
