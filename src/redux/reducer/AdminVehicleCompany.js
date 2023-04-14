import { accordionActionsClasses } from "@mui/material";
import Loading from "../../components/Loading/Loading";

const initialState = {
  loading: false,
  error: "",
  vehicleCompanies: [],
};

export const adminVehicleCompanyReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_VEHICLE_COMPANY_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "GET_VEHICLE_COMPANY":
      return {
        ...state,
        vehicleCompanies: action.payload,
        loading: false,
        error: "",
      };
    case "GET_VEHICLE_COMPANY_ERROR":
      return {
        loading: false,
        error: action.payload,
        vehicleCompanies: [],
      };

    default:
      return state;
  }
};
