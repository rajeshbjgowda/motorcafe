import { combineReducers } from "redux";
import { appointmenteducer } from "./reducer/appointments";
import { servicePlanReducer } from "./reducer/serviceplan";
import { servicePlanPriceReducer } from "./reducer/serviceplanprice";
import { userReducer } from "./reducer/usersReducer";
import { homeSectionReducer } from "./reducer/homeSectionReducer";
import { authReducer } from "./reducer/authReducer";
import { serviceListReducer } from "./reducer/AdminServiceList";
import { userEnqiresReducer } from "./reducer/UserEnquires";
import { adminVehicleCompanyReducer } from "./reducer/AdminVehicleCompany";
import { adminVehicleModal } from "./reducer/AdminVehicleModal";
import { adminListReducer } from "./reducer/AdminsList";

export const rootReducer = combineReducers({
  appointmenteducer,
  servicePlanReducer,
  servicePlanPriceReducer,

  userReducer,
  homeSectionReducer,
  user: authReducer,
  serviceListReducer,
  userEnqiresReducer,
  adminVehicleCompanyReducer,
  adminVehicleModal,
  adminListReducer,
});
