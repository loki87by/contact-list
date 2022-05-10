import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData, UserResData } from "../utils/types";
 
const initialState = [] as unknown as [UserData];
 
const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    addFriend: {
      reducer: (state, action: PayloadAction<UserData>) => {
        state.push(action.payload);
      },
      prepare: (email: UserResData, name?: UserResData, avatar?: UserResData, phones?: UserResData, quote?: UserResData) => ({
        payload: {
          email,
          name,
          avatar,
          phones,
          quote,
        } as UserData,
      }),
    },
    removeFriend(state, action: PayloadAction<string>) {
      const index = state.findIndex((friend) => friend.id === action.payload);
      state.splice(index, 1);
    },
    updateFriend(
      state,
      action: PayloadAction<{ email: string; value: string; description: string }>
    ) {
      const index = state.findIndex((friend) => friend.email === action.payload.email);
      state[index][action.payload.value] = action.payload.description;
    },
  },
});
 
export const { addFriend, removeFriend, updateFriend } = friendsSlice.actions;
export default friendsSlice.reducer;