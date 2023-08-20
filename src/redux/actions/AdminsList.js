import { collection, getDocs } from "firebase/firestore";
import { fireStore } from "../../containers/firebase";

const getAdminList = (data) => ({
  type: "GET_ADMINS_LIST",
  payload: data,
});

const getAdminListLoading = (data) => ({
  type: "GET_ADMINS_LIST_LOADING",
  payload: data,
});

const getAdminListError = (data) => ({
  type: "GET_ADMINS_LIST_ERROR",
  payload: data,
});

export const getAdminListData = () => {
  return async (dispatch) => {
    dispatch(getAdminListLoading(true));
    try {
      const vehicleCompanyRef = collection(fireStore, "admins");
      let details = await getDocs(vehicleCompanyRef);
      let adminsList = [];

      details.forEach((doc) => {
        adminsList = [...adminsList, { id: doc.id, ...doc.data() }];
      });

      dispatch(getAdminList([...adminsList]));
      // dispatch(getVehicleCompanyLoading(false));
    } catch (error) {
      dispatch(getAdminListError("somthing went wrong"));
      // getVehicleCompanyLoading(false);
    }
  };
};
