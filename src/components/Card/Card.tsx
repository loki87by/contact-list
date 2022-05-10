import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { updateContacts } from "../../redux/contactsReducer";
import { CardProps, UserResData } from "../../utils/types";
import { getContacts, updateContact } from "../../utils/Api";
import pencil from "../../assets/pencil.svg";
import {
  ADVANCED_USER_DATA,
  ADVANCED_USER_DATA_TRANSLATES,
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
    if (props.data.id && (editedText !== '')) {
      const data = {
        id: props.data.id as string,
        value: openInputSelector,
        description: editedText,
      };
      if (openInputSelector === "phones") {
        const arr = [...(props.data.phones as [string])];
        if (props.data.phones.length > 0) {
          arr[currentPhoneIndex as number] = editedText;
        } else {
          arr.push(editedText);
        }
        (data.description as unknown as [string]) = arr as [string];
      }
      dispatch(updateContacts(data));
    }
    setEditedText("");
    setInputId("");
    setInputSelector("")
    setCurrentPhoneIndex(NaN)
  }

  function showInput(selector: string, phoneIndex?: number) {
    let id = `${selector}-${props.data.id}`;
    if (selector === "phones") {
      id += `-${phoneIndex || 0}`;
      setCurrentPhoneIndex(phoneIndex || (props.data.phones as [string]).length || 0)
    }
    setInputId(id);
    setInputSelector(selector)
  }

  function showListStyleInput(data: string, phoneIndex?: number) {
    showInput('avatar')
    setInputSelector(data)
    let id = NaN
    setEditedText(props.data[data] as string)
    if (data === "phones" || !props.data[data]) {
      setInputSelector("phones")
      id = phoneIndex || (props.data.phones as [string]).length || 0;
      setEditedText(data)
    }
    setCurrentPhoneIndex(id)
  }

  function updApiData() {
    if (props.data.id) {
      const token = localStorage.getItem("jwt");
      const { id, name, email, avatar, phones, quote } = props.data;
      const index = (id as string).replace(/\D/gi, '')
      const contact = {
        id: index,
      } as UserResData
      if(name) {contact.name = name as string}
      if(email) {contact.email = email as string}
      if(avatar) {contact.avatar = avatar as string}
      if(phones) {contact.phones = phones as [string]}
      if(quote) {contact.quote = quote as string}

      if (token) {
        const numberId = (props.data.id as string).replace(/\D/gi, '')
        getContacts(token)
        .then((res) => {
          const current = (res as [UserResData]).filter((item)=> item.id.toString() === numberId)
          if (current.length === 1){
            updateContact(
              token,
              contact
            );
          }
        })
      }
    }
  }

  console.log(props.data.avatar && props.data.avatar !== "", props.data.id)

  React.useEffect(updApiData, [dispatch, props.data]);

  return (
    <section className={`Card ${props.presentationList && "Card_list"}`}>
      <div
        className={`Card__avatar ${
          props.presentationList && "Card__avatar_list"
        }`}
      >
        {props.data.avatar && props.data.avatar !== "" ? (
          <>
            <img
              className="Card__avatar-image"
              alt="avatar"
              src={props.data.avatar as string}
            />
            {props.data.id ? (
              <>
                <img
                  className="Card__editButton Card__editButton_avatar"
                  alt="edit"
                  src={pencil}
                  title="Редактировать"
                  onClick={() => showInput("avatar")}
                />
                {openInputId === `avatar-${props.data.id}` ? (
                  <div className={`Card__input-container Card__input-container_avatar ${props.presentationList && "Card__input-container_list"}`}>
                    <input
                      className="Card__input"
                      type="url"
                      value={editedText || (props.data.avatar as string)}
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
            ) : (
              ""
            )}
          </>
        ) : props.data.id ? (
          openInputId === `avatar-${props.data.id}` ? (
            <div className={`Card__input-container Card__input-container_avatar ${props.presentationList && "Card__input-container_list"}`}>
              <input
                className="Card__input"
                type="url"
                value={editedText || (props.data.avatar as string)}
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
            
          <img
          className="Card__avatar-image"
          alt="edit"
          src={pencil}
          title="Редактировать"
          onClick={() => showInput("avatar")}
        />
          )
        ) : (
          <img
            className="Card__avatar-image"
            alt="no avatar"
            src=""
            title="Аватар не установлен"
          />
        )}
      </div>
      <div
        className={`Card__description ${
          props.presentationList && "Card__description_list"
        }`}
      >
        {ADVANCED_USER_DATA.map((item, index) =>
          props.data[item] && props.data[item] !== "" ? (
            <div
              key={`item-container-${index}`}
              className={`Card__data-container ${
                props.presentationList && `Card__data-container_list`
              } ${item === "quote" && "Card__data-container_quote"} ${(item === "quote" && props.presentationList) && "Card__data-container_list-quote"}`}
            >
              {openInputId === `${item}-${props.data.id}` ? (
                <div className={`Card__input-container ${props.presentationList && "Card__input-container_list"}`}>
                  <input
                    className="Card__input"
                    type="text"
                    value={editedText || (props.data[item] as string)}
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
                style={{ color: `${getRandomColor(index)}` }}
                className="Card__data-text"
              >
                {props.data[item]}
              </h3>
              {props.data.id ? (
                <img
                  className="Card__editButton"
                  alt="edit"
                  src={pencil}
                  title="Редактировать"
                  onClick={() => {props.presentationList ? showListStyleInput(item) : showInput(item)}}
                />
              ) : (
                ""
              )}
            </div>
          ) : props.data.id ? (
            <div
              key={`item-container-${index}`}
              className={`Card__data-container ${
                props.presentationList && `Card__data-container_list`
              } ${item === "quote" && "Card__data-container_quote"} ${(item === "quote" && props.presentationList) && "Card__data-container_list-quote"}`}
            >
            <h3
              /* style={{ color: `${getRandomColor(index)}` }} */
              className="Card__data-text"
            >
              {item}
            </h3>
              <img
                className="Card__editButton"
                alt="edit"
                src={pencil}
                title="Редактировать"
                onClick={() => {props.presentationList ? showListStyleInput(item) : showInput(item)}}
              />
            </div>
          ) : (
            <div
            key={`item-empty-${index}`}
              className={`Card__data-container ${
                props.presentationList && `Card__data-container_list`
              }`}
            >
            <h3 className="Card__data-text">
              {ADVANCED_USER_DATA_TRANSLATES[index]}
            </h3>
            </div>
          )
        )}
        {props.data.phones && props.data.phones.length !== 0 ? (
          <div
            className={`Card__phones-container ${
              props.presentationList && `Card__phones-container_list`
            }`}
          >
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
                {props.data.id ? (
                  <>
                    <img
                      className="Card__editButton"
                      alt="edit"
                      src={pencil}
                      title="Редактировать"
                      onClick={() => {props.presentationList ? showListStyleInput(phone, ind) : showInput("phones", ind)}}
                    />
                    {openInputId === `phones-${props.data.id}-${ind}` ? (
                      <div className={`Card__input-container ${props.presentationList && "Card__input-container_list"}`}>
                        <input
                          className="Card__input"
                          type="text"
                          value={editedText || phone}
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
                ) : (
                  ""
                )}
              </div>
            ))}
            {props.data.id && props.data.phones.length < 5 ? (
              <>
                <button
                  onClick={() => {props.presentationList ? showListStyleInput("", props.data.phones.length as number) : showInput("phones", props.data.phones.length as number)}}
                  className="Card__addButton"
                >
                  Добавить еще
                </button>
                {openInputId ===
                `phones-${props.data.id}-${props.data.phones.length}` ? (
                  <div className={`Card__input-container ${props.presentationList && "Card__input-container_list"}`}>
                    <input
                      className="Card__input"
                      type="text"
                      value={editedText}
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
                      onClick={() =>
                        editCurrentData()
                      }
                    >
                      Ок
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
        ) : props.data.id ? (
          <>
            <button
              onClick={() => {props.presentationList ? showListStyleInput("") : showInput("phones")}}
              className="Card__addButton"
            >
              Добавить номер
            </button>
            {openInputId === `phones-${props.data.id}-0` ? (
              <div className={`Card__input-container ${props.presentationList && "Card__input-container_list"}`}>
                <input
                  className="Card__input"
                  type="text"
                  value={editedText}
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
        ) : (
          ""
        )}
      </div>
    </section>
  );
}

export default Card;
