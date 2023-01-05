import { Navigate } from "react-router-dom";
import { app, auth } from "../containers/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore/lite";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedUser } from "../redux/actions/loginCredentail";

export const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState({});
  const dispath = useDispatch();
  const db = getFirestore(app);
  const users = useSelector((state) => state.authUserReducer.user);
  let role = "admin";
  const getUserData = async (uid) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    console.log("rajesg", docSnap.data());

    dispath(
      getLoggedUser({ ...docSnap.data(), id: uid, role: "normal_admin" })
    );
  };
  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      console.log("authentication", currentUser);
      if (currentUser) {
        console.log("user", currentUser);
        setUser(currentUser);
        getUserData(currentUser.uid);
      }
    });
  }, []);

  console.log("protected", user, !user, users);
  if (user && role === "admin") {
    return children;
  }

  return <Navigate to="/" />;
};
