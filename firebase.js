import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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
let app
if(firebase.apps.length === 0)
	app = firebase.initializeApp(firebaseConfig);
else
	app = firebase.app();
 
const auth = firebase.auth(app);

export { auth };
