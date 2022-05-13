import React from "react";
import { Link } from "react-router-dom";
import { LoginProps } from "../../utils/types";
import "./Auth.css";

function Login(props: LoginProps): React.ReactElement {
  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    props.onLogin();
  }

  return (
    <form className="signform">
      <p className="signform__text">Войти</p>
      <fieldset className="signform__fieldset">
        <input
          type="text"
          className="signform__input"
          onChange={(e) => props.setEmail(e.target.value)}
          value={props.email}
          placeholder="Email"
          id="email"
          name="email"
        ></input>
        <label htmlFor="name" className="signform__label">
          Email
        </label>
      </fieldset>
      <fieldset className="signform__fieldset">
        <input
          type="password"
          className="signform__input"
          onChange={(e) => props.setPassword(e.target.value)}
          value={props.password}
          placeholder="Пароль"
          id="pass"
          name="pass"
        ></input>
        <label htmlFor="pass" className="signform__label">
          Пароль
        </label>
      </fieldset>
      <button
        type="submit"
        className=" signform__submit"
        onClick={handleSubmit}
      >
        Войти
      </button>
      <Link to="/signup" onClick={props.changeLink} className="signform__link">
        Еще не зарегистрированы? Регистрация
      </Link>
    </form>
  );
}

export default Login;
