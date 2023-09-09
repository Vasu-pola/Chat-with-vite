import React, { useContext, useEffect, useState } from "react";
import { collection, doc, getDocs, onSnapshot, query, updateDoc, serverTimestamp, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firbase-config";
import { AuthContext } from "./context/AuthContext";
import { ChatContext } from "./context/ChatContextProvider";
import { getAuth } from "firebase/auth";

const Chats = () => {
  const [chatlist, setChatList] = useState([]);
  const [users, setusers] = useState([]);
  // const [duplicateusers, setDuplicateUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

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



  function filterUsersByChatList(allUsers, chatList) {
    return allUsers.filter((user) =>
      !chatList.some((chatListItem) => chatListItem[1].userInfo.uid === user.uid)
    );
  }
  
  // Call the function to get the duplicateUsers array
  const duplicateUsers = filterUsersByChatList(users, Object.entries(chatlist));
  

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
    currentUser.uid && listOfAllUsers();
  }, [currentUser.uid]);

  const valuesArray = [];
  Object.values(chatlist).forEach((chatListItem) => {
    valuesArray.push({
      userInfo: chatListItem.userInfo,
      lastMessage: chatListItem.lastMessage,
      date: chatListItem.date,
    });
  });



  // const combinedArray = [...valuesArray, ...users];
  // const uniqueUids = new Set();
  // const uniqueCombinedArray = [];

  // combinedArray.forEach((item) => {
  //   if (item.userInfo && item.userInfo.uid) {
  //     // Extract 'uid' from 'userInfo'
  //     const uid = item.userInfo.uid;
  //     if (!uniqueUids.has(uid)) {
  //       uniqueUids.add(uid);
  //       uniqueCombinedArray.push(item);
  //     }
  //   } else if (item.uid) {
  //     // Use 'uid' directly
  //     const uid = item.uid;
  //     if (!uniqueUids.has(uid)) {
  //       uniqueUids.add(uid);
  //       uniqueCombinedArray.push(item);
  //     }
  //   }
  // });

  // const uniqueArray = Array.from(new Map(combinedArray.map((item) => [(item.uid, item)])).values());

  // uniqueArray.sort((a, b) => (a.displayName > b.displayName ? 1 : -1));

  const handleSelect = (user) => {
    dispatch({ type: "User_Click", payload: user });
  };

  const handleItemSelect = async (user) => {
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      dispatch({ type: "User_Click", payload: user });
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div className="chatCont">
      <h6 className="registerUsers">Your chat Persons</h6>
      {Object.entries(chatlist).length>0 ?
        Object.entries(chatlist)
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
          }): <>
            <h6>Your Chat is Empty</h6>
          </>}
          <h6 className="registerUsers">Register Users</h6>
      {duplicateUsers.length > 0 &&
        duplicateUsers?.map((item) => {
          return (
            <>
              {currentUser.uid !== item.uid ? (
                <div className="searchusers" key={item.uid} onClick={() => handleItemSelect(item)}>
                  <img src={item.photoURL} alt="" />
                  <div className="userInfo">
                    <span>{item.displayName}</span>
                    {/* <p>{chatperson[1]?.lastMessage?.text}</p> */}
                  </div>
                </div>
              ) : (
                <> </>
              )}
            </>
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
      {/* {uniqueCombinedArray &&
        uniqueCombinedArray?.map((item) => {
          return (
            <>
              {currentUser.uid !== item.uid ? (
                <>
                  <div className="searchusers" key={item.userInfo.uid ? item.userInfo.uid : item.uid} onClick={() => handleSelect(item)}>
                    <img src={item?.userInfo.photoURL ? item?.userInfo.photoURL : item.photoURL} alt="" />
                    <div className="userInfo">
                      <span>{item?.userInfo.displayName ? item?.userInfo.displayName : item.displayName}</span>
                      <p>{item?.lastMessage?.text}</p>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          );
        })} */}
      {/* {uniqueCombinedArray &&
        uniqueCombinedArray?.map((item) => {
          return (
            <React.Fragment key={item.userInfo?.uid || item.uid}>
              {currentUser.uid !== item.uid && (
                <div className="searchusers" onClick={() => handleSelect(item.userInfo ? item.userInfo : item)}>
                  <img src={item.userInfo?.photoURL ? item.userInfo?.photoURL : item.photoURL} alt="" />
                  <div className="userInfo">
                    <span>{item.userInfo?.displayName ? item.userInfo?.displayName : item.displayName}</span>
                    <p>{item.lastMessage?.text ? item.lastMessage?.text : ""}</p>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })} */}
    </div>
  );
};

export default Chats;
