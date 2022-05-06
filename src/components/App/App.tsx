import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import * as Auth from "../../utils/Auth";
import { LoginResData } from "../../utils/types";
import "./App.css";

function App(): React.ReactElement {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [headerData, setHeaderData] = React.useState({
    crossLink: "/signin",
    linkText: "Вход",
  });

  const history = useHistory();

  React.useEffect(() => {
    if (localStorage.getItem("jwt")) {
      setLoggedIn(true);
      setHeaderData({
        crossLink: "/",
        linkText: "Выход",
      });
      history.push("/");
    }
  }, [history]);

  function setEnterLink() {
    setHeaderData({ crossLink: "/signup", linkText: "Регистрация" });
  }
  function setRegLink() {
    setHeaderData({ crossLink: "/signin", linkText: "Войти" });
  }

  function handleLogin() {
    Auth.login(email, password)
      .then((data) => {
        if (data) {
          setLoggedIn(true);
          setEmail("");
          setPassword("");
          setHeaderData({
            crossLink: "/",
            linkText: "Выход",
          });
          history.push("/");
          return;
        }
      })
      .catch((err) => console.log(err));
  }

  function onRegister() {
    Auth.register(email, password)
      .then((res) => {
        if (res) {
          history.push("/signin");
        }
      })
      .catch((err: LoginResData) => alert(err.message));
  }

  function logOut() {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    setHeaderData({
      crossLink: "/signin",
      linkText: "Войти",
    });
    history.push("/signup");
  }

  return (
    <>
      <Header
        loggedIn={loggedIn}
        crossLink={headerData.crossLink}
        linkText={headerData.linkText}
        setEnterLink={setEnterLink}
        setRegLink={setRegLink}
        logOut={logOut}
      />
      <main className="content">
        <Switch>
          <ProtectedRoute exact path="/" loggedIn={loggedIn} component={Main} />
          <Route path="/signup">
            <Register
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              onRegister={onRegister}
              changeLink={setEnterLink}
            />
          </Route>
          <Route path="/signin">
            <Login
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              onLogin={handleLogin}
              changeLink={setRegLink}
              setLoggedIn={setLoggedIn}
            />
          </Route>
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signup" />}
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;
