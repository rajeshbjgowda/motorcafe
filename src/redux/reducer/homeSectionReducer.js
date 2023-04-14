import { accordionActionsClasses } from "@mui/material";

const initialState = {
  slidders: [],
  webServices: [],
  employees: [],
  garage_Details: {},
};

export const homeSectionReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_SLIDDERS":
      return {
        ...state,
        slidders: action.payload,
      };
    case "GET_WEB_SERVICES":
      return {
        ...state,
        webServices: action.payload,
      };
    case "GET_WEB_EMPLOYEES":
      return {
        ...state,
        employees: action.payload,
      };
    case "GET_WEB_DETAILS":
      return {
        ...state,
        garage_Details: action.payload,
      };
    default:
      return state;
  }
};
