// import * as actions from './actionTypes';

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
/* import { Todo } from "../utils/types";
import { v4 as uuidv4 } from "uuid"; */
import { UserData, UserResData } from "../utils/types";
 
const initialState = [] as unknown as [UserData];
 
const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    addContact: {
      reducer: (state, action: PayloadAction<UserData>) => {
        state.push(action.payload);
      },
      prepare: (name?: UserResData, email?: UserResData, avatar?: UserResData, phones?: UserResData, quote?: UserResData, index?: string) => ({
        payload: {
          name,
          email,
          avatar,
          phones,
          quote,
          id: `contact-${index}`
        } as UserData,
      }),
    },
    removeContact(state, action: PayloadAction<string>) {
      const index = state.findIndex((friend) => friend.id === action.payload);
      state.splice(index, 1);
    },
    updateContacts(
      state,
      action: PayloadAction<{ id: string; value: string; description: string }>
    ) {
      const index = state.findIndex((friend) => friend.id === action.payload.id);
      state[index][action.payload.value] = action.payload.description;
    },
  },
});
 
export const { addContact, removeContact, updateContacts } = contactsSlice.actions;
export default contactsSlice.reducer;