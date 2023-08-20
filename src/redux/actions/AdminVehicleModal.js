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
      const vehicleCompanyRef = collection(fireStore, "vehicle_company");
      let companydetails = await getDocs(vehicleCompanyRef);
      let vehicleCompany = {};

      companydetails.forEach((doc) => {
        vehicleCompany = {
          ...vehicleCompany,
          [doc.id]: { id: doc.id, ...doc.data() },
        };
      });

      const vehicleModalRef = collection(fireStore, "vehicleModel");
      let modalDetails = await getDocs(vehicleModalRef);
      let vehicleModals = [];

      modalDetails.forEach((doc) => {
        let modalData = doc.data();
        vehicleModals = [
          ...vehicleModals,
          {
            id: doc.id,
            ...modalData,
            company_name: vehicleCompany[modalData.company_name].company_name,
          },
        ];
      });

      dispatch(getVehicleModal([...vehicleModals]));
      // dispatch(getVehicleCompanyLoading(false));
    } catch (error) {
      dispatch(getVehicleModalError("somthing went wrong"));
      // getVehicleCompanyLoading(false);
    }
  };
};
