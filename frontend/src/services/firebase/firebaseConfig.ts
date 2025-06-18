import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcEiriO9-K-p6tD7nrr4uBWDME9pKpKek",
  authDomain: "fake-news-detecto.firebaseapp.com",
  projectId: "fake-news-detecto",
  storageBucket: "fake-news-detecto.firebasestorage.app",
  messagingSenderId: "1005833384894",
  appId: "1:1005833384894:web:1fe4e4090273c1f9a57fef",
  measurementId: "G-B7E78V93NH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);