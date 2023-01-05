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
const getServicePlans = (data) => ({
  type: "GET_SERVICE_PLANS_PRICE",
  payload: data,
});

export const getServicePlanPriceData = () => {
  return async (dispatch) => {
    const servicesRef = collection(fireStore, "service");
    let details = await getDocs(servicesRef);

    let services = {};
    details.docs.forEach((doc) => {
      console.log();
      services = {
        ...services,

        [doc.data().plan_id]: {
          id: doc.id,
          ...doc.data(),
        },
      };
    });
    console.log("rajesh", services);
    dispatch(getServicePlans(services));
  };
};
