import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { isEmpty } from "lodash";
import { storage } from "../containers/firebase";
import axios from "axios";

export const sendPushNotificationToDeviceTokens = async ({
  // to is array of registered tokens
  to,
  data,
}) => {
  console.log("sendPushNotificationToDeviceTokens");
  try {
    console.log("sendPushNotificationToDeviceTokens2");

    // const headers = new Headers();
    // headers.append("Content-Type", "application/json");
    // headers.append(
    //   "Authorization",
    //   `key=${process.env.REACT_APP_CLOUD_MESSAGING_SERVER_KEY}`
    // );
    const body = {
      priority: "HIGH",
      data,
      to,
    };

    // console.log("sendPushNotificationToDeviceTokens2", JSON.stringify(body));
    // const options1 = {
    //   method: "POST",
    //   headers: headers,
    //   mode: "no-cors",
    //   body: JSON.stringify(body),
    // };
    // const request = new Request("https://fcm.googleapis.com/fcm/send", options);
    // const res = await fetch(request);
    // await res.json();
    // console.log("Notification Sent Successfully");

    let options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${process.env.REACT_APP_CLOUD_MESSAGING_SERVER_KEY}`,
      },
    };

    axios
      .post("https://fcm.googleapis.com/fcm/send", body, options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
  }
};

export const sendPushNotificationToDeviceTopic = async ({
  to,
  notification,
  data,
}) => {
  try {
    if (to) {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(
        "Authorization",
        `key=${process.env.REACT_APP_CLOUD_MESSAGING_SERVER_KEY}`
      );
      const body = {
        to: `/topics/${to}`,
        notification,
        data,
      };
      const options = {
        method: "POST",
        headers: headers,
        mode: "no-cors",
        body: JSON.stringify(body),
      };
      const request = new Request(
        "https://fcm.googleapis.com/fcm/send",
        options
      );
      const res = await fetch(request);
      await res.json();
      console.log("Notification Sent Successfully");
    }
  } catch (error) {
    console.log(error);
  }
};

export const uploadFileToFirebase = async (fileInput) => {
  const imageRef = ref(storage, `${new Date().getTime()}_${fileInput.name}`);
  const snapshot = await uploadBytes(imageRef, fileInput);
  const url = getDownloadURL(snapshot.ref);
  return url;
};
