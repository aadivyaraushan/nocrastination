import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyChAt4y0DE4VhmakVCTalEVIZcZ1FgfEOA",
  authDomain: "nocrastination-da9a5.firebaseapp.com",
  projectId: "nocrastination-da9a5",
  storageBucket: "nocrastination-da9a5.appspot.com",
  messagingSenderId: "904825002813",
  appId: "1:904825002813:web:15ff349438d3f9d0f24354",
  measurementId: "G-HSDMJ2YB37T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 
const auth = getAuth(app);
const db = getFirestore(app);

export { auth };
