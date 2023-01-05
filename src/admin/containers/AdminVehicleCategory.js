import React, { useEffect, useState } from "react";
import "./styles/adminServicePlan.scss";
import { styled } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import {
  StyledTableCell,
  StyledTableRow,
} from "../components/mui-components/TableComponents";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import moment from "moment/moment";
import { fireStore, storage } from "./firebase";

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore/lite";
import { async } from "@firebase/util";
import { DockTwoTone } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getVehicleCatrgoryData } from "../redux/actions/AdminVehicle";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const schema = yup.object().shape({
  vehicle_category: yup.string().required("required"),
});
const AdmicVehicleCategory = () => {
  const [open, setOpen] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);

  const [updateId, setUpdateId] = useState("");

  // const [vehicleCategories, setVehicleCategories] = useState([]);
  const dispatch = useDispatch();

  const vehicleCategories = useSelector(
    (state) => state.adminVehicleReducer.vehicleCategories
  );

  const vehicleCategoryRef = collection(fireStore, "vehicle_category");

  const db = getFirestore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setUpdateId("");
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  useEffect(() => {
    dispatch(getVehicleCatrgoryData());
  }, []);
  const addCompanyList = async (data) => {
    const { vehicle_category } = data;
    if (updateId) {
      const docRef = doc(db, "vehicle_category", updateId);
      let data = {
        vehicle_type: vehicle_category,
      };

      await updateDoc(docRef, data)
        .then((docRef) => {
          console.log("Value of an Existing Document Field has been updated");
        })
        .catch((error) => {
          console.log(error);
        });

      handleCloseUpdateModal();
    } else {
      let vehicleCompanyDetails = {
        vehicle_type: vehicle_category,
      };
      addDoc(vehicleCategoryRef, vehicleCompanyDetails);

      console.log("adding fucntion");
    }

    dispatch(getVehicleCatrgoryData());
    handleClose();
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, "vehicle_category", id.toString());
    deleteDoc(docRef);
    dispatch(getVehicleCatrgoryData());
  };

  const handleUpdate = (id) => {
    setUpdateId(id);
    handleOpen();
    // const res = await db.collection("vehicle").doc(id).set(data);
    dispatch(getVehicleCatrgoryData());
  };

  console.log("rajesh", vehicleCategories);
  return (
    <div className="serviceplanContainer">
      <h1>VEHICAL CATEGORIES</h1>
      <div>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          create
        </Button>
      </div>
      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table
            aria-label="customized table"
            sx={{ minWidth: 650, overflowX: "scroll" }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sl.No</StyledTableCell>

                <StyledTableCell align="center">
                  Vehical Category
                </StyledTableCell>
                <StyledTableCell align="center">Edit</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicleCategories &&
                Object.keys(vehicleCategories).map((item, index) => (
                  <StyledTableRow key={item}>
                    <StyledTableCell align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {vehicleCategories[item].vehicle_type}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        onClick={() => handleUpdate(item)}
                        variant="contained"
                      >
                        Edit
                      </Button>
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(item)}
                      >
                        delete
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="addPlanContainer">
            <div className="heading">
              <h3>CREATE VEHICLE CATEGORY</h3>
            </div>
            <form onSubmit={handleSubmit(addCompanyList)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <div className="planFeildContainer">
                    <TextField
                      id="outlined-basic"
                      label="Vehicle Category"
                      variant="outlined"
                      fullWidth
                      {...register("vehicle_category")}
                    />
                  </div>
                </Grid>
              </Grid>

              <div className="btnContainer">
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleClose}
                >
                  cancel
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  {updateId ? "update" : "add"}
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdmicVehicleCategory;
