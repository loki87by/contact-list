import React from "react";
import Profile from "../Profile/Profile";
// import { MainProps } from "../../utils/types";
import "./Main.css";

function Main(/* props: MainProps */): React.ReactElement {
  return (
    <section className="Main">
      <Profile/>
    </section>
  );
}

export default Main;
