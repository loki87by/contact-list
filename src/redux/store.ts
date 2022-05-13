import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import contactsReducer from "./contactsReducer";
import friendsReducer from "./friendsReducer";
import proposeReducer from "./proposeReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    contacts: contactsReducer,
    friends: friendsReducer,
    proposes: proposeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
