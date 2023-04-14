import { collection, getDocs } from "firebase/firestore";
import { fireStore } from "../../containers/firebase";

const getVehicleModal = (data) => ({
  type: "GET_VEHICLE_MODAL",
  payload: data,
});

const getVehicleModalLoading = (data) => ({
  type: "GET_VEHICLE_MODAL_LOADING",
  payload: data,
});

const getVehicleModalError = (data) => ({
  type: "GET_VEHICLE_MODAL_ERROR",
  payload: data,
});

export const getVehicleModalData = () => {
  return async (dispatch) => {
    dispatch(getVehicleModalLoading(true));
    try {
      const vehicleCompanyRef = collection(fireStore, "vehicleModel");
      let details = await getDocs(vehicleCompanyRef);
      let vehicleCompany = [];

      details.forEach((doc) => {
        console.log(doc.data());

        vehicleCompany = [...vehicleCompany, { id: doc.id, ...doc.data() }];
      });

      dispatch(getVehicleModal([...vehicleCompany]));
      // dispatch(getVehicleCompanyLoading(false));
    } catch (error) {
      dispatch(getVehicleModalError("somthing went wrong"));
      // getVehicleCompanyLoading(false);
    }
  };
};
