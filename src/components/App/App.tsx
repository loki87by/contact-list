import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { addValue } from "../../redux/userReducer";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import * as Auth from "../../utils/Auth";
import * as Api from "../../utils/Api";
import { LoginResData, UserData } from "../../utils/types";
import "./App.css";

function App(): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  const [currentUser, setCurrentUser] = React.useState({});

  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [presentationList, setPresentationList] =
    React.useState<boolean>(false);
  const [headerData, setHeaderData] = React.useState({
    crossLink: "/signin",
    linkText: "Вход",
  });

  console.log(currentUser);

  const setUser = React.useCallback(
    (data: UserData) => {
      setCurrentUser(data);
      const keys = Object.keys(data);
      const values = Object.values(data);
      keys.forEach((key, index) => {
        if (key !== "friends") {
          if (key !== "phones") {
            const dataObject = {
              current: key,
              description: values[index] as string,
              isArray: false,
            };
            dispatch(addValue(dataObject));
          } else {
            (values[index] as [string]).forEach((phone) => {
              const dataObject = {
                current: key,
                description: phone,
                isArray: true,
              };
              dispatch(addValue(dataObject));
            });
          }
        }
      });
    },
    [dispatch]
  );

  React.useEffect(() => {
    if (localStorage.getItem("jwt")) {
      const token = localStorage.getItem("jwt");
      setLoggedIn(true);
      setHeaderData({
        crossLink: "/",
        linkText: "Выход",
      });

      if (token) {
        Auth.getData(token)
          .then((res) => setUser(res as UserData))
          .catch((err) => console.log(err));
        Api.getContacts(token)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      }
      history.push("/");
    }
  }, [history, setUser]);

  function setEnterLink() {
    setHeaderData({ crossLink: "/signup", linkText: "Регистрация" });
  }

  function setRegLink() {
    setHeaderData({ crossLink: "/signin", linkText: "Войти" });
  }

  function handleLogin() {
    Auth.login(email, password)
      .then((data) => {
        if ((data as LoginResData).token) {
          setLoggedIn(true);
          setEmail("");
          setPassword("");
          setHeaderData({
            crossLink: "/",
            linkText: "Выход",
          });
          Auth.getData((data as LoginResData).token)
            .then((res) => setUser(res as UserData))
            .catch((err) => console.log(err));
          Api.getContacts((data as LoginResData).token)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
          history.push("/");
          return;
        } else {
          const { message } = data as LoginResData;
          alert(message);
        }
      })
      .catch((err) => console.log(err));
  }

  function onRegister() {
    Auth.register(email, password).then((res) => {
      const { message } = res as LoginResData;

      if (message === "Регистрация прошла успешно") {
        history.push("/signin");
      } else {
        alert(message);
      }
    });
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
        setPresentationList={setPresentationList}
      />
      <main className="content">
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            presentationList={presentationList}
            logOut={logOut}
            component={Main}
          />
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
      <Footer />
    </>
  );
}

export default App;
