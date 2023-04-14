import { accordionActionsClasses } from "@mui/material";
import Loading from "../../components/Loading/Loading";

const initialState = {
  loading: false,
  error: "",
  adminsList: [],
};

export const adminListReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ADMINS_LIST_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "GET_ADMINS_LIST":
      return {
        ...state,
        adminsList: action.payload,
        loading: false,
        error: "",
      };
    case "GET_ADMINS_LIST_ERROR":
      return {
        loading: false,
        error: action.payload,
        adminsList: [],
      };

    default:
      return state;
  }
};
