// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

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

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
