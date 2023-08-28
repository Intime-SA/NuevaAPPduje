import { initializeApp } from "firebase/app";
import {
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYrzHp9JaQ2TYJDsGgfvkN3XG1XdGGpOU",
  authDomain: "workshop-duje.firebaseapp.com",
  projectId: "workshop-duje",
  storageBucket: "workshop-duje.appspot.com",
  messagingSenderId: "251308545236",
  appId: "1:251308545236:web:3d7f3a5cbe89e5aea3d741",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export const db = getFirestore(app);

export const onSingIn = async ({ email, password }) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const logout = () => {
  signOut(auth);
};

let googleProvider = new GoogleAuthProvider();

export const loginGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    console.log(res);
  } catch (error) {}
};

export const signUp = async ({ email, password }) => {
  try {
    let res = await createUserWithEmailAndPassword(auth, email, password);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (email) => {
  let res = await sendPasswordResetEmail(auth, email);
  console.log(res);
  return res;
};
