import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useEffect, useReducer, useState } from "react";
import { auth } from "../../firbase-config";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };
  const chatReducer = (state, action) => {
    switch (action.type) {
      
        // return {
        //   user: action.payload,
        //   chatId: currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid,
        // };
      case "User_Click":
        const newChatId = currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid;

        if (newChatId === state.chatId) {
          return state;
        }

        return {
          ...state,
          user: action.payload,
          chatId: newChatId,
        };
      case "RESET":
        return INITIAL_STATE;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  return <ChatContext.Provider value={{ data: state, dispatch }}>{children}</ChatContext.Provider>;
};
