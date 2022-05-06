import { Dispatch, SetStateAction } from "react";

export interface Todo {
  id: string;
  description: string;
  completed: boolean;
}

export interface UserData {
  email: string;
  password: string;
}

interface AuthData extends UserData {
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

export interface HeaderProps {
  loggedIn: boolean;
  crossLink: string;
  linkText: string;
  setEnterLink: VoidFunction;
  setRegLink: VoidFunction;
  logOut: VoidFunction;
  setPresentationList: Dispatch<SetStateAction<boolean>>;
}

export interface MainProps {
  loggedIn: boolean;
  presentationList: boolean;
}

export interface ProptectedRouteProps extends MainProps {
  component: React.FC;
  exact: boolean;
  path: string;
}
