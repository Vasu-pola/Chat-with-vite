import { useContext, useState } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc } from "firebase/firestore";
import ChatMenu from "./components/chat-menu";
import Login from "./components/Login";
import { getAuth } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Chat from "./components/Chat";
import { AuthContext } from "./components/context/AuthContext";

function App() {
  const [count, setCount] = useState(0);
  const { currentUser } = useContext(AuthContext);

  const PrivateRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // Your web app's Firebase configuration
  // const firebaseConfig = {
  //   apiKey: "AIzaSyAgmVpJbyLpWUT3Rs4p3LWXoex_2ZsxJeU",
  //   authDomain: "chat-with-vite.firebaseapp.com",
  //   projectId: "chat-with-vite",
  //   storageBucket: "chat-with-vite.appspot.com",
  //   messagingSenderId: "558282224922",
  //   appId: "1:558282224922:web:f369aea5519eb6eee468a3",
  // };

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);

  // //init services
  // const db = getFirestore();

  // //collection ref
  // const colref = collection(db, "users");

  //get Collection data
  // getDocs(colref)
  //   .then((snapshot) => {
  //     let users = [];
  //     snapshot.docs.forEach((doc) => {
  //       users.push({ ...doc.data(), id: doc.id });
  //     });
  //     console.log(users);
  //   })
  //   .catch((err) => {

  //     console.log(err.message);
  //   });

  return (
    <>
      <Router>
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <PrivateRoute>
                  <ChatMenu />
                </PrivateRoute>
              }
            />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
