import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

const firebaseConfig = {
  apiKey: "AIzaSyA4D8qz8m-Fhnbv8B24OqASX7fJQ4cVUaM",
  authDomain: "motorcafe-7ba65.firebaseapp.com",
  databaseURL: "https://motorcafe-7ba65-default-rtdb.firebaseio.com",
  projectId: "motorcafe-7ba65",
  storageBucket: "motorcafe-7ba65.appspot.com",
  messagingSenderId: "288084072410",
  appId: "1:288084072410:web:c1d76fa000779ea88f12e3",
  measurementId: "G-88ZE3K1Y33",
};

export const app = initializeApp(firebaseConfig);
export const fireStore = getFirestore(app);
