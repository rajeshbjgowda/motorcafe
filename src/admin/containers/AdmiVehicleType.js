import React, { useEffect, useState } from "react";
import "./styles/adminServicePlan.scss";
import { styled } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { PunchClock } from "@mui/icons-material";
import { fireStore } from "./firebase";

import { useSelector, useDispatch } from "react-redux";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore/lite";
import { getVehicleTypeData } from "../redux/actions/AdminVehicle";
import {
  StyledTableCell,
  StyledTableRow,
} from "../components/mui-components/TableComponents";
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
  vehicleType: yup.string().required("required"),
});

const AdmiVehicleType = () => {
  const [open, setOpen] = React.useState(false);
  const [modelUpdateId, setModelUpdateId] = useState("");
  const vehicleTypesRef = collection(fireStore, "vehicle_type");

  const dispatch = useDispatch();
  const vehicalTypeList = useSelector(
    (state) => state.adminVehicleReducer.vehicalTypeList
  );
  const db = getFirestore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    dispatch(getVehicleTypeData());
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddType = async (data) => {
    const { vehicleType } = data;

    if (modelUpdateId) {
      const docRef = doc(db, "vehicle_type", modelUpdateId);
      let data = {
        type: vehicleType,

        updated_at: new Date().toUTCString(),
      };

      await updateDoc(docRef, data)
        .then((docRef) => {
          console.log("Value of an Existing Document Field has been updated");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const Details = {
        type: vehicleType,
        created_at: new Date().toUTCString(),
        updated_at: new Date().toUTCString(),
      };

      try {
        await addDoc(vehicleTypesRef, Details);
      } catch (error) {
        console.log(error);
      }
    }
    handleClose();
    dispatch(getVehicleTypeData());
    setModelUpdateId("");
  };

  const handleUpdate = (id) => {
    setModelUpdateId(id);
    dispatch(getVehicleTypeData());
    handleOpen();
  };
  const handleDelete = async (id) => {
    const docRef = doc(db, "vehicle_type", id.toString());
    deleteDoc(docRef);
    dispatch(getVehicleTypeData());
  };

  return (
    <div className="serviceplanContainer">
      <h1>VEHICAL TYPES </h1>
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
                <StyledTableCell align="center">Vehical Type</StyledTableCell>
                <StyledTableCell align="center">Created AT</StyledTableCell>
                <StyledTableCell align="center">UpdatedAt</StyledTableCell>
                <StyledTableCell align="center">Edit</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicalTypeList.map((vehicle, index) => (
                <StyledTableRow key={vehicle.id}>
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell align="center">
                    {vehicle.type}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {vehicle.created_at}
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    {vehicle.updated_at}
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      onClick={() => handleUpdate(vehicle.id)}
                    >
                      Edit
                    </Button>
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(vehicle.id)}
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
              <h3>CREATE VEHICLE TYPE</h3>
            </div>
            <form onSubmit={handleSubmit(handleAddType)}>
              <div className="planFeildContainer">
                <TextField
                  id="outlined-basic"
                  label="Enter Vehicle Type"
                  variant="outlined"
                  fullWidth
                  {...register("vehicleType")}
                  error={errors.vehicleType}
                  helperText={errors.vehicleType?.message}
                />
              </div>
              <div className="btnContainer">
                <Button variant="contained" color="warning">
                  reset
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  add plan{" "}
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdmiVehicleType;
