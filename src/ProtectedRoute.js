import { isEmpty } from "lodash";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ADMIN } from "./utils/constants";

const ProtectedRoute = (props) => {
  const { user } = useSelector((state) => state);
  console.log("user.userType", user.userType);
  const { children } = props;
  if (props.onlySuperAdmin) {
    if (user.userType === "super-admin") {
      return <>{children}</>;
    } else {
      return <Navigate to={`/`} />;
    }
  } else {
    if (user.isLoggedIn && user.userType && !isEmpty(user.userDetails)) {
      if (props.permission) {
        if (
          (user.userDetails[props.permission] && user.userType === "admin") ||
          user.userType === "super-admin"
        ) {
          return <>{children}</>;
        } else {
          return <Navigate to={`/login/${ADMIN}`} />;
        }
      } else {
        return <>{children}</>;
      }
    } else {
      return <Navigate to={`/login/${ADMIN}`} />;
    }
  }
};

export default ProtectedRoute;
