import React from "react";
import { Link } from "react-router-dom";
import { HeaderProps } from "../../utils/types";
import list from "../../assets/list.svg";
import burger from "../../assets/burger.svg";
import cells from "../../assets/cells.svg";
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
          {props.width > 767 ? (
            <button
              onClick={setListViewType}
              className="Header__presentation-button"
            >
              Список
            </button>
          ) : (
            <img
              src={list}
              alt="Список"
              onClick={setListViewType}
              className="Header__presentation-button"
            />
          )}
          {props.width > 767 ? (
            <button
              onClick={setCellsViewType}
              className="Header__presentation-button"
            >
              Плитка
            </button>
          ) : (
            <img
              src={cells}
              alt="Плитка"
              onClick={setCellsViewType}
              className="Header__presentation-button"
            />
          )}
        </div>
      ) : (
        <div style={{ width: "18%" }}></div>
      )}
      <h1 className="Header__title">Contact-list</h1>
      {props.width > 768 ? (
        <Link
          to={props.crossLink}
          onClick={props.loggedIn ? props.logOut : changeLink}
          className="Header__text"
        >
          {props.linkText}
        </Link>
      ) : (
        <img
          src={burger}
          alt="Меню"
          onClick={props.toogleMobileMenu}
          className="Header__presentation-button Header__presentation-button_mobile"
        />
      )}
    </section>
  );
}

export default Header;
