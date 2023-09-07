import React, { useContext, useEffect, useRef } from "react";
import cat from "../assets/cat.jpg";
import { AuthContext } from "./context/AuthContext";
import { ChatContext } from "./context/ChatContextProvider";
const Message = ({ message }) => {
  // const mes = message.message
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();
  const seconds = message?.date.seconds;
  const nanoseconds = message?.date.nanoseconds;

  // Convert nanoseconds to milliseconds (1 second = 1000 milliseconds)
  const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1000000);

  // Create a JavaScript Date object
  const date = new Date(milliseconds);

  // console.log(date.toISOString().split("-").join("/"),"message");
  const originalDate = new Date(date.toISOString());
  const year = originalDate.getFullYear().toString().slice(-2);
  const month = String(originalDate.getMonth() + 1).padStart(2, "0");
  const day = String(originalDate.getDate()).padStart(2, "0");
  const hours = String(originalDate.getHours()).padStart(2, "0");
  const minutes = String(originalDate.getMinutes()).padStart(2, "0");

  const formattedDate = `${day}/${month}/${year} - ${hours}:${minutes}`;

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <>
      <div ref={ref} className={`message ${message?.senderId === currentUser.uid && "owner"}`}>
        <div className="messageInfo">
          <img src={message?.senderId == currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />
        </div>
        <div className={`messageContent ${message?.senderId === currentUser.uid && "messageContent1"}`}>
          <p style={{marginBottom:"0px"}}>{message?.text}</p>
          {message?.img && <img src={message?.img} alt="" />}
          <span className="dateshow">{formattedDate && formattedDate}</span>
        </div>
       
      </div>
    </>
  );
};

export default Message;
