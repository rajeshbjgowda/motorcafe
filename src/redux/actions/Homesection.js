import { collection, getDocs } from "firebase/firestore";
import { fireStore } from "../../containers/firebase";
const getSlidders = (data) => ({
  type: "GET_SLIDDERS",
  payload: data,
});

const getWebServices = (data) => ({
  type: "GET_WEB_SERVICES",
  payload: data,
});

const getWebPlans = (data) => ({
  type: "GET_WEB_PLANS",
  payload: data,
});

const getWebEmployees = (data) => ({
  type: "GET_WEB_EMPLOYEES",
  payload: data,
});

const getWebDetails = (data) => ({
  type: "GET_WEB_DETAILS",
  payload: data,
});

export const getWebDetailsData = () => {
  return async (dispatch) => {
    const garagedetailsRef = collection(fireStore, "garage_details");
    let details = await getDocs(garagedetailsRef);
    let webDetails = {};
    details.forEach((doc) => {
      webDetails = { id: doc.id, ...doc.data() };
    });
    dispatch(getWebDetails({ ...webDetails }));
  };
};

export const getWebEmployeesData = () => {
  return async (dispatch) => {
    const employesRef = collection(fireStore, "web_employers");
    let details = await getDocs(employesRef);
    let employes = [];
    details.forEach((doc) => {
      employes = [...employes, { id: doc.id, ...doc.data() }];
    });
    dispatch(getWebEmployees([...employes]));
  };
};

export const getWebPalnsData = () => {
  return async (dispatch) => {
    const sliddersRef = collection(fireStore, "web_car_services");
    let details = await getDocs(sliddersRef);
    let plans = [];
    details.forEach((doc) => {
      plans = [...plans, { id: doc.id, ...doc.data() }];
    });
    dispatch(getWebPlans([...plans]));
  };
};

export const getWebServicesData = () => {
  return async (dispatch) => {
    const sliddersRef = collection(fireStore, "web_car_services");
    let details = await getDocs(sliddersRef);
    let services = [];
    details.forEach((doc) => {
      services = [...services, { id: doc.id, ...doc.data() }];
    });
    dispatch(getWebServices([...services]));
  };
};
export const getSliddersData = () => {
  return async (dispatch) => {
    const sliddersRef = collection(fireStore, "slidders");
    let details = await getDocs(sliddersRef);
    let slidders = [];
    details.forEach((doc) => {
      slidders = [...slidders, { id: doc.id, ...doc.data() }];
    });
    dispatch(getSlidders([...slidders]));
  };
};
