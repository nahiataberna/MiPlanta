// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCcVwSXBEb3ehR2tUiWccJZuutcEuFa4fs",
    authDomain: "miplanta-5f179.firebaseapp.com",
    projectId: "miplanta-5f179",
    storageBucket: "miplanta-5f179.appspot.com",
    messagingSenderId: "915839174147",
    appId: "1:915839174147:web:7c5671c6dc2b4043243036",

    /*apiKey: Constants.manifest?.extra?.firebaseApiKey,
    authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
    projectId: Constants.manifest?.extra?.firebaseProjectId,
    storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
    appId: Constants.manifest?.extra?.firebaseAppId,*/
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(app, "gs://miplanta-5f179.appspot.com");

export { auth, db, storage };