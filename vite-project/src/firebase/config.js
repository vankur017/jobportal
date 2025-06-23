// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6jgJmVztd_F4xdGNfeJtX3ZpQAwBL3SE",
  authDomain: "coachingsite-c02ac.firebaseapp.com",
  projectId: "coachingsite-c02ac",
  storageBucket: "coachingsite-c02ac.firebasestorage.app",
  messagingSenderId: "521256058359",
  appId: "1:521256058359:web:230f6ab7ecbaf3f77202f2",
  measurementId: "G-N55NFX9QSY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };