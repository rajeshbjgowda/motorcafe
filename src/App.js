import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashBoard from "./admin";
import { ProtectedRoute } from "./admin/components/ProtectedRoute";
import AdmiAppointmentPaymets from "./admin/containers/AdmiAppointmentPaymets";
import AdmicVehicleCompany from "./admin/containers/AdmicVehicleCompany";
import AdmicVehicleModal from "./admin/containers/AdmicVehicleModal ";
import AdminAllUsers from "./admin/containers/AdminAllUsers";
import CreateAdmin from "./admin/containers/AdminCreateUser";
import AdminHomeSctionSlidders from "./admin/containers/WebsiteSetting/AdminHomeSctionSettings";
import AdminServicePlan from "./admin/containers/AdminServicePlan";
import AdminServicePlanPrice from "./admin/containers/AdminServicePlanPrice";
import AdmiPaymentModes from "./admin/containers/AdmiPaymentModes";
import AdmiPaymentStatus from "./admin/containers/AdmiPaymentStatus";
import AdmiVehicleType from "./admin/containers/AdmiVehicleType";
import AdminAppointments from "./admin/containers/appointments/AdminAppointments";
import DashBoard from "./admin/containers/DashBoard";
import SignIn from "./admin/Login";
import AdmicVehicleCategory from "./admin/containers/AdminVehicleCategory";
import BannerWebsite from "./website/BannerWebsite";

import WebCarServices from "./admin/containers/WebsiteSetting/WebCarServicesCard";
import WebEmployees from "./admin/containers/WebsiteSetting/WebEmployees";
import WebSiteDetails from "./admin/containers/WebsiteSetting/WebSiteDetails";
import Notification from "./admin/components/Notification";

function App() {
  return (
    <Routes>
      <Route path="/" element={<BannerWebsite />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashBoard />
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/all-user"
          element={
            <ProtectedRoute>
              <AdminAllUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/create-admin"
          element={
            <ProtectedRoute>
              <CreateAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="service/service-plan"
          element={
            <ProtectedRoute>
              <AdminServicePlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="service/service-plan-price"
          element={
            <ProtectedRoute>
              <AdminServicePlanPrice />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehicle/vehicle-company"
          element={
            <ProtectedRoute>
              <AdmicVehicleCompany />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehicle/vehicle-category"
          element={
            <ProtectedRoute>
              <AdmicVehicleCategory />
            </ProtectedRoute>
          }
        />

        <Route
          path="vehicle/vehicle-model"
          element={
            <ProtectedRoute>
              <AdmicVehicleModal />
            </ProtectedRoute>
          }
        />
        <Route
          path="vehicle/vehicle-type"
          element={
            <ProtectedRoute>
              <AdmiVehicleType />
            </ProtectedRoute>
          }
        />
        <Route
          path="appointment/payments"
          element={
            <ProtectedRoute>
              <AdmiAppointmentPaymets />
            </ProtectedRoute>
          }
        />
        <Route
          path="appointment/appointments"
          element={
            <ProtectedRoute>
              <AdminAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="appointment/payment-mode"
          element={
            <ProtectedRoute>
              <AdmiPaymentModes />
            </ProtectedRoute>
          }
        />
        <Route
          path="appointment/payment-status"
          element={
            <ProtectedRoute>
              <AdmiPaymentStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="home-section/slidder"
          element={
            <ProtectedRoute>
              <AdminHomeSctionSlidders />
            </ProtectedRoute>
          }
        />

        <Route
          path="home-section/car-services"
          element={
            <ProtectedRoute>
              <WebCarServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="home-section/teams"
          element={
            <ProtectedRoute>
              <WebEmployees />
            </ProtectedRoute>
          }
        />
        <Route
          path="home-section/details"
          element={
            <ProtectedRoute>
              <WebSiteDetails />
            </ProtectedRoute>
          }
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

      <Route path="/login" element={<SignIn />} />
      <Route path="/not" element={<Notification />} />
    </Routes>
  );
}

export default App;
