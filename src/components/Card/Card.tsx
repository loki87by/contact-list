import React from "react";
import { CardProps } from "../../utils/types";
import pencil from "../../assets/pencil.svg";
import {
  ADVANCED_USER_DATA,
  ADVANCED_USER_DATA_TRANSLATES,
} from "../../utils/consts";
import "./Card.css";
/* {props.data.avatar && props.data.avatar !== "" ? "" : ""} */

function Card(props: CardProps): React.ReactElement {
  /* const keys = Object.keys(props.data)
  const values = Object.values(props.data) */

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
              <img
                className="Card__editButton Card__editButton_avatar"
                alt="edit"
                src={pencil}
                title="Редактировать"
                /* onClick={() => showInput("avatar")} */
              />
            ) : (
              ""
            )}
          </>
        ) : props.data.id ? (
          <img
            className="Card__avatar-image"
            alt="edit"
            src={pencil}
            title="Редактировать"
            /* onClick={() => showInput("avatar")} */
          />
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
              className={`Card__${[item]}-container ${
                props.presentationList && `Card__${[item]}-container_list`
              }`}
            >
              <h2 className={`Card__${[item]}`}>{props.data[item]}</h2>
              {props.data.id ? (
                <img
                  className="Card__editButton"
                  alt="edit"
                  src={pencil}
                  title="Редактировать"
                  /* onClick={() => showInput(item)} */
                />
              ) : (
                ""
              )}
            </div>
          ) : props.data.id ? (
            <div key={`item-edit-${index}`}>
              <img
                className="Card__editButton"
                alt="edit"
                src={pencil}
                title="Редактировать"
                /* onClick={() => showInput(item)} */
              />
            </div>
          ) : (
            <h2 key={`item-empty-${index}`} className={`Card__${[item]}`}>
              {ADVANCED_USER_DATA_TRANSLATES[index]}
            </h2>
          )
        )}
        {props.data.phones && props.data.phones.length !== 0 ? (
          <div
            className={`Card__phones-container ${
              props.presentationList && `Card__phones-container_list`
            }`}
          >
            {(props.data.phones as [string]).map((phone, index) => (
              <div
                key={`item-phone-${index}`}
                className={`Card__${[phone]}-container ${
                  props.presentationList && `Card__${[phone]}-container_list`
                }`}
              >
                <h2 className={`Card__${[phone]}`}>{phone}</h2>
                {props.data.id ? (
                  <img
                    className="Card__editButton"
                    alt="edit"
                    src={pencil}
                    title="Редактировать"
                    /* onClick={() => showInput(item)} */
                  />
                ) : (
                  ""
                )}
              </div>
            ))}
            {props.data.id ? (
              <button
                /* onClick={() => showInput("phones")} */
                className="Card__addButton"
              >
                Добавить номер
              </button>
            ) : (
              ""
            )}
          </div>
        ) : props.data.id ? (
          <button
            /* onClick={() => showInput("phones")} */
            className="Card__addButton"
          >
            Добавить номер
          </button>
        ) : (
          ""
        )}
      </div>
    </section>
  );
}

export default Card;
