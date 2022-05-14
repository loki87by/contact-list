import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { AppDispatch, RootState } from "../../redux/store";
import { addContact, removeContact } from "../../redux/contactsReducer";
import { addFriend, removeFriend } from "../../redux/friendsReducer";
import { addPropose, removePropose } from "../../redux/proposeReducer";
import {
  getContacts,
  setContact,
  deleteContact,
  addNewFriend,
  deleteFriend,
} from "../../utils/Api";
import {
  LoginResData,
  UserResData,
  ContactsProps,
  UserData,
} from "../../utils/types";
import {
  FULL_USER_DATA,
  FULL_USER_DATA_INPUT_TYPES,
  FULL_USER_DATA_INPUT_LABELS,
  randomNumber,
  getRandomColor,
  debounce,
} from "../../utils/consts";
import Card from "../Card/Card";
import Propose from "../Propose/Propose";
import search from "../../assets/search.svg";
import "./Contacts.css";

function Contacts(props: ContactsProps): React.ReactElement {
  const store = useSelector((state: RootState) => state);
  const contactsState = store.contacts;
  const friendsState = store.friends;
  const inputRef = React.useRef(null);
  const dispatch = useDispatch<AppDispatch>();
  const [isPopupOpened, setPopupOpened] = React.useState(false);
  const [isSearchInputOpened, setSearchInputOpened] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState("");
  const [contextMenuOpened, setContextMenuOpened] = React.useState(false);
  const [contextMenuFriend, setContextMenuFriend] = React.useState(false);
  const [propose, setPropose] = React.useState([] as unknown as [UserData]);
  const [contextMenuData, setContextMenuData] = React.useState<LoginResData>({
    top: "",
    left: "",
    element: "",
  });
  const [newContactData, setNewContactData] = React.useState<LoginResData>({
    name: "",
    email: "",
    avatar: "",
    quote: "",
    phone1: "",
    phone2: "",
    phone3: "",
    phone4: "",
    phone5: "",
  });

  function setCurrentContactData(value: string, current: string) {
    const data = newContactData;
    data[current] = value;
    setNewContactData(data);
  }

  function togglePopup() {
    const newState = !isPopupOpened;
    setPopupOpened(newState);
  }

  function addNewContact() {
    const randomNumber = uuidv4().replace(/\D/gi, "");
    const obj = {
      index: randomNumber,
    } as unknown as UserResData;
    const keys = Object.keys(newContactData);
    const values = Object.values(newContactData);
    const phones = [] as unknown as [string];
    keys.forEach((key, index) => {
      if (values[index] !== "") {
        const noPhone = key.replace(/\d/, "");

        if (key === noPhone) {
          obj[key] = values[index] as string;
        } else {
          phones.push(values[index]);
        }
      }
      setPopupOpened(false);
    });
    const { name, email, avatar, quote, index } = obj;
    dispatch(
      addContact(
        name as string | undefined,
        email as string | undefined,
        avatar as string | undefined,
        phones as [string] | undefined,
        quote as string | undefined,
        index as string
      )
    );
    updApiData();
    setNewContactData({
      name: "",
      email: "",
      avatar: "",
      quote: "",
      phone1: "",
      phone2: "",
      phone3: "",
      phone4: "",
      phone5: "",
    });
  }

  const updApiData = () => {
    const token = localStorage.getItem("jwt");

    if (token) {
      getContacts(token).then((res) => {
        if ((res as [UserResData]).length < contactsState.length) {
          const contactData = contactsState[contactsState.length - 1];
          const id = contactData.id;
          const decimalId = (id as string).replace(/\D/gi, "");
          const contact = {
            id: decimalId,
          } as UserResData;
          Object.keys(contactData).forEach((key, index) => {
            if (key !== "id") {
              contact[key] = Object.values(contactData)[index];
            }
          });
          setContact(token, contact);
        }
      });
    }
  };

  function searchInputSwitcher() {
    const newState = !isSearchInputOpened;
    setSearchInputOpened(newState);
    if (newState && inputRef.current !== null) {
      (inputRef.current as HTMLInputElement).focus();
    }
  }

  function removeFromList() {
    const token = localStorage.getItem("jwt");

    if (!contextMenuFriend) {
      const id = contextMenuData.element.replace(/\D/gi, "");
      dispatch(removeContact(id));
      deleteContact(token as string, id);
    } else {
      const id = contextMenuData.element;
      deleteFriend(token as string, id);
      const friendData = friendsState.find((friend) => friend.email === id);
      const { email, name, avatar, phones } = friendData as UserData;
      dispatch(removeFriend(id));
      dispatch(
        addPropose(
          email as string,
          name as string | undefined,
          avatar as string | undefined,
          phones as [string] | undefined
        )
      );
    }
  }

  function addToFriends(user: UserData) {
    const { name, email, avatar, phones } = user;
    dispatch(
      addFriend(
        email as string,
        name as string | undefined,
        avatar as string | undefined,
        phones as [string] | undefined
      )
    );
    dispatch(removePropose(email as string));
    const token = localStorage.getItem("jwt");
    addNewFriend(token as string, email as string);
  }

  React.useEffect(() => {
    let temporary = props.propose;
    friendsState.forEach((friend) => {
      const filtered = temporary.filter((user) => friend.email !== user.email);
      temporary = filtered as [UserData];
    });
    for (let i = temporary.length; i > 2; i--) {
      const random = randomNumber(0, temporary.length);
      temporary = temporary.filter(
        (user) => user.email !== temporary[random].email
      ) as [UserData];
    }
    setPropose(temporary);
  }, [friendsState, props.propose]);

  function findContact(text: string) {
    const liArray = document.querySelectorAll("li");
    liArray.forEach((li, index) => {
      let result = false;
      if (index < contactsState.length) {
        result = satisfiesRequest(text, contactsState[index]);
      } else {
        result = satisfiesRequest(
          text,
          friendsState[index - contactsState.length]
        );
      }
      if (!result) {
        li.classList.add("hidden");
      } else {
        li.classList.remove("hidden");
      }
    });
  }

  function searchInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchInput(value);
    debounce(findContact, 500, value);
  }

  function satisfiesRequest(text: string, data: UserResData | UserData) {
    let result = false;

    if (data.name) {
      if ((data.name as string).toLowerCase().includes(text.toLowerCase())) {
        result = true;
      }
    }

    if (data.email) {
      if ((data.email as string).toLowerCase().includes(text.toLowerCase())) {
        result = true;
      }
    }

    if (data.phones && data.phones.length > 0) {
      (data.phones as [string]).forEach((phone) => {
        if (phone.toLowerCase().includes(text.toLowerCase())) {
          result = true;
        }
      });
    }

    return result;
  }

  return (
    <section className="Contacts">
      <div className="Contacts__title">
        <h2 className="Contacts__title-text">Ваш список контактов:</h2>
        <div
          className={`Contacts__search ${
            isSearchInputOpened && "Contacts__search_opened"
          }`}
        >
          <input
            ref={inputRef}
            onChange={searchInputHandler}
            value={searchInput}
            className="Contacts__search-input"
            placeholder={
              isSearchInputOpened
                ? "Введите имя, email, текст заметки или телефон"
                : ""
            }
          />
          {props.width > 768 ? (
            <img
              onClick={searchInputSwitcher}
              className="Contacts__search-button"
              src={search}
              alt="search"
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <ul
        className={
          props.presentationList ? "Contacts__list" : "Contacts__cells"
        }
        style={
          propose && propose.length < 1 ? { height: `calc(100% - 6em)` } : {}
        }
      >
        {contactsState.map((contact, index) => (
          <li
            key={`contact-${index}`}
            className={`Contacts__list-item ${
              props.presentationList && "Contacts__list-item_list"
            }`}
            style={
              props.presentationList
                ? { border: `2px solid ${getRandomColor(index)}` }
                : {}
            }
          >
            <div
              className={
                props.presentationList
                  ? "Contacts__list-container"
                  : "Contacts__cells-container"
              }
            >
              <Card
                data={contact}
                presentationList={props.presentationList}
                width={props.width}
                setContextMenuData={setContextMenuData}
                setContextMenuFriend={setContextMenuFriend}
                setContextMenuOpened={setContextMenuOpened}
              />
            </div>
          </li>
        ))}
        {friendsState.map((friend, index) => (
          <li
            key={`contact-${index}`}
            style={
              props.presentationList
                ? { border: `2px solid ${getRandomColor(index)}` }
                : {}
            }
            className={`Contacts__list-item ${
              props.presentationList && "Contacts__list-item_list"
            }`}
          >
            <div
              className={
                props.presentationList
                  ? "Contacts__list-container"
                  : "Contacts__cells-container"
              }
            >
              <Card
                data={friend}
                presentationList={props.presentationList}
                width={props.width}
                setContextMenuData={setContextMenuData}
                setContextMenuFriend={setContextMenuFriend}
                setContextMenuOpened={setContextMenuOpened}
              />
            </div>
          </li>
        ))}
        <button onClick={togglePopup} className="Contacts__add-button">
          +
        </button>
        <section
          className={`Contacts__add-popup ${
            isPopupOpened && "Contacts__add-popup_opened"
          }`}
        >
          <button onClick={togglePopup} className="Contacts__close-popup">
            +
          </button>
          <form className="Contacts__add-form">
            {FULL_USER_DATA.map((field, index) => (
              <fieldset
                key={`field-${field}-${index}`}
                className={`Contacts__form-fieldset ${
                  field === "avatar" && "Contacts__form-fieldset_avatar"
                }`}
              >
                <input
                  onChange={(e) => setCurrentContactData(e.target.value, field)}
                  className="Contacts__form-input"
                  type={FULL_USER_DATA_INPUT_TYPES[index]}
                  placeholder={`Введите ${FULL_USER_DATA_INPUT_LABELS[
                    index
                  ].toLowerCase()}`}
                  name={`${field}-input`}
                  id={`${field}-input`}
                />
                <label
                  className="Contacts__form-label"
                  htmlFor={`${field}-input`}
                >
                  Введите {FULL_USER_DATA_INPUT_LABELS[index].toLowerCase()}
                </label>
              </fieldset>
            ))}
            <button
              type="button"
              onClick={addNewContact}
              className="Contacts__form-submit"
            >
              Добавить
            </button>
          </form>
        </section>
      </ul>
      <div
        style={{ left: contextMenuData.left, top: contextMenuData.top }}
        onClick={removeFromList}
        className={`Contacts__contextMenu ${
          contextMenuOpened && "Contacts__contextMenu_opened"
        }`}
      >
        <h4>{contextMenuFriend ? "Удалить из друзей" : "Удалить контакт"}</h4>
      </div>
      {propose && propose.length > 0 ? (
        <section className="Contacts__propose">
          <h3 className="Contacts__propose-title">Возможно вы знакомы:</h3>
          <div className="Contacts__propose-container">
            {propose.map((user, index) => (
              <div key={`propose-${index}`} className="Contacts__propose-item">
                <Propose user={user} addToFriends={addToFriends} />
              </div>
            ))}
          </div>
        </section>
      ) : (
        ""
      )}
    </section>
  );
}

export default Contacts;
