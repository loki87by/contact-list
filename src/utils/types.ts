import { Dispatch, SetStateAction } from "react";

export interface Todo {
  id: string;
  description: string;
  completed: boolean;
}

interface UserLoginData {
  email: string;
  password: string;
}

interface AuthData extends UserLoginData {
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
  changeLink: VoidFunction;
}

export interface LoginProps extends AuthData {
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  onLogin: VoidFunction;
}

export interface RegisterProps extends AuthData {
  onRegister: VoidFunction;
}

export interface LoginResData {
  [key: string]: string;
}

export interface UserResData {
  [key: string]: string | [string];
}

export interface UserData {
  [key: string]: string | [string] | [UserResData];
}

export interface HeaderProps {
  loggedIn: boolean;
  crossLink: string;
  linkText: string;
  setEnterLink: VoidFunction;
  setRegLink: VoidFunction;
  logOut: VoidFunction;
  setPresentationList: Dispatch<SetStateAction<boolean>>;
}

export interface ProfileProps {
  logOut: VoidFunction;
}

export interface ContactsProps {
  presentationList: boolean;
}

export interface MainProps extends ProfileProps, ContactsProps {}

export interface ProptectedRouteProps extends MainProps {
  component: React.FC<MainProps>;
  loggedIn: boolean;
  exact: boolean;
  path: string;
}

export interface CardProps extends ContactsProps {
  data: UserData;
  setContextMenuOpened: Dispatch<SetStateAction<boolean>>;
  setContextMenuFriend: Dispatch<SetStateAction<boolean>>;
  setContextMenuData: Dispatch<SetStateAction<LoginResData>>;
}

export interface ProposeProps {
  user: UserData
}