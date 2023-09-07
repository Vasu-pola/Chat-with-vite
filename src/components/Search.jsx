import React, { useContext, useState } from "react";
import cat from "../assets/cat.jpg";
import { collection, query, where, getDocs, setDoc, updateDoc, serverTimestamp, getDoc, doc } from "firebase/firestore";
import { db } from "../firbase-config";
import { AuthContext } from "./context/AuthContext";
import { ChatContext } from "./context/ChatContextProvider";
const Search = () => {
  const [findUserName, setFindUserName] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState({
    mes: "",
  });
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleChange = async (e) => {
    const usersNames = collection(db, "users");
    // Create a query against the collection.
    try {
      const q = query(usersNames, where("displayName", "==", findUserName));
      console.log(q, "user111");
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        if (doc.data().displayName == currentUser.displayName) {
          setUser(null);
          setErr({ ...err, msg: "You Are the user" });
        } else {
          setUser(doc.data());
          setErr({ ...err, msg: "" });
        }
      });
    } catch (err) {
      setErr({ ...err, msg: "Something went wrong" });
    }
  };


  const handleKeySearch = (e) => {
    if (e.code === "Enter") {
      handleChange();
    }
  };
  const handleSelect = async () => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
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
      
    }
    setUser(null);
    setFindUserName("");
  };


  return (
    <>
      <div className="search">
        <input className="searchForm" value={findUserName} placeholder="Find user" onKeyDownCapture={handleKeySearch} onChange={(e) => setFindUserName(e.target.value)} />
        {<span>{err?.msg}</span>}
        {user && Object.keys(user).length > 0 && (
          <div className="searchusers" onClick={() => handleSelect()}>
            <img src={user?.photoURL} alt="" />
            <div className="userInfo">
              <span>{user?.displayName}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
