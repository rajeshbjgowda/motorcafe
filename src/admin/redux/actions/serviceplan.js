

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
    type: "GET_SERVICE_PLANS",
    payload: data,
});


export const getServicePlanData = () => {

    return async (dispatch) => {


        const planRef = collection(fireStore, "plan");
        let plansDetails = await getDocs(planRef);


        let plans = [];
        plansDetails.docs.forEach((doc) => {
            // console.log();
            // console.log(doc.id, doc.data());
            plans = [...plans, { id: doc.id, ...doc.data() }];
        });


        dispatch(getServicePlans(plans))
    }

}
