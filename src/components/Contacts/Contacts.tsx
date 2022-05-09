import React from "react";
import { /* useDispatch, */ useSelector } from "react-redux";
import { /* AppDispatch, */ RootState } from "../../redux/store";
/* import { addValue, editValue, removeValue } from "../../redux/userReducer";
import { updatePersonalData, deleteUser } from "../../utils/Api"; */
import { /* UserResData, LoginResData, */ ContactsProps } from "../../utils/types";
import Card from '../Card/Card'
import "./Profile.css";

function Contacts(props: ContactsProps): React.ReactElement {
  const store = useSelector((state: RootState) => state);
  // const dispatch = useDispatch<AppDispatch>();
  const contactsState = store.contacts 
  const friendssState = store.friends 
  // React.useEffect(updApiData, [dispatch, userState]);

  return (
    <section className="Contacts">
      <h2 className="Contacts__title">Ваш список контактов:</h2>
      <ul className={props.presentationList ? "Contacts__list" : "Contacts__cells"}>
        {contactsState.map((contact, index) => (
          <li key={`contact-${index}`} className="Contacts__list-item">
            <div className={props.presentationList ? "Contacts__list-container" : "Contacts__cells-container"}>
              <Card data={contact} presentationList={props.presentationList}/>
            </div>
          </li>
        ))}
        {friendssState.map((friend, index) => (
          <li key={`contact-${index}`} className="Contacts__list-item">
            <div className={props.presentationList ? "Contacts__list-container" : "Contacts__cells-container"}>
              <Card data={friend} presentationList={props.presentationList}/>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Contacts;
