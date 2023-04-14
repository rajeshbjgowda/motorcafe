import { collection, getDocs } from "firebase/firestore";
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
    details.forEach((doc) => {
      services = {
        ...services,
        [doc.data().plan_id]: {
          id: doc.id,
          ...doc.data(),
        },
      };
    });
    dispatch(getServicePlans(services));
  };
};
