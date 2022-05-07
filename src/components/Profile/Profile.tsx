import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addValue, editValue } from "../../redux/userReducer";
// import { ProfileProps } from "../../utils/types";
import pencil from "../../assets/pencil.svg";
import "./Profile.css";

function Profile(/* props: ProfileProps */): React.ReactElement {
  const userState = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const [editedText, setEditedText] = React.useState<string>("");
  const [editData, setEditData] = React.useState({
    editable: false,
    value: userState.name,
  });

  function showInput(value: string, index?: number, edited?: boolean) {
    const data = userState[value] || value;
    let state;

    if (value !== "phones") {
      state = {
        editable: true,
        value: data,
      };
      setEditedText(data as string);
    } else {
      let value;

      if (data && edited) {
        value = (data as [string])[index || 0];
        setEditedText((data as [string])[index || 0]);
      } else {
        value = "phones";
        setEditedText("");
      }
      state = {
        editable: true,
        value,
      };
    }

    if (state) {
      setEditData(state);
    }
  }

  function addData(value: string) {
    dispatch(
      addValue({ current: value, description: editedText, isArray: true })
    );
    const state = {
      editable: false,
      value: editData.value,
    };
    setEditedText("");
    setEditData(state);
  }

  function editCurrentData(current: string, index?: number) {
    dispatch(editValue({ current, description: editedText, index }));
    const state = {
      editable: false,
      value: editData.value,
    };
    setEditedText("");
    setEditData(state);
  }

  return (
    <section className="Profile">
      <div className="Profile__section">
        {editData.editable && editData.value === (userState.name || "name") ? (
          <>
            <input
              className="Profile__input"
              type="text"
              value={editedText || (editData.value as string)}
              onChange={(e) => {
                setEditedText(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  editCurrentData("name");
                }
              }}
              autoFocus={true}
            />
            <button
              className="Profile__editButton"
              onClick={() => editCurrentData("name")}
            >
              Ок
            </button>
          </>
        ) : userState.name ? (
          <>
            <h2 className="Profile__name">
              {userState.name}
              <span className="Profile__name_description">&nbsp;(Это вы)</span>
            </h2>
            <img
              className="Profile__editButton"
              alt="edit"
              src={pencil}
              title="Редактировать"
              onClick={() => showInput("name")}
            />
          </>
        ) : (
          <button
            className="Profile__addButton"
            onClick={() => showInput("name")}
          >
            Добавьте ваше имя
          </button>
        )}
      </div>
      <div className="Profile__section">
        {editData.editable &&
        editData.value === (userState.avatar || "avatar") ? (
          <>
            <input
              className="Profile__input"
              type="url"
              value={editedText || (editData.value as string)}
              onChange={(e) => {
                setEditedText(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  editCurrentData("avatar");
                }
              }}
              autoFocus={true}
            />
            <button
              className="Profile__editButton"
              onClick={() => editCurrentData("avatar")}
            >
              Ок
            </button>
          </>
        ) : userState.avatar ? (
          <>
            <img
              className="Profile__avatar"
              alt="avatar"
              src={userState.avatar as string}
            />
            <img
              className="Profile__editButton Profile__editButton_avatar"
              alt="edit"
              src={pencil}
              title="Редактировать"
              onClick={() => showInput("avatar")}
            />
          </>
        ) : (
          <button
            className="Profile__addButton"
            onClick={() => showInput("avatar")}
          >
            Добавить аватар
          </button>
        )}
      </div>
      <div className="Profile__section">
        {editData.editable &&
        editData.value === (userState.email || "email") ? (
          <>
            <input
              className="Profile__input"
              type="email"
              value={editedText || (editData.value as string)}
              onChange={(e) => {
                setEditedText(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  editCurrentData("email");
                }
              }}
              autoFocus={true}
            />
            <button
              className="Profile__editButton"
              onClick={() => editCurrentData("email")}
            >
              Ок
            </button>
          </>
        ) : (
          <>
            <h3 className="Profile__email">{userState.email}</h3>
            <img
              className="Profile__editButton"
              alt="edit"
              src={pencil}
              title="Редактировать"
              onClick={() => showInput("email")}
            />
          </>
        )}
      </div>
      <div className="Profile__section Profile__section_phones">
        {userState.phones ? (
          <>
            <h3 className="Profile__phone">Телефонные номера:</h3>
            {(userState.phones as [string]).map((phone, index) =>
              editData.editable &&
              editData.value ===
                ((userState.phones as [string])[index] || "phones") ? (
                <div className="Profile__phone" key={`input-phone-${index}`}>
                  <input
                    className="Profile__input"
                    type="number"
                    value={editedText || (editData.value as string)}
                    onChange={(e) => {
                      setEditedText(e.target.value);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        editCurrentData("phones", index + 1);
                      }
                    }}
                    autoFocus={true}
                  />
                  <button
                    className="Profile__editButton"
                    onClick={() => editCurrentData("phones", index + 1)}
                  >
                    Ок
                  </button>
                </div>
              ) : (
                <div key={`phone-${index}`} className="Profile__phone">
                  <h3 className="Profile__phone">{phone}</h3>
                  <img
                    className="Profile__editButton"
                    alt="edit"
                    src={pencil}
                    title="Редактировать"
                    onClick={() => showInput("phones", index, true)}
                  />
                </div>
              )
            )}
          </>
        ) : (
          ""
        )}
        {editData.editable &&
        editData.value === ("phones" || userState.phones) ? (
          <div className="Profile__phone">
            <input
              className="Profile__input"
              type="number"
              value={
                editData.value === "phones"
                  ? editedText
                  : editedText || (editData.value as string)
              }
              onChange={(e) => {
                setEditedText(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addData("phones");
                }
              }}
              autoFocus={true}
            />
            <button
              className="Profile__editButton"
              onClick={() => addData("phones")}
            >
              Ок
            </button>
          </div>
        ) : (
          <button
            onClick={() => showInput("phones")}
            className="Profile__addButton"
          >
            Добавить номер
          </button>
        )}
      </div>
    </section>
  );
}

export default Profile;
