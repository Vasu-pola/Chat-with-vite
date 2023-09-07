import React, { useContext } from "react";
import More from "../assets/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "./context/ChatContextProvider";

const Chat = () => {
  const { data } = useContext(ChatContext);
  
  
  return (
    <>
      <div className="chat">
        <div className="chatInfo userInfo">
          <span>{data.user?.displayName}</span>
          <div className="chatIcons">
            <img src={More} alt="" />
          </div>
        </div>
        <div>
          <Messages />
        </div>
        <Input />
      </div>
    </>
  );
};

export default Chat;
