import { accordionActionsClasses } from "@mui/material";

const initialState = {
  user: {},
};

export const authUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_LOGED_USER":
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};
