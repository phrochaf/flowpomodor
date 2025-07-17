// client/src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// --- YOUR FIREBASE CONFIGURATION KEYS GO HERE ---
// This is the object you copied from the Firebase website earlier.
const firebaseConfig = {
    apiKey: "AIzaSyA1dVLR3yK6qwJCPh4s9A3V8b-15MYYai0",
    authDomain: "flowpomodor.firebaseapp.com",
    projectId: "flowpomodor",
    storageBucket: "flowpomodor.firebasestorage.app",
    messagingSenderId: "832171658100",
    appId: "1:832171658100:web:2bb9299cdeb521300a7a21",
    measurementId: "G-RGDMLZBJEK"
  };

// --- INITIALIZE FIREBASE AND ITS SERVICES ---

// Initialize the main Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Create a new instance of the Google provider object
export const googleProvider = new GoogleAuthProvider();