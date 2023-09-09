import React, { useContext, useState } from "react";
import More from "../assets/more.png";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "./context/ChatContextProvider";
import Modal from "react-bootstrap/Modal";
import ModalImage from "react-modal-image";

const Chat = () => {
  const { data } = useContext(ChatContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleShow = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="chat">
        <div className="chatInfo userInfo">
          {Object.keys(data.user).length > 0 && (
            <>
              <div className="d-flex align-items-center" style={{ cursor: "pointer" }} onClick={handleShow}>
                <img src={data.user?.photoURL} alt="profileImg" width={50} height={50} />
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

      <Modal size="sm" show={isOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="modalTitle">View Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="udProfile">
          {/* <img src={data.user?.photoURL} width={"100%"} className="viewprofileImg" /> */}
          {data.user?.photoURL && <ModalImage small={data.user?.photoURL} className="viewprofileImg" large={data.user?.photoURL} alt="image" hideDownload={true} />}
          <div className="pt-4">
            <label className="pe-2">Name:</label>
            <span className="namespan"> {data.user?.displayName}</span>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Chat;
