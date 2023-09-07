import { initializeApp } from "firebase/app";
import { getFirestore,collection, getDocs, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAgmVpJbyLpWUT3Rs4p3LWXoex_2ZsxJeU",
  authDomain: "chat-with-vite.firebaseapp.com",
  projectId: "chat-with-vite",
  storageBucket: "chat-with-vite.appspot.com",
  messagingSenderId: "558282224922",
  appId: "1:558282224922:web:f369aea5519eb6eee468a3",
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const storage = getStorage();
export const colref = collection(db, "users");
export const auth = getAuth(app);
