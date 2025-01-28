import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsTxdgtbVoukjtMfwr38MfIxeJhgK4HaQ",
  authDomain: "loginandregistro-8f622.firebaseapp.com",
  projectId: "loginandregistro-8f622",
  storageBucket: "loginandregistro-8f622.firebasestorage.app",
  messagingSenderId: "79675788385",
  appId: "1:79675788385:web:ef7f58cfb3b424a3d7ee20"
};


const app = initializeApp(firebaseConfig);


const db = getFirestore(app);
export const auth = getAuth(app);


export { db, addDoc, getDocs, collection, query, where };

