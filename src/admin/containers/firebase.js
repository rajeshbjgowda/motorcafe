import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
export const storage = getStorage(app);

export const fireStore = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);

export const fetchToken = (setTokenFound) => {
  return getToken(messaging, {
    vapidKey:
      "BOkJ8ORioxTre6p5wXD1-QkxBCnXLJsBwdus0I097xRBLigm1h81A1JQDHP1m-83ShVjp6mEhw6dJckAlPeC8CA",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("current token for client: ", currentToken);
        setTokenFound(true);
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        setTokenFound(false);
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

// See documentation on defining a message payload.
const message = {
  notification: {
    title: "$FooCorp up 1.43% on the day",
    body: "$FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.",
  },
};

// Send a message to devices subscribed to the combination of topics
// specified by the provided condition.

export const sendMessage = () => {
  getMessaging()
    .send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
};
