import React from "react";
import { MainProps } from "../../utils/types";
import Profile from "../Profile/Profile";
import Contacts from "../Contacts/Contacts";
import "./Main.css";

function Main(props: MainProps): React.ReactElement {
  return (
    <section className="Main">
      <Profile
        isMobileMenuOpen={props.isMobileMenuOpen}
        logOut={props.logOut}
      />
      <Contacts
        presentationList={props.presentationList}
        propose={props.propose}
        width={props.width}
      />
    </section>
  );
}

export default Main;
