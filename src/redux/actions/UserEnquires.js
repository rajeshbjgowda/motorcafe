import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { fireStore } from "../../containers/firebase";

const getUsersEnquires = (data) => ({
  type: "GET_USERS_ENQUIRES_DATA",
  payload: data,
});

export const getUsersEnquiresData = () => {
  return async (dispatch) => {
    const usersRef = collection(fireStore, "enquires_user");

    let details = await getDocs(usersRef);

    let users = [];
    details.forEach((doc) => {
      console.log("enquires", doc.data());
      users = [...users, { id: doc.id, ...doc.data() }];
    });
    console.log("enquires", users);

    dispatch(getUsersEnquires(users));
  };
};
