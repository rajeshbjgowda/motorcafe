import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFunctions } from "firebase/functions";
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
export const storage = getStorage(app);

export const fireStore = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);
export const functions = getFunctions(app);

export const fetchToken = async (setTokenFound) => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey:
        "BOkJ8ORioxTre6p5wXD1-QkxBCnXLJsBwdus0I097xRBLigm1h81A1JQDHP1m-83ShVjp6mEhw6dJckAlPeC8CA",
    });
    if (currentToken) {
      setTokenFound(true);
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
      setTokenFound(false);
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

const message = {
  notification: {
    title: "$FooCorp up 1.43% on the day",
    body: "$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.",
  },
};

export const sendMessage = () => {
  getMessaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};
