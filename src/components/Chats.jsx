import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firbase-config";
import { AuthContext } from "./context/AuthContext";
import { ChatContext } from "./context/ChatContextProvider";

const Chats = () => {

  const [chatlist, setChatList] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        // console.log(doc.data(),"chatList");
        setChatList(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  

    useEffect(()=>{},[]);


  const handleSelect = (user) => {
    dispatch({ type: "User_Click", payload: user });
  };

  return (
    <div>
      {chatlist&&Object.entries(chatlist)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chatperson) => {
          return (
            <div className="searchusers" key={chatperson[0]} onClick={() => handleSelect(chatperson[1].userInfo)}>
              <img src={chatperson[1]?.userInfo.photoURL} alt="" />
              <div className="userInfo">
                <span>{chatperson[1]?.userInfo.displayName}</span>
                <p>{chatperson[1]?.lastMessage?.text}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Chats;
