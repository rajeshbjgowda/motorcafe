import { combineReducers } from "redux";
import { appointmenteducer } from "./reducer/appointments";
import { servicePlanReducer } from "./reducer/serviceplan";
import { servicePlanPriceReducer } from "./reducer/serviceplanprice";
import { adminVehicleReducer } from "./reducer/AdminVehicleReducer";
import { userReducer } from "./reducer/usersReducer";
import { homeSectionReducer } from "./reducer/homeSectionReducer";
import { authUserReducer } from "./reducer/LoginCredntains";

export const rootReducer = combineReducers({
  appointmenteducer,
  servicePlanReducer,
  servicePlanPriceReducer,
  adminVehicleReducer,
  userReducer,
  homeSectionReducer,
  authUserReducer,
});
