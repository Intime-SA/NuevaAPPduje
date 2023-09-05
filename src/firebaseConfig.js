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

import { collection, getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import axios from "axios";
import { useState } from "react";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export const db = getFirestore(app);
export const storage = getStorage(app);

export const productsCollection = collection(db, "productos");
export const clientesCollection = collection(db, "clientes");

// Ejecuta la función de importación de datos

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
    return res;
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

export const uploadFile = async (file) => {
  const storageRef = ref(storage, v4());
  await uploadBytes(storageRef, file);
  let url = await getDownloadURL(storageRef);
  return url;
};
