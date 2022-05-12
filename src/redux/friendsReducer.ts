import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData, UserResData } from "../utils/types";
 
const initialState = [] as unknown as [UserData]
 
const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    addFriend: {
      reducer: (state, action: PayloadAction<UserData>) => {
        if(!state.find((friend) => friend.email === action.payload.email)) {
        state.push(action.payload);
        }
      },
      prepare: (email: string, name?: string, avatar?: string, phones?: [string]) => ({
        payload: {
          email,
          name,
          avatar,
          phones,
        } as UserResData,
      }),
    },
    removeFriend(state, action: PayloadAction<string>) {
      const index = state.findIndex((friend) => friend.email === action.payload);
      state.splice(index, 1);
    },
    resetFriends(state, action) {
      if (action.payload) {
        state.splice(0)
      }
    }
  },
});
 
export const { addFriend, removeFriend, resetFriends } = friendsSlice.actions;
export default friendsSlice.reducer;