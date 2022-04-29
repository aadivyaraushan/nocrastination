// Import the functions you need from the SDKs you need
import { getDatabase } from "@firebase/database";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6MUueg3R66OnvCcBnNLkYoJ14qlsSmIc",

  authDomain: "nocrastination-d1741.firebaseapp.com",

  projectId: "nocrastination-d1741",

  storageBucket: "nocrastination-d1741.appspot.com",

  messagingSenderId: "62008867834",

  appId: "1:62008867834:web:dc5f198fe532c6cd0dc243",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const realtimedb = getDatabase(app);

export { auth, db, realtimedb };
