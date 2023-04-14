import { accordionActionsClasses } from "@mui/material";

const initialState = {
  service_plans_prices: {},
};

export const servicePlanPriceReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_SERVICE_PLANS_PRICE":
      return {
        ...state,
        service_plans_prices: action.payload,
      };

    default:
      return state;
  }
};
