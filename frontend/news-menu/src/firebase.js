// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserSessionPersistence, onAuthStateChanged, signOut } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8ZOEFyV7PmSMJyi3ZEUVYytxbAH1bXnU",
  authDomain: "news-menu.firebaseapp.com",
  databaseURL: "https://news-menu-default-rtdb.firebaseio.com",
  projectId: "news-menu",
  storageBucket: "news-menu.firebasestorage.app",
  messagingSenderId: "210628775385",
  appId: "1:210628775385:web:2bb356d3d8d8097ee55dc8",
  measurementId: "G-FX3BEHRN4G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// -------------------------------------------------
// EXPORTS
// -------------------------------------------------
export const db = getFirestore(app);

// authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { onAuthStateChanged, signOut };

// Reused from firebase.js file here: https://github.com/394-w25/CourseBuddy/tree/master
export const signInWithGoogle = async () => {
  try {
    await setPersistence(auth, browserSessionPersistence);
    const result = await signInWithPopup(auth, provider);
    const user = result.user
    return (user);
  } catch (error) {
    console.error("Error with Google sign-in: ", error);
  }
}