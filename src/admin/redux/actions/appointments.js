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
const getAppointments = (data) => ({
    type: "GET_APPOINTMENTS",
    payload: data,
});

const getransactions = (data) => ({
    type: "GET_PAYMENT_TRANSACTIONS",
    payload: data,
});


export const getAppointmentsData = () => {

    return async (dispatch) => {


        const appoinmetRef = collection(fireStore, "appointments");

        console.log("effect");
        let details = await getDocs(appoinmetRef);
        console.log("effect", details);
        let appoinmets = [];
        details.docs.forEach((doc) => {
            // console.log();
            // console.log(doc.id, doc.data());
            appoinmets = [...appoinmets, { id: doc.id, ...doc.data() }];
        });
        dispatch(getAppointments(appoinmets))
    }

}




export const getPaymentTransactions = () => {

    return async (dispatch) => {


        const paymentTransactions = collection(fireStore, "payment_trancations");

        console.log("effect");
        let details = await getDocs(paymentTransactions);
        console.log("effect", details);
        let transactions = [];
        details.docs.forEach((doc) => {
            // console.log();
            // console.log(doc.id, doc.data());
            transactions = [...transactions, { id: doc.id, ...doc.data() }];
        });
        dispatch(getransactions(transactions))
    }

}