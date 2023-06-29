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
  apiKey: <your_api_key>,
  authDomain: <your_auth_domain>,
  databaseURL: <your_db_url>,
  projectId: <your_project_id>,
  storageBucket: <your_storage_bucket>,
  messagingSenderId: <your_messaging_sender_id>,
  appId: <your_app_id>,
  measurementId: <your_measurement_id>
};

//you can find all the data for config by subscribe your app in firestore

// Initialize Firebase
const fire = initializeApp(firebaseConfig);
const analytics = getAnalytics(fire);
const auth = getAuth(fire);
const db = getFirestore(fire);


export { db, auth, analytics,fire };
