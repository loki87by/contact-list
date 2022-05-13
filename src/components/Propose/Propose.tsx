import React from "react";
import { ProposeProps } from "../../utils/types";
import "./Propose.css";

function Propose(props: ProposeProps): React.ReactElement {
  const [isOpen, setOpened] = React.useState(false);

  function addToFriends() {
    props.addToFriends(props.user);
    setOpened(false);
  }

  return (
    <section className={`Propose ${isOpen && "Propose_open"}`}>
      <div
        className={`Propose__preview ${isOpen && "Propose__preview_open"}`}
        onClick={() => {
          setOpened(true);
        }}
      >
        <img
          className={`Propose__avatar ${isOpen && "Propose__avatar_open"}`}
          src={props.user.avatar as string}
          alt="avatar"
        />
        <h3 className="Propose__name">{props.user.name as string}</h3>
      </div>
      {isOpen ? (
        <div className="Propose__description">
          <h3
            className="Propose__close-button"
            onClick={() => {
              setOpened(false);
            }}
          >
            Закрыть [X]
          </h3>
          {props.user.email ? (
            <h3 className="Propose__name">{props.user.email as string}</h3>
          ) : (
            ""
          )}
          {props.user.phones ? (
            <div className="Propose__phones">
              <h3 className="Propose__name">Телефон:</h3>
              {(props.user.phones as [string]).map((phone, index) => (
                <h3 key={`phone-${index}`} className="Propose__name">
                  {phone}
                </h3>
              ))}
            </div>
          ) : (
            ""
          )}
          <button onClick={addToFriends} className="Propose__add-button">
            Добавить в друзья
          </button>
        </div>
      ) : (
        ""
      )}
    </section>
  );
}

export default Propose;
