import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { /* HashRouter, uncomment when nedd gh-pages deploy */ Route, Switch, Redirect, useHistory } from "react-router-dom";
import { addValue, resetUser } from "../../redux/userReducer";
import { addContact, resetContacts } from "../../redux/contactsReducer";
import { addFriend, resetFriends } from "../../redux/friendsReducer";
import { addPropose, resetProposes } from "../../redux/proposeReducer";
import { LoginResData, UserData, UserResData } from "../../utils/types";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import * as Auth from "../../utils/Auth";
import * as Api from "../../utils/Api";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import "./App.css";

function App(): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  const [width, setWidth] = React.useState(window.innerWidth);
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [propose, setPropose] = React.useState([] as unknown as [UserData]);
  const [presentationList, setPresentationList] = React.useState<boolean>(true);
  const [headerData, setHeaderData] = React.useState({
    crossLink: "/signin",
    linkText: "Вход",
  });

  React.useEffect(() => {
    function updateSize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  function toogleMobileMenu() {
    const state = !isMobileMenuOpen;
    setMobileMenuOpen(state);
  }

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

  const setFriends = React.useCallback(
    (data: [UserData]) => {
      data.forEach((friend) => {
        const { email, name, avatar, phones } = friend;
        dispatch(
          addFriend(
            email as string,
            name as string | undefined,
            avatar as string | undefined,
            phones as [string] | undefined
          )
        );
      });
    },
    [dispatch]
  );

  const setProposes = React.useCallback(
    (data: [UserData]) => {
      data.forEach((friend) => {
        const { email, name, avatar, phones } = friend;
        dispatch(
          addPropose(
            email as string,
            name as string | undefined,
            avatar as string | undefined,
            phones as [string] | undefined
          )
        );
      });
      setPropose(data);
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
          .then((res) => {
            setUser(res as UserData);

            if ((res as UserData).friends.length > 0) {
              setFriends((res as UserData).friends as [UserResData]);
            }
            Api.getUsers().then((users) => {
              const id = (res as UserData).email;
              const array = (users as [UserData]).filter(
                (user) => user.email !== id
              );
              setProposes(array as [UserData]);
            });
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
  }, [history, setUser, setFriends, setContacts, setProposes]);

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
            .then((res) => {
              setUser(res as UserData);

              if ((res as UserData).friends.length > 0) {
                setFriends((res as UserData).friends as [UserResData]);
              }
              Api.getUsers().then((users) => {
                const id = (res as UserData).email;
                const array = (users as [UserData]).filter(
                  (user) => user.email !== id
                );
                setProposes(array as [UserData]);
              });
            })
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
    history.push("/");
    dispatch(resetContacts(true));
    dispatch(resetFriends(true));
    dispatch(resetUser(true));
    dispatch(resetProposes(true));
  }

  return (
    <>
      <Header
        crossLink={headerData.crossLink}
        linkText={headerData.linkText}
        loggedIn={loggedIn}
        width={width}
        logOut={logOut}
        setEnterLink={setEnterLink}
        setRegLink={setRegLink}
        setPresentationList={setPresentationList}
        toogleMobileMenu={toogleMobileMenu}
      />
      <main className="content">
        {/* <HashRouter> uncomment when nedd gh-pages deploy */}
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            isMobileMenuOpen={isMobileMenuOpen}
            loggedIn={loggedIn}
            presentationList={presentationList}
            propose={propose}
            width={width}
            component={Main}
            logOut={logOut}
          />
          <Route path="/signup">
            <Register
              email={email}
              password={password}
              changeLink={setEnterLink}
              onRegister={onRegister}
              setEmail={setEmail}
              setPassword={setPassword}
            />
          </Route>
          <Route path="/signin">
            <Login
              email={email}
              password={password}
              changeLink={setRegLink}
              onLogin={handleLogin}
              setEmail={setEmail}
              setLoggedIn={setLoggedIn}
              setPassword={setPassword}
            />
          </Route>
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signup" />}
          </Route>
        </Switch>
        {/* </HashRouter> uncomment when nedd gh-pages deploy */}
      </main>
      <Footer />
    </>
  );
}

export default App;
