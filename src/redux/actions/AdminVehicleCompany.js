import { collection, getDocs } from "firebase/firestore";
import { fireStore } from "../../containers/firebase";

const getVehicleCompany = (data) => ({
  type: "GET_VEHICLE_COMPANY",
  payload: data,
});

const getVehicleCompanyLoading = (data) => ({
  type: "GET_VEHICLE_COMPANY_LOADING",
  payload: data,
});

const getVehicleCompanyError = (data) => ({
  type: "GET_VEHICLE_COMPANY_ERROR",
  payload: data,
});

export const getVehicleCompanyData = () => {
  return async (dispatch) => {
    dispatch(getVehicleCompanyLoading(true));
    try {
      const vehicleCompanyRef = collection(fireStore, "vehicle_company");
      let details = await getDocs(vehicleCompanyRef);
      let vehicleCompany = [];
      console.log("details", details.length);
      details.forEach((doc) => {
        console.log("details", doc.data());

        vehicleCompany = [...vehicleCompany, { id: doc.id, ...doc.data() }];
      });

      dispatch(getVehicleCompany([...vehicleCompany]));
      // dispatch(getVehicleCompanyLoading(false));
    } catch (error) {
      console.log(error);
      dispatch(getVehicleCompanyError("somthing went wrong"));
      // getVehicleCompanyLoading(false);
    }
  };
};
