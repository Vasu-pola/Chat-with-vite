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
          {Object.keys(data.user).length > 0 && (
            <>
              <div className="d-flex align-items-center">
                <img src={data.user?.photoURL} alt="profileImg" width={50}  height={50}/>
                <span style={{ paddingLeft: "5px" }}>{data.user?.displayName}</span>
              </div>
              <div className="chatIcons">{/* <img src={More} alt="" /> */}</div>
            </>
          )}
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
