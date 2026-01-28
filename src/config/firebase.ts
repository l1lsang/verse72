import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAeWa52azEqdfZ-oPzp-55_GRetcwEAH0M",
  authDomain: "verse72-1478f.firebaseapp.com",
  projectId: "verse72-1478f",
  storageBucket: "verse72-1478f.firebasestorage.app",
  messagingSenderId: "701952248139",
  appId: "1:701952248139:web:62978cb8c85a460c7e00ce",
};

// 🔥 핵심: 이미 있으면 재사용
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
