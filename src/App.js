import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashBoard from "./admin";
import AdmiAppointmentPaymets from "./admin/containers/AdmiAppointmentPaymets";
import AdmicVehicleCompany from "./admin/containers/AdmicVehicleCompany";
import AdmicVehicleModal from "./admin/containers/AdmicVehicleModal ";
import AdminAllUsers from "./admin/containers/AdminAllUsers";
import AdminCreateUser from "./admin/containers/AdminCreateUser";
import AdminHomeSctionSettings from "./admin/containers/AdminHomeSctionSettings";
import AdminServicePlan from "./admin/containers/AdminServicePlan";
import AdmiPaymentModes from "./admin/containers/AdmiPaymentModes";
import AdmiPaymentStatus from "./admin/containers/AdmiPaymentStatus";
import AdmiVehicleType from "./admin/containers/AdmiVehicleType";
import DashBoard from "./admin/containers/DashBoard";
import SignIn from "./admin/Login";

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashBoard />}>
        <Route path="dashboard" element={<DashBoard />} />
        <Route path="users/all-user" element={<AdminAllUsers />} />
        <Route path="users/create-admin" element={<AdminCreateUser />} />
        <Route path="service/service-plan" element={<AdminServicePlan />} />
        <Route
          path="vehicle/vehicle-company"
          element={<AdmicVehicleCompany />}
        />
        <Route path="vehicle/vehicle-model" element={<AdmicVehicleModal />} />
        <Route path="vehicle/vehicle-type" element={<AdmiVehicleType />} />
        <Route
          path="appointment/payments"
          element={<AdmiAppointmentPaymets />}
        />
        <Route path="appointment/payment-mode" element={<AdmiPaymentModes />} />
        <Route
          path="appointment/payment-status"
          element={<AdmiPaymentStatus />}
        />
        <Route
          path="home-section/settings"
          element={<AdminHomeSctionSettings />}
        />
        <Route
          path="*"
          element={
            <div>
              <h3> Page Not Fuound</h3>
            </div>
          }
        />
      </Route>
      {/* <Route path="/" element={<Navigate to="/admin/dashboard" replace />} /> */}
      <Route path="/" element={<SignIn />} />
    </Routes>
  );
}

export default App;
