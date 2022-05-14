import { Dispatch, SetStateAction } from "react";

interface UserLoginData {
  email: string;
  password: string;
}

interface AuthData extends UserLoginData {
  changeLink: VoidFunction;
  setEmail: Dispatch<SetStateAction<string>>;
  setPassword: Dispatch<SetStateAction<string>>;
}

export interface LoginProps extends AuthData {
  onLogin: VoidFunction;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
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
  crossLink: string;
  linkText: string;
  loggedIn: boolean;
  width: number;
  logOut: VoidFunction;
  setEnterLink: VoidFunction;
  setPresentationList: Dispatch<SetStateAction<boolean>>;
  setRegLink: VoidFunction;
  toogleMobileMenu: VoidFunction;
}

export interface ProfileProps {
  isMobileMenuOpen: boolean;
  logOut: VoidFunction;
}

export interface ContactsProps {
  presentationList: boolean;
  propose: [UserData];
  width: number;
}

export interface MainProps extends ProfileProps, ContactsProps {}

export interface ProptectedRouteProps extends MainProps {
  component: React.FC<MainProps>;
  exact: boolean;
  loggedIn: boolean;
  path: string;
}

export interface CardProps {
  data: UserData;
  presentationList: boolean;
  width: number;
  setContextMenuData: Dispatch<SetStateAction<LoginResData>>;
  setContextMenuFriend: Dispatch<SetStateAction<boolean>>;
  setContextMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export interface ProposeProps {
  user: UserData;
  addToFriends: (user: UserData) => void;
}
