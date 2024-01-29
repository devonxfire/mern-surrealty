// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-surrealty.firebaseapp.com",
  projectId: "mern-surrealty",
  storageBucket: "mern-surrealty.appspot.com",
  messagingSenderId: "679279377592",
  appId: "1:679279377592:web:023be0f915752cb36f484d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
