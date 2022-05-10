import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { AppDispatch, RootState } from "../../redux/store";
import { addContact } from "../../redux/contactsReducer";
import { getContacts, setContact } from "../../utils/Api";
import { LoginResData, UserResData, ContactsProps } from "../../utils/types";
import {
  FULL_USER_DATA,
  FULL_USER_DATA_INPUT_TYPES,
  FULL_USER_DATA_INPUT_LABELS,
} from "../../utils/consts";
import Card from "../Card/Card";
import "./Contacts.css";

function Contacts(props: ContactsProps): React.ReactElement {
  const store = useSelector((state: RootState) => state);
  const contactsState = store.contacts;
  const friendssState = store.friends;
  const dispatch = useDispatch<AppDispatch>();
  const [isPopupOpened, setPopupOpened] = React.useState(false);
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

  function updApiData() {
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
  }

  React.useEffect(updApiData, [dispatch, contactsState]);

  return (
    <section className="Contacts">
      <h2 className="Contacts__title">Ваш список контактов:</h2>
      <ul
        className={
          props.presentationList ? "Contacts__list" : "Contacts__cells"
        }
      >
        {contactsState.map((contact, index) => (
          <li
            key={`contact-${index}`}
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
              <Card data={contact} presentationList={props.presentationList} />
            </div>
          </li>
        ))}
        {friendssState.map((friend, index) => (
          <li key={`contact-${index}`} className="Contacts__list-item">
            <div
              className={
                props.presentationList
                  ? "Contacts__list-container"
                  : "Contacts__cells-container"
              }
            >
              <Card data={friend} presentationList={props.presentationList} />
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
    </section>
  );
}

export default Contacts;
