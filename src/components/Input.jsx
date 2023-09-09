import React, { useContext, useState } from "react";
import Img from "../assets/img.png";
import Attach from "../assets/attach.png";
import { Timestamp, arrayUnion, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firbase-config";
import { v4 as uuid } from "uuid";
import { AuthContext } from "./context/AuthContext";
import { ChatContext } from "./context/ChatContextProvider";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [send, setSend] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (text == "") {
      setSend(true);
    } else {
      if (img) {
        setSend(false);
        const storageRef = ref(storage, `${uuid()}`);
        const uploadTask = uploadBytesResumable(storageRef, img);
        uploadTask.on(
          (error) => {},
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            });
          }
        );
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
        setText("");
        setImg(null);
      } else {
        setSend(false);
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
          }),
        });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
        setImg(null);
        setText("");
      }
    }
  };

  // const handleSend = async () => {
  //   if (text === "") {
  //     setSend(true);
  //   } else {
  //     setSend(false);
  //     if (img) {
  //       const storageRef = ref(storage, `${uuid()}`);
  //       const uploadTask = uploadBytesResumable(storageRef, img);
  //       uploadTask.on(
  //         (error) => {},
  //         async () => {
  //           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

  //           // Check if the document exists, and if not, create it.
  //           const chatDocRef = doc(db, "chats", data.chatId);
  //           const chatDocSnapshot = await getDoc(chatDocRef);

  //           if (!chatDocSnapshot.exists()) {
  //             // The document doesn't exist, create it with initial data.
  //             const initialData = {
  //               messages: [],
  //               // Other initial data properties here if needed.
  //             };
  //             await setDoc(chatDocRef, initialData);
  //           }

  //           // Update the document with the new message.
  //           await updateDoc(chatDocRef, {
  //             messages: arrayUnion({
  //               id: uuid(),
  //               text,
  //               senderId: currentUser.uid,
  //               date: Timestamp.now(),
  //               img: downloadURL,
  //             }),
  //           });
  //         }
  //       );
  //       setText("");
  //       setImg(null);
  //     } else {
  //       // Same check for document existence before updating.
  //       const chatDocRef = doc(db, "chats", data.chatId);
  //       const chatDocSnapshot = await getDoc(chatDocRef);

  //       if (!chatDocSnapshot.exists()) {
  //         const initialData = {
  //           messages: [],
  //           // Other initial data properties here if needed.
  //         };
  //         await setDoc(chatDocRef, initialData);
  //       }

  //       // Update the document with the new message.
  //       await updateDoc(chatDocRef, {
  //         messages: arrayUnion({
  //           id: uuid(),
  //           text,
  //           senderId: currentUser.uid,
  //           date: Timestamp.now(),
  //         }),
  //       });

  //       // Rest of your code to update other documents.
  //     }
  //   }
  // };

  const handleKeyInput = (e) => {
    if (e.code === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="input">
      <input type="text" placeholder="Type something..." readOnly={data?.chatId === "null" ? true : false} onChange={(e) => setText(e.target.value)} value={text} onKeyDownCapture={handleKeyInput} />
      <div className="send">
        {/* <img src={Attach} alt="" /> */}
        <input type="file" style={{ display: "none" }} id="file" onChange={(e) => setImg(e.target.files[0])} />
        {data?.chatId !== "null" && (
          <>
            <label htmlFor="file">
              <img src={Img} alt="" />
            </label>
            <button onClick={handleSend} disabled={data?.chatId === "null" && text == "" ? true : false}>
              Send
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
