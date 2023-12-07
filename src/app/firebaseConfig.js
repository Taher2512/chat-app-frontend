// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "chat-app-dbcf0.firebaseapp.com",
  projectId: "chat-app-dbcf0",
  storageBucket: "chat-app-dbcf0.appspot.com",
  messagingSenderId: "910214873205",
  appId: "1:910214873205:web:35d2f72653a218a727f83c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
