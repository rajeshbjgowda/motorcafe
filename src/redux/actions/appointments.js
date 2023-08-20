import { collection, getDocs } from "firebase/firestore";
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
    let details = await getDocs(appoinmetRef);
    let appoinmets = [];
    details.forEach((doc) => {
      appoinmets = [...appoinmets, { id: doc.id, ...doc.data() }];
    });

    dispatch(getAppointments(appoinmets));
  };
};

export const getPaymentTransactions = () => {
  return async (dispatch) => {
    const paymentTransactions = collection(fireStore, "payment_trancations");
    let details = await getDocs(paymentTransactions);
    let transactions = [];
    details.forEach((doc) => {
      transactions = [...transactions, { id: doc.id, ...doc.data() }];
    });
    dispatch(getransactions(transactions));
  };
};
