import { accordionActionsClasses } from "@mui/material";

const initialState = {
  enquires: [],
};

export const userEnqiresReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_USERS_ENQUIRES_DATA":
      return {
        ...state,
        enquires: [...action.payload],
      };

    default:
      return state;
  }
};
