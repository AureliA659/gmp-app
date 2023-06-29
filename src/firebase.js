//Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/firestore";
import "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7TC0rPlAE637r71FK79riojW6loCR0fA",
  authDomain: "the-spot-ee047.firebaseapp.com",
  databaseURL: "https://the-spot-ee047-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "the-spot-ee047",
  storageBucket: "the-spot-ee047.appspot.com",
  messagingSenderId: "939942500281",
  appId: "1:939942500281:web:f23ea669dfbf0d30324868",
  measurementId: "G-4X0R756WDE"
};

// Initialize Firebase
const fire = initializeApp(firebaseConfig);
const analytics = getAnalytics(fire);
const auth = getAuth(fire);
const db = getFirestore(fire);


export { db, auth, analytics,fire };
