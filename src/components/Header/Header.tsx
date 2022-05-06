import React from "react";
import { Link } from "react-router-dom";
import { HeaderProps } from "../../utils/types";
import "./Header.css";

function Header(props: HeaderProps): React.ReactElement {
  function changeLink() {
    if (props.crossLink === "/signin") {
      props.setEnterLink();
    } else {
      props.setRegLink();
    }
  }

  return (
    <section className="Header">
      <h1 className="Header__title">Contact-list</h1>
      <Link
        to={props.crossLink}
        onClick={props.loggedIn ? props.logOut : changeLink}
        className="Header__text"
      >
        {props.linkText}
      </Link>
    </section>
  );
}

export default Header;
