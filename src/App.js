import { Routes, Route, Navigate } from "react-router-dom";

import AdmiAppointmentPaymets from "./containers/AdmiAppointmentPaymets";

import AdminAllUsers from "./containers/AdminAllUsers";
import CreateAdmin from "./containers/AdminCreateUser";
import AdminHomeSctionSlidders from "./containers/WebsiteSetting/AdminHomeSctionSettings";
import AdminServicePlan from "./containers/AdminServicePlan";
import AdminServiceList from "./containers/AdminServiceList";
import AdmiPaymentModes from "./containers/AdmiPaymentModes";
import AdmiPaymentStatus from "./containers/AdmiPaymentStatus";

import AdminAppointments from "./containers/appointments/AdminAppointments";
import DashBoard from "./containers/DashBoard";

import WebCarServices from "./containers/WebsiteSetting/WebCarServicesCard";
import WebEmployees from "./containers/WebsiteSetting/WebEmployees";
import WebSiteDetails from "./containers/WebsiteSetting/WebSiteDetails";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./ProtectedRoute";
import RootLayout from "./layouts/RootLayout";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import animationData from "./assets/lottieJson/car.json";
import Lottie from "./components/Lottie/Lottie";

import { auth, fireStore } from "./containers/firebase";
import { logInAction } from "./redux/actions/authActions";
import { collection, getDocs } from "firebase/firestore";
import { ADMIN, SUPER_ADMIN } from "./utils/constants";
import { useToasts } from "react-toast-notifications";
import SendNotification from "./containers/Notifications/SendNotification";
import ForgotPassWord from "./pages/Login/ForgotPassord";
import CanceledAppointments from "./containers/appointments/CanceledAppointments";
import UserEnquires from "./containers/userEnquires/UserEnquires";
import AdmicVehicleCompany from "./containers/vehicleTypes/AdmicVehicleCompany";
import AdmicVehicleModal from "./containers/vehicleTypes/AdminVehicleModal";
import AdminsRolesPermissions from "./containers/admins-management/AdminsRolesPermissions";

const errorToastOption = {
  appearance: "error",
  autoDismiss: true,
  placement: "bottom-center",
};

function App() {
  const { user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          console.log("ej");
          const superAdminsCollectionRef = collection(
            fireStore,
            "super_admins"
          );
          const adminsCollectionRef = collection(fireStore, "admins");
          const querySnapshotSuperAdmins = getDocs(superAdminsCollectionRef);
          const querySnapshotAdmins = getDocs(adminsCollectionRef);
          const res = await Promise.all([
            querySnapshotSuperAdmins,
            querySnapshotAdmins,
          ]);
          const superAdminUers = {};
          const adminUsers = {};
          res[0].forEach((doc) => {
            const data = doc.data();
            superAdminUers[data.email] = { id: doc.id, ...data };
          });
          res[1].forEach((doc) => {
            const data = doc.data();
            adminUsers[data.email] = { id: doc.id, ...data };
          });
          if (superAdminUers[user.email]) {
            dispatch(
              logInAction({
                userType: SUPER_ADMIN,
                userDetails: {
                  ...user,
                  id: superAdminUers[user.email]?.id,
                  admin_name: superAdminUers[user.email]?.admin_name,
                },
              })
            );
          } else if (adminUsers[user.email]) {
            dispatch(
              logInAction({
                userType: ADMIN,
                userDetails: {
                  ...user,
                  id: adminUsers[user.email]?.id,
                  admin_name: adminUsers[user.email]?.admin_name,
                  ...adminUsers[user.email],
                },
              })
            );
          }
          setLoading(false);
        } catch (error) {
          addToast(error.message, errorToastOption);
        }
      } else {
        setLoading(false);
      }
    });
  }, []);

  return loading ? (
    <Box sx={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <Lottie animationData={animationData} height={200} width={300} />
    </Box>
  ) : (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootLayout />
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
          path="service/service-plan"
          element={
            <ProtectedRoute permission={"service_Plan"}>
              <AdminServicePlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="service/service-list"
          element={
            <ProtectedRoute permission={"service_Plan"}>
              <AdminServiceList />
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
          path="vehicle/vehicle-model"
          element={
            <ProtectedRoute>
              <AdmicVehicleModal />
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
          path="appointment/canceled-appointments"
          element={
            <ProtectedRoute>
              <CanceledAppointments />
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
          path="admins/admins-roles-permissions"
          element={
            <ProtectedRoute onlySuperAdmin={true}>
              <AdminsRolesPermissions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/send-notification"
          element={
            <ProtectedRoute>
              <SendNotification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user-enquires"
          element={
            <ProtectedRoute>
              <UserEnquires />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="/login/:userType"
        element={
          !user.isLoggedIn || !user.userType || isEmpty(user.userDetails) ? (
            <Login />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/"
        element={
          !user.isLoggedIn || !user.userType || isEmpty(user.userDetails) ? (
            <Login />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          !user.isLoggedIn || !user.userType || isEmpty(user.userDetails) ? (
            <ForgotPassWord />
          ) : (
            <Navigate to="/dashboard" replace />
          )
        }
      />
      <Route
        path="*"
        element={
          <Box sx={{ display: "grid", placeItems: "center", height: "100vh" }}>
            <Typography variant="h4"> Page Not Found</Typography>
          </Box>
        }
      />
    </Routes>
  );
}

export default App;
