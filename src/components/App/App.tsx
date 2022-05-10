import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { addValue } from "../../redux/userReducer";
import { addContact } from "../../redux/contactsReducer";
// import { addFriend } from "../../redux/friendsReducer";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import * as Auth from "../../utils/Auth";
import * as Api from "../../utils/Api";
import { LoginResData, UserData, UserResData } from "../../utils/types";
import "./App.css";

function App(): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  const store = useSelector((state: RootState) => state);
  const contactState = store.contacts;
  const [currentUserFriends, setCurrentUserFriends] = React.useState(
    [] as unknown as [UserData]
  );

  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [presentationList, setPresentationList] =
    React.useState<boolean>(false);
  const [headerData, setHeaderData] = React.useState({
    crossLink: "/signin",
    linkText: "Вход",
  });

  console.log(currentUserFriends, contactState);

  const setUser = React.useCallback(
    (data: UserData) => {
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
        } else {
          setCurrentUserFriends(values[index] as unknown as [UserData]);
        }
      });
    },
    [dispatch]
  );

  const setContacts = React.useCallback(
    (data: [UserResData]) => {
      data.forEach((contact) => {
        const { name, email, avatar, phones, quote, id } = contact;
        const index = id.toString();
        dispatch(
          addContact(
            name as string,
            email as string,
            avatar as string,
            phones as [string],
            quote as string,
            index as string
          )
        );
      });
    },
    [dispatch]
  );

  /*   const setFriends = React.useCallback(
    (data: [UserData]) => {
      data.forEach((friend) => {
        const {name, email, avatar, phones, quote} = friend
          dispatch(addFriend(name as UserResData, email as UserResData, avatar as UserResData, phones as UserResData, quote as UserResData));
      });
    },
    [dispatch]
  ); */

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
          .then((res) => {
            setUser(res as UserData);
            console.log(res);
            // setFriends
          })
          .catch((err) => console.log(err));
        Api.getContacts(token)
          .then((res) => {
            setContacts(res as [UserResData]);
          })
          .catch((err) => console.log(err));
      }
      history.push("/");
    }
  }, [history, setContacts, setUser]);

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
            .then((res) => setContacts(res as [UserResData]))
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
