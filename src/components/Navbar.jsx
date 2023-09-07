import React, { useContext, useEffect, useState } from "react";
import "./page.css";
import { useNavigate } from "react-router";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firbase-config";
import { ChatContext } from "./context/ChatContextProvider";

const Navbar = () => {
  const [userName, setUserName] = useState({});
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    // Subscribe to auth state changes when the component mounts
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUserName(currentUser);
    });

    // Unsubscribe from auth state changes when the component unmounts
    return () => unsubscribe();
  }, []);

  const navigate = useNavigate();

  const logout = () => {
    signOut(auth);
    dispatch({ type: "RESET" });
    navigate("/login");
  };


  return (
    <>
      <div className="d-md-flex justify-content-between px-1 py-2 header">
        <p className="name">Chat With You</p>
        <div className="d-flex align-items-center">
          <img src={userName?.photoURL} width={40} className="profileImg" />
          <p className="name pe-2 ps-1">{userName?.displayName}</p>
          <button className="logout-button" onClick={() => logout()}>
            logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
