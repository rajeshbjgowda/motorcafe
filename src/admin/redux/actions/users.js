import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    updateDoc,
} from "firebase/firestore/lite";
import { fireStore } from "../../containers/firebase";


const getUsers = (data) => ({
    type: "GET_USERS_DATA",
    payload: data,
});


export const getUsersData = () => {

    return async (dispatch) => {


        const usersRef = collection(fireStore, "users");


        let details = await getDocs(usersRef);

        let users = {};
        details.docs.forEach((doc) => {

            users = { ...users, [doc.id]: { ...doc.data() } };
        });
        dispatch(getUsers({ ...users }))
    }

}




