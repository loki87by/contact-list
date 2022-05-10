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

  function setCellsViewType() {
    props.setPresentationList(false);
  }

  function setListViewType() {
    props.setPresentationList(true);
  }

  return (
    <section className="Header">
      {props.loggedIn ? (
        <div className="Header__presentation">
          <button
            onClick={setListViewType}
            className="Header__presentation-button"
          >
            Список
          </button>
          <button
            onClick={setCellsViewType}
            className="Header__presentation-button"
          >
            Плитка
          </button>
        </div>
      ) : (
        ""
      )}
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
