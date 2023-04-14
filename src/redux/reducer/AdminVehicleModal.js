import { accordionActionsClasses } from "@mui/material";
import Loading from "../../components/Loading/Loading";

const initialState = {
  loading: false,
  error: "",
  vehicleModals: [],
};

export const adminVehicleModal = (state = initialState, action) => {
  switch (action.type) {
    case "GET_VEHICLE_MODAL_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "GET_VEHICLE_MODAL":
      return {
        ...state,
        vehicleModals: action.payload,
        loading: false,
        error: "",
      };
    case "GET_VEHICLE_MODAL_ERROR":
      return {
        loading: false,
        error: action.payload,
        vehicleModals: [],
      };

    default:
      return state;
  }
};
