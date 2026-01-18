import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeWa52azEqdfZ-oPzp-55_GRetcwEAH0M",
  authDomain: "verse72-1478f.firebaseapp.com",
  projectId: "verse72-1478f",
  storageBucket: "verse72-1478f.firebasestorage.app",
  messagingSenderId: "701952248139",
  appId: "1:701952248139:web:62978cb8c85a460c7e00ce"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
