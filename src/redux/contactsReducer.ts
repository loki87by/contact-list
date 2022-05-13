import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserResData } from "../utils/types";

const initialState = [] as unknown as [UserResData];

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    addContact: {
      reducer: (state, action: PayloadAction<UserResData>) => {
        if (
          !state.find(
            (contact) =>
              (contact.id as string).replace(/\D/gi, "") ===
              action.payload.index
          ) &&
          !state.find((contact) => contact.id === action.payload.index)
        ) {
          state.push(action.payload);
        }
      },
      prepare: (
        name?: string,
        email?: string,
        avatar?: string,
        phones?: [string],
        quote?: string,
        index?: string
      ) => ({
        payload: {
          name,
          email,
          avatar,
          phones,
          quote,
          id: `contact-${index?.replace(/\D/gi, "")}`,
        } as UserResData,
      }),
    },
    removeContact(state, action: PayloadAction<string>) {
      const index = state.findIndex((contact) => contact.id === action.payload);
      state.splice(index, 1);
    },
    updateContacts(
      state,
      action: PayloadAction<{
        id: string;
        value: string;
        description: string | [string];
      }>
    ) {
      const index = state.findIndex(
        (contact) => contact.id === action.payload.id
      );
      state[index][action.payload.value] = action.payload.description;
    },
    resetContacts(state, action) {
      if (action.payload) {
        state.splice(0);
      }
    },
  },
});

export const { addContact, removeContact, updateContacts, resetContacts } =
  contactsSlice.actions;
export default contactsSlice.reducer;
