import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Lottie from "../../components/Lottie/Lottie";
import animationData from "../../assets/lottieJson/login.json";
import { auth, fireStore } from "../../containers/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useToasts } from "react-toast-notifications";

import { logInAction } from "../../redux/actions/authActions";
import { ADMIN, SUPER_ADMIN, USER_TYPES } from "../../utils/constants";
import "./Login.scss";
import { LoadingButton } from "@mui/lab";

const theme = createTheme();

const errorToastOption = {
  appearance: "error",
  autoDismiss: true,
  placement: "bottom-center",
};

export default function ForgotPassWord() {
  const params = useParams();
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const userType = React.useMemo(() => params.userType, [params.userType]);

  React.useEffect(() => {}, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const adminRef = collection(fireStore, "admins");

    const superAdminRef = collection(fireStore, "super_admins");
    const adminSnapshot = await getDocs(adminRef);
    const superAdminSnapshot = await getDocs(superAdminRef);

    let admin = [];
    let super_admin = [];

    adminSnapshot.forEach((doc) => {
      const data = doc.data();
      admin = [...admin, data.email];
    });

    superAdminSnapshot.forEach((doc) => {
      const data = doc.data();
      super_admin = [...super_admin, data.email];
    });

    if (admin.includes(email) || super_admin.includes(email)) {
      console.log(admin, super_admin);

      sendPasswordResetEmail(auth, email)
        .then(() => {
          console.log("Password reset email sent!");
          //   addToast("User Does Not Exits", errorToastOption);
          navigate("/login/super-admin");
        })
        .catch((error) => {
          console.log("Unable to send reset password link :: " + error.message);
          addToast("Something went wrong", errorToastOption);
        });
      setLoading(false);
    } else {
      addToast("User Does Not Exits", errorToastOption);
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box>
            <Lottie animationData={animationData} height={200} width={200} />
          </Box>
          <Typography
            component="h1"
            variant="h4"
            sx={{
              m: 3,
            }}
          >
            Forgot PassWord
          </Typography>
          <Box sx={{ mt: 1 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
              />
              <LoadingButton
                loading={loading}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </LoadingButton>
            </form>
          </Box>
          <Box sx={{ width: "100%" }}>
            {userType === USER_TYPES["super-admin"].value ? (
              <a href="/login/admin" className="login-paragraph">
                Login As Admin
              </a>
            ) : (
              <a href="/login/super-admin" className="login-paragraph">
                Login As Super Admin
              </a>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
