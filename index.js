import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHkh-ud3uZPD_w530Mav_o_AOBEO-E7mQ",
  authDomain: "kbr-shoot01.firebaseapp.com",
  databaseURL: "https://kbr-shoot01.firebaseio.com",
  projectId: "kbr-shoot01",
  storageBucket: "kbr-shoot01.appspot.com",
  messagingSenderId: "244138302237",
  appId: "1:244138302237:web:35fb29588977e6fc785ff4",
  measurementId: "G-YCV7TSS2R5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
