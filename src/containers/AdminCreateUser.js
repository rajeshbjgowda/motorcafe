import React from "react";
import "./styles/adminCreateUser.scss";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useForm } from "react-hook-form";
import { app } from "./firebase";
import { getFirestore } from "firebase/firestore";

const schema = yup.object().shape({
  email: yup.string().email().required("reqired"),
  password: yup
    .string()
    .required("reqired")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  name: yup.string().required("reqired"),
  role: yup.string().required("reqired"),
  phoneNumber: yup
    .string()
    .required("reqired")
    .max(10, "enter correct ohone number"),
});

const CreateAdmin = () => {
  const db = getFirestore(app);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const createUser = async (data) => {};

  return (
    <div>
      <h1>CREATE ADMIN</h1>
      <form onSubmit={handleSubmit(createUser)}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              id="outlined-basic"
              label="email"
              variant="outlined"
              fullWidth
              error={errors.email}
              type="text"
              helperText={errors.email && errors.email?.message}
              {...register("email")}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="outlined-basic"
              label="Enter Name "
              variant="outlined"
              fullWidth
              type="text"
              error={errors.name}
              helperText={errors.name && errors.name?.message}
              {...register("name")}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="outlined-basic"
              label="Enter Mobile Number"
              variant="outlined"
              fullWidth
              type="text"
              error={errors.phoneNumber}
              helperText={errors.phoneNumber && errors.phoneNumber?.message}
              {...register("phoneNumber")}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="outlined-basic"
              label="Enter Password"
              variant="outlined"
              fullWidth
              type="text"
              error={errors.password}
              helperText={errors.password && errors.password?.message}
              {...register("password")}
            />
          </Grid>
        </Grid>

        <div className="btnContainer">
          <Button variant="contained" color="primary" type="submit">
            create admin
          </Button>
          <Button variant="contained" color="warning">
            reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdmin;
