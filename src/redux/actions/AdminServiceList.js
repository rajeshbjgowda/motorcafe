import { collection, getDocs } from "firebase/firestore";
import { fireStore } from "../../containers/firebase";

const getServiceList = (data) => ({
  type: "GET_SERVICE_LIST",
  payload: data,
});

export const getServiceListData = () => {
  return async (dispatch) => {
    const servicesRef = collection(fireStore, "service");
    let details = await getDocs(servicesRef);
    let services = {};
    details.forEach((doc) => {
      console.log("doc", doc.data());
      services = {
        ...services,
        [doc.id]: {
          id: doc.id,
          ...doc.data(),
        },
      };
    });
    dispatch(getServiceList(services));
  };
};
