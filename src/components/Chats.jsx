import React, { useContext, useEffect, useState } from "react";
import { collection, doc, getDocs, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "../firbase-config";
import { AuthContext } from "./context/AuthContext";
import { ChatContext } from "./context/ChatContextProvider";
import { getAuth } from "firebase/auth";

const Chats = () => {
  const [chatlist, setChatList] = useState([]);
  const [users, setusers] = useState([]);
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

  const listOfAllUsers = async () => {
    const usersNames = collection(db, "users");
    const quaer = query(usersNames);
    const querySnapshot = await getDocs(quaer);
    const updatedUsers = [];
    querySnapshot.forEach((doc) => {
      updatedUsers.push(doc.data());
    });
    setusers(updatedUsers);
  };

  useEffect(() => {
    listOfAllUsers();
  }, [currentUser.uid]);

  const handleSelect = (user) => {
    dispatch({ type: "User_Click", payload: user });
  };

  return (
    <div className="chatCont">
      {chatlist &&
        Object.entries(chatlist)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chatperson) => {
            console.log(chatperson);
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

      {/* {users &&
        users
          .sort((a, b) => a.displayName.localeCompare(b.displayName))
          .map((user) => {
            return (
              <>
                {currentUser.uid !== user.uid ? (
                  <>
                    {chatlist &&
                      Object.entries(chatlist)
                        ?.sort((a, b) => b[1].date - a[1].date)
                        .map((chatperson) => {
                          return (
                            <>
                              {chatperson[1]?.userInfo.uid !== user.uid ? (
                                <div className="searchusers" key={chatperson[0]} onClick={() => handleSelect(chatperson[1].userInfo)}>
                                  <img src={chatperson[1]?.userInfo.photoURL} alt="" />
                                  <div className="userInfo">
                                    <span>{chatperson[1]?.userInfo.displayName}</span>
                                    <p>{chatperson[1]?.lastMessage?.text}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="searchusers" key={user.uid} onClick={() => handleSelect(user)}>
                                  <img src={user.photoURL} alt="img" />
                                  <div className="userInfo">
                                    <span>{user.displayName}</span>
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })}
                  </>
                ) : (
                  <></>
                )}
              </>
            );
          })} */}
    </div>
  );
};

export default Chats;
