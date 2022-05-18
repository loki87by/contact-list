import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addValue, editValue, removeValue } from "../../redux/userReducer";
import { updatePersonalData, deleteUser } from "../../utils/Api";
import { UserResData, LoginResData, ProfileProps } from "../../utils/types";
import {
  BASIC_USER_DATA,
  BASIC_USER_INPUT_TYPES,
  BASIC_USER_DATA_TRANSLATES,
} from "../../utils/consts";
import pencil from "../../assets/pencil.svg";
import trash from "../../assets/trash.svg";
import "./Profile.css";

function Profile(props: ProfileProps): React.ReactElement {
  const store = useSelector((state: RootState) => state);
  const dispatch = useDispatch<AppDispatch>();
  const userState = store.user;
  const [editedText, setEditedText] = React.useState<string>("");
  const [isGeneralSettings, setGeneralSettings] = React.useState(false);
  const [oldPass, setOldPass] = React.useState<string>("");
  const [newPass, setNewPass] = React.useState<string>("");
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

  function updApiData() {
    const token = localStorage.getItem("jwt");

    if (token) {
      updatePersonalData(token, userState as UserResData);
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

  function removeData(value: string, index?: number) {
    dispatch(removeValue({ current: value, isArray: true, index }));
  }

  function changePass() {
    const password = [oldPass, newPass];
    const user = { password };
    const token = localStorage.getItem("jwt");

    if (token) {
      updatePersonalData(token, user as unknown as UserResData).then((res) => {
        if (res) {
          const { message } = res as LoginResData;
          alert(message);
        }
      });
    }
  }

  function toggleSettings() {
    const newState = !isGeneralSettings;
    setGeneralSettings(newState);
  }

  function deleteAccount() {
    const token = localStorage.getItem("jwt");

    if (token) {
      deleteUser(token).then((res) => {
        if (res) {
          const { message } = res as LoginResData;
          alert(message);
        }
        setTimeout(props.logOut, 1000);
      });
    }
  }

  React.useEffect(updApiData, [dispatch, userState]);

  return (
    <section className={`Profile ${props.isMobileMenuOpen && "Profile_open"}`}>
      {BASIC_USER_DATA.map((item, index) => (
        <div className="Profile__section" key={`section-${item}`}>
          {editData.editable &&
          editData.value === (userState[item] || [item]) ? (
            <>
              <input
                className="Profile__input"
                type={BASIC_USER_INPUT_TYPES[index]}
                value={editedText || (editData.value as string)}
                onChange={(e) => {
                  setEditedText(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    editCurrentData(item);
                  }
                }}
                autoFocus={true}
              />
              <button
                className="Profile__editButton"
                onClick={() => editCurrentData(item)}
              >
                Ок
              </button>
            </>
          ) : userState[item] ? (
            item === "avatar" ? (
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
              <>
                <h2 className={`Profile__${item}`}>
                  {userState[item]}
                  {item === "name" ? (
                    <span className="Profile__name_description">
                      &nbsp;(Это вы)
                    </span>
                  ) : (
                    ""
                  )}
                </h2>
                <img
                  className="Profile__editButton"
                  alt="edit"
                  src={pencil}
                  title="Редактировать"
                  onClick={() => showInput(item)}
                />
              </>
            )
          ) : (
            <button
              className="Profile__addButton"
              onClick={() => showInput(item)}
            >
              {BASIC_USER_DATA_TRANSLATES[index]}
            </button>
          )}
        </div>
      ))}
      <div className="Profile__section Profile__section_phones">
        {(userState.phones && userState.phones.length > 0 && userState.phones[0] !== '') ? (
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
                  <h4 className="Profile__phone-number">{phone}</h4>
                  <img
                    className="Profile__removeButton"
                    alt="delete"
                    src={trash}
                    title="Удалить"
                    onClick={() => removeData("phones", index)}
                  />
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
        ) : !userState.phones ||
          (userState.phones && userState.phones.length < 5) ? (
          <button onClick={() => showInput("phones")}>Добавить номер</button>
        ) : (
          ""
        )}
      </div>
      <div
        className={`Profile__settings ${
          isGeneralSettings && "Profile__settings_open"
        } `}
      >
        <button onClick={toggleSettings}>
          {isGeneralSettings ? "Скрыть" : "Показать"} настройки
        </button>
        <form>
          <h3 className="Profile__settings-title">Сменить пароль</h3>
          <label htmlFor="old-pass" className="Profile__pass_label">
            Старый пароль
          </label>
          <input
            type="pass"
            id="new-pass"
            onChange={(e) => setNewPass(e.target.value)}
            name="new-pass"
            className="Profile__pass-input"
            value={newPass}
          />
          <label htmlFor="new-pass" className="Profile__pass_label">
            Новый пароль
          </label>
          <input
            type="pass"
            id="old-pass"
            onChange={(e) => setOldPass(e.target.value)}
            name="old-pass"
            className="Profile__pass-input"
            value={oldPass}
          />
          <button type="button" onClick={changePass}>
            Обновить пароль
          </button>
        </form>
        <button type="button" onClick={deleteAccount}>
          Удалить аккаунт
        </button>
      </div>
    </section>
  );
}

export default Profile;
