import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { addFriend } from "../../redux/friendsReducer";
import { getData } from '../../utils/Auth';
import { addNewFriend, deleteFriend } from "../../utils/Api";
import { ProposeProps, UserData, UserResData } from "../../utils/types";
import "./Propose.css";

function Propose(props: ProposeProps): React.ReactElement {
  const store = useSelector((state: RootState) => state);
  const friendsState = store.friends;
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setOpened] = React.useState(false)

  function addToFriends() {
    const { name, email, avatar, phones } = props.user
dispatch(addFriend(
  email as string,
        name as string | undefined,
        avatar as string | undefined,
        phones as [string] | undefined
      ));
      setOpened(false)
  }

  function updApiData() {
    const token = localStorage.getItem("jwt");

    if (token) {
      getData(token)
      .then((res) => {
        let friendsArray = [] as unknown as [UserResData]
         if(res && (res as UserData).friends) {
          friendsArray = ((res as UserData).friends as unknown as [UserResData])
         }
         if (friendsArray.length < friendsState.length) {
          const friendData = friendsState[friendsState.length - 1];
          const email = friendData.email as string
          if(email !== '' && !friendsArray.find((friend) => friend.email === email)) {
            addNewFriend(token, email)
          }
        }
        if (friendsArray.length > friendsState.length) {
          let filteredArray = friendsArray.slice()
          friendsState.forEach((friend) => {
            const temporaryArray = filteredArray.filter((item) => item.email !== friend.email)
            filteredArray = temporaryArray
          })
          const deletedFriend = (filteredArray[0].email as string)
          deleteFriend(token, deletedFriend)
       }
      })
    }
  }

  React.useEffect(updApiData, [dispatch, friendsState]);

  return (
    <section className={`Propose ${isOpen && "Propose_open"}`}>
      <div className={`Propose__preview ${isOpen && "Propose__preview_open"}`} onClick={() => {setOpened(true)}}>
      <img className={`Propose__avatar ${isOpen && "Propose__avatar_open"}`} src={(props.user.avatar as string)} alt="avatar" />
      <h3 className="Propose__name">{(props.user.name as string)}</h3>
      </div>
      {isOpen ?
      <div className="Propose__description">
        <h3 className="Propose__close-button" onClick={() => {setOpened(false)}} >Закрыть [X]</h3>
        {props.user.email ? <h3 className="Propose__name">{(props.user.email as string)}</h3> : ''}
        {props.user.phones ? <div className="Propose__phones">
        <h3 className="Propose__name">Телефон:</h3>
        {(props.user.phones as [string]).map((phone, index) => (
          <h3 key={`phone-${index}`} className="Propose__name">{phone}</h3>
        ))}
        </div> : ''}
        <button onClick={addToFriends} className="Propose__add-button">Добавить в друзья</button>
      </div> : ''}
    </section>
  );
}

export default Propose;
