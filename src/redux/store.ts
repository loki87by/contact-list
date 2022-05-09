import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import contactsReducer from "./contactsReducer";
import friendsReducer from "./friendsReducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    contacts: contactsReducer,
    friends: friendsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
