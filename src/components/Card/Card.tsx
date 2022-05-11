import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { updateContacts } from "../../redux/contactsReducer";
import { CardProps, UserResData, LoginResData } from "../../utils/types";
import { getContacts, updateContact } from "../../utils/Api";
import pencil from "../../assets/pencil.svg";
import noAva from "../../assets/no_ava.gif";
import {
  ADVANCED_USER_DATA,
  ADVANCED_USER_DATA_TRANSLATES,
  ADVANCED_CONTACT_DATA_TRANSLATES,
  getRandomColor,
} from "../../utils/consts";
import "./Card.css";

function Card(props: CardProps): React.ReactElement {
  const [openInputId, setInputId] = React.useState("");
  const [openInputSelector, setInputSelector] = React.useState("");
  const [currentPhoneIndex, setCurrentPhoneIndex] = React.useState(NaN);
  const [editedText, setEditedText] = React.useState("");
  const dispatch = useDispatch<AppDispatch>();

  function editCurrentData() {
    if (props.data.id) {
      const data = {
        id: props.data.id as string,
        value: openInputSelector,
        description: editedText,
      };

      if (openInputSelector === "phones") {
        const arr = [...(props.data.phones as [string])];

        if (props.data.phones.length > 0) {
          arr[(currentPhoneIndex as number) - 1] = editedText;
        } else {
          arr.push(editedText);
        }
        (data.description as unknown as [string]) = arr as [string];
      }
      dispatch(updateContacts(data));
    }
    setEditedText("");
    setInputId("");
    setInputSelector("");
    setCurrentPhoneIndex(NaN);
  }

  function showInput(selector: string, phoneIndex?: number) {
    setInputSelector(selector);

    if (phoneIndex) {
      setInputId(`phones-${props.data.id}-${phoneIndex}`);
      setEditedText("");
      setCurrentPhoneIndex(phoneIndex);

      if ((props.data[selector] as [string])[phoneIndex - 1]) {
        setEditedText((props.data[selector] as [string])[phoneIndex - 1]);
      }
    } else {
      setInputId(`${selector}-${props.data.id}`);
      setEditedText(props.data[selector] as string);
    }
  }

  function updApiData() {

    if (props.data.id) {
      const token = localStorage.getItem("jwt");
      const { id, name, email, avatar, phones, quote } = props.data;
      const index = (id as string).replace(/\D/gi, "");
      const contact = {
        id: index,
      } as UserResData;

      if (name) {
        contact.name = name as string;
      }

      if (email) {
        contact.email = email as string;
      }

      if (avatar) {
        contact.avatar = avatar as string;
      }

      if (phones) {
        contact.phones = phones as [string];
      }

      if (quote) {
        contact.quote = quote as string;
      }

      if (token) {
        const numberId = (props.data.id as string).replace(/\D/gi, "");
        getContacts(token).then((res) => {
          const current = (res as [UserResData]).filter(
            (item) => item.id.toString() === numberId
          );

          if (current.length === 1) {
            updateContact(token, contact);
          }
        });
      }
    }
  }

  React.useEffect(updApiData, [dispatch, props.data]);

  function setContextMenu(data: LoginResData) {
    props.setContextMenuOpened(true)
    if (props.data.id) {
      props.setContextMenuFriend(false)
    } else {
      props.setContextMenuFriend(true)
    }
    props.setContextMenuData(data)
  }

  function openContextMenu(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    const data = {left: `calc(${e.clientX}px - 20% - 2.5em)`, top: `calc(${e.clientY}px - 8vh)`, element: (props.data.id as string)}
    setContextMenu(data)
    document.addEventListener('click', () => {
      props.setContextMenuOpened(false)})
  }

  return (
    <section className={`Card ${props.presentationList && "Card_list"}`}  onContextMenu={(e) => {openContextMenu(e)}} >
      <div
        className={`Card__avatar ${
          props.presentationList && "Card__avatar_list"
        }`}
      >
        {props.data.avatar && props.data.avatar !== "" ? (
          <img
            className="Card__avatar-image"
            alt="avatar"
            src={props.data.avatar as string}
          />
        ) : (
          <img className="Card__avatar-image" alt="no avatar" src={noAva} />
        )}
        <>
          {props.data.id ? (
            <img
              className="Card__editButton Card__editButton_avatar"
              alt="edit"
              src={pencil}
              title="Редактировать"
              onClick={() => {
                showInput("avatar");
              }}
            />
          ) : (
            ""
          )}
          {openInputId === `avatar-${props.data.id}` ? (
            <div
              className={`Card__input-container Card__input-container_avatar ${
                props.presentationList && "Card__input-container_list"
              }`}
            >
              <input
                className="Card__input"
                type="url"
                value={editedText || ""}
                onChange={(e) => {
                  setEditedText(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    editCurrentData();
                  }
                }}
                autoFocus={true}
              />
              <button
                className="Card__input-submit"
                onClick={() => editCurrentData()}
              >
                Ок
              </button>
            </div>
          ) : (
            ""
          )}
        </>
      </div>
      <div
        className={`Card__description ${
          props.presentationList && "Card__description_list"
        }`}
      >
        {ADVANCED_USER_DATA.map((item, index) => (
          <div
            key={`item-container-${index}`}
            className={`Card__data-container ${
              props.presentationList && `Card__data-container_list`
            } ${item === "quote" && "Card__data-container_quote"} ${
              item === "quote" &&
              props.presentationList &&
              "Card__data-container_list-quote"
            }`}
          >
            {openInputId === `${item}-${props.data.id}` ? (
              <div
                className={`Card__input-container ${
                  props.presentationList && "Card__input-container_list"
                }`}
              >
                <input
                  className="Card__input"
                  type="text"
                  value={editedText || ""}
                  onChange={(e) => {
                    setEditedText(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      editCurrentData();
                    }
                  }}
                  autoFocus={true}
                />
                <button
                  className="Card__input-submit"
                  onClick={() => editCurrentData()}
                >
                  Ок
                </button>
              </div>
            ) : (
              ""
            )}
            <h3
              style={
                props.data[item] ? { color: `${getRandomColor(index)}` } : {}
              }
              className="Card__data-text"
            >
              {props.data.id
                ? props.data[item] || ADVANCED_CONTACT_DATA_TRANSLATES[index]
                : ADVANCED_USER_DATA_TRANSLATES[index]}
            </h3>
            {props.data.id ? (
              <img
                className="Card__editButton"
                alt="edit"
                src={pencil}
                title="Редактировать"
                onClick={() => {
                  showInput(item);
                }}
              />
            ) : (
              ""
            )}
          </div>
        ))}
        <div
          className={`Card__phones-container ${
            props.presentationList && `Card__phones-container_list`
          }`}
        >
          {props.data.phones && props.data.phones.length !== 0 ? (
            <>
              <h3 className={`Card__phone`}>Телефон:</h3>
              {(props.data.phones as [string]).map((phone, ind) => (
                <div
                  key={`item-phone-${ind}`}
                  className={`Card__phone-container ${
                    props.presentationList && `Card__phone-container_list`
                  }`}
                >
                  <h4
                    className={`Card__phone`}
                    style={{ color: `${getRandomColor(ind)}` }}
                  >
                    {phone}
                  </h4>
                  <>
                    <img
                      className="Card__editButton"
                      alt="edit"
                      src={pencil}
                      title="Редактировать"
                      onClick={() => {
                        showInput("phones", ind + 1);
                      }}
                    />
                    {openInputId === `phones-${props.data.id}-${ind + 1}` ? (
                      <div
                        className={`Card__input-container ${
                          props.presentationList && "Card__input-container_list"
                        }`}
                      >
                        <input
                          className="Card__input"
                          type="number"
                          value={editedText || ""}
                          onChange={(e) => {
                            setEditedText(e.target.value);
                          }}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              editCurrentData();
                            }
                          }}
                          autoFocus={true}
                        />
                        <button
                          className="Card__input-submit"
                          onClick={() => editCurrentData()}
                        >
                          Ок
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                </div>
              ))}
            </>
          ) : (
            ""
          )}
          {props.data.id && props.data.phones.length < 5 ? (
            openInputId ===
            `phones-${props.data.id}-${
              (props.data.phones as [string]).length + 1
            }` ? (
              <div
                className={`Card__input-container ${
                  props.presentationList &&
                  "Card__input-container_list Card__input-container_list-phone"
                } Card__input-container_phone`}
              >
                <input
                  className="Card__input"
                  type="number"
                  value={editedText || ""}
                  onChange={(e) => {
                    setEditedText(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      editCurrentData();
                    }
                  }}
                  autoFocus={true}
                />
                <button
                  className="Card__input-submit"
                  onClick={() => editCurrentData()}
                >
                  Ок
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  showInput("phones", (props.data.phones.length as number) + 1);
                }}
                className="Card__addButton"
              >
                Добавить номер
              </button>
            )
          ) : (
            ""
          )}
        </div>
      </div>
    </section>
  );
}

export default Card;
