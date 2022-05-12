import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { AppDispatch, RootState } from "../../redux/store";
import { addContact, removeContact } from "../../redux/contactsReducer";
import { getContacts, setContact, deleteContact, getUsers } from "../../utils/Api";
import { LoginResData, UserResData, ContactsProps, UserData } from "../../utils/types";
import Card from "../Card/Card";
import Propose from "../Propose/Propose";
import {
  FULL_USER_DATA,
  FULL_USER_DATA_INPUT_TYPES,
  FULL_USER_DATA_INPUT_LABELS,
  randomNumber,
  getRandomColor
} from "../../utils/consts";
import "./Contacts.css";

function Contacts(props: ContactsProps): React.ReactElement {
  const store = useSelector((state: RootState) => state);
  const contactsState = store.contacts;
  const friendsState = store.friends;
  const userState = store.user;
  const dispatch = useDispatch<AppDispatch>();
  const [isPopupOpened, setPopupOpened] = React.useState(false);
  const [contextMenuOpened, setContextMenuOpened] = React.useState(false);
  const [contextMenuFriend, setContextMenuFriend] = React.useState(false);
  const [deletedContactsIds, setDeletedContactsIds] = React.useState([] as unknown as [string]);
  const [propose, setPropose] = React.useState([] as unknown as [UserData]);
  const [contextMenuData, setContextMenuData] = React.useState<LoginResData>({
    top: '',
    left: '',
    element: ''
  })
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
        if ((res as [UserResData]).length > contactsState.length) {
          let currentArray = (res as [UserResData]).slice()
          contactsState.forEach((contact) => {
            const step = currentArray.filter((item) => item.id !== (contact.id as string).replace(/\D/gi, ''))
            currentArray = step
          })
          if (deletedContactsIds.some((id) => id === currentArray[0].id))
          {deleteContact(token, (currentArray[0].id as string))}
        }
      });
    }
  }

  function removeFromList() {
    let id;
    if(!contextMenuFriend) {
      id = contextMenuData.element.replace(/\D/gi, '')
      dispatch(removeContact(id))
      const idsArray = deletedContactsIds
      idsArray.push(id)
      setDeletedContactsIds(idsArray)
    } else {
      id = contextMenuData.element
    }
  }

  const proposeArray = () => {
    getUsers()
    .then((res) => {
      const id = userState.email
      let array = (res as [UserData]).filter((user) => user.email !== id)
      friendsState.forEach((friend) => {
        const temporary = array.filter((user) => user.email !== friend.email)
        array = temporary
      })
      for (let i = array.length; i > 2; i--) {
        const random = randomNumber(0, array.length)
        const temporary = array.filter((user) => user.email !== array[random].email)
        array = temporary
      }
      setPropose(array as [UserData])
    })
  }

  React.useEffect(updApiData, [dispatch, contactsState, deletedContactsIds]);

  React.useEffect(proposeArray, [friendsState, userState]);

  return (
    <section className="Contacts">
      <h2 className="Contacts__title">Ваш список контактов:</h2>
      <ul
        className={
          props.presentationList ? "Contacts__list" : "Contacts__cells"
        }
        style={propose.length < 1 ? {height: `calc(100% - 6em)`} : {}}
      >
        {contactsState.map((contact, index) => (
          <li
            key={`contact-${index}`}
            className={`Contacts__list-item ${
              props.presentationList && "Contacts__list-item_list"
            }`}
            style={
              props.presentationList ? { border: `2px solid ${getRandomColor(index)}` } : {}
            }
          >
            <div
              className={
                props.presentationList
                  ? "Contacts__list-container"
                  : "Contacts__cells-container"
              }
            >
              <Card data={contact} presentationList={props.presentationList} setContextMenuData={setContextMenuData} setContextMenuFriend={setContextMenuFriend} setContextMenuOpened={setContextMenuOpened}/>
            </div>
          </li>
        ))}
        {friendsState.map((friend, index) => (
          <li key={`contact-${index}`} className="Contacts__list-item">
            <div
              className={
                props.presentationList
                  ? "Contacts__list-container"
                  : "Contacts__cells-container"
              }
            >
              <Card data={friend} presentationList={props.presentationList} setContextMenuData={setContextMenuData} setContextMenuFriend={setContextMenuFriend} setContextMenuOpened={setContextMenuOpened} />
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
      <div style={{left: contextMenuData.left, top: contextMenuData.top}} onClick={removeFromList} className={`Contacts__contextMenu ${contextMenuOpened && "Contacts__contextMenu_opened"}`}>
        <h4>{contextMenuFriend ? 'Удалить из друзей' : 'Удалить контакт'}</h4>
      </div>
      {propose.length > 0 ?
      <section className="Contacts__propose">
        <h3 className="Contacts__propose-title">Возможно вы знакомы:</h3>
        <div className="Contacts__propose-container">
        {propose.map((user, index) => (
          <div key = {`propose-${index}`} className="Contacts__propose-item">
            <Propose user={user}/>
          </div>
        ))}
        </div>
      </section>
      : ''}
    </section>
  );
}

export default Contacts;
