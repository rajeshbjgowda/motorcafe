import { collection, getDocs } from "firebase/firestore";
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
    plansDetails.forEach((doc) => {
      plans = [...plans, { id: doc.id, ...doc.data() }];
    });

    console.log("plans", plans);
    dispatch(getServicePlans(plans));
  };
};
