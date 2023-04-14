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
import ForgotPassWord from "./ForgotPassord";

const theme = createTheme();

const errorToastOption = {
  appearance: "error",
  autoDismiss: true,
  placement: "bottom-center",
};

export default function Login() {
  const params = useParams();
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const userType = React.useMemo(() => params.userType, [params.userType]);

  React.useEffect(() => {
    if (
      params.userType !== USER_TYPES["super-admin"].value &&
      params.userType !== USER_TYPES["admin"].value
    ) {
      navigate("/404");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");
    const collectionRef = collection(
      fireStore,
      USER_TYPES[userType].collection
    );
    const querySnapshot = await getDocs(collectionRef);
    const users = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users[data.email] = { id: doc.id, ...data };
    });

    setPersistence(auth, browserSessionPersistence)
      .then(async () => {
        try {
          switch (userType) {
            case USER_TYPES["super-admin"].value:
              if (users[email]) {
                const user = await signInWithEmailAndPassword(
                  auth,
                  email,
                  password
                );
                dispatch(
                  logInAction({
                    userType: SUPER_ADMIN,
                    userDetails: { ...user.user, id: users[email] },
                  })
                );
              } else {
                addToast("User Does Not Exits", errorToastOption);
              }
              setLoading(false);
              return;
            case USER_TYPES["admin"].value:
              if (users[email]) {
                const user = await signInWithEmailAndPassword(
                  auth,
                  email,
                  password
                );
                dispatch(
                  logInAction({
                    userType: ADMIN,
                    userDetails: { ...user.user, id: users[email] },
                  })
                );
              } else {
                addToast("User Does Not Exits", errorToastOption);
              }
              setLoading(false);
              return;
            default:
              break;
          }
        } catch (error) {
          setLoading(false);
          addToast(error.message, errorToastOption);
        }
      })
      .catch((error) => {
        setLoading(false);
        addToast(error.message, errorToastOption);
      });
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
            {USER_TYPES[params.userType].label} Login In
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
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
              <div className="login-footer">
                <a href="/login/admin" className="login-paragraph">
                  Login As Admin
                </a>
                <a href="/forgot-password" className="login-paragraph">
                  Forgot PassWord
                </a>
              </div>
            ) : (
              <div className="login-footer">
                <a href="/login/super-admin" className="login-paragraph">
                  Login As Super Admin
                </a>
                <a href="/forgot-password" className="login-paragraph">
                  Forgot PassWord
                </a>
              </div>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
