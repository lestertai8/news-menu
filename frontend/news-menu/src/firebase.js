// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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