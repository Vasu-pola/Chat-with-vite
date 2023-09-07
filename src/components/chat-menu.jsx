import React, { useState } from "react";
import Login from "./Login";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firbase-config";
import { useNavigate } from "react-router";
import "./page.css";
import Button from "react-bootstrap/esm/Button";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

const ChatMenu = () => {
  return (
    <>
      <div className="chat-container">
        <div className="chat-box d-md-flex">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="chat">
            <Chat />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMenu;
