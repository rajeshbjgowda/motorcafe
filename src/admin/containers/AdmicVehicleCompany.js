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
import { FormHelperText, Grid } from "@mui/material";
import {
  getVehicleCatrgoryData,
  getVehicleCompanyData,
} from "../redux/actions/AdminVehicle";
import { useSelector, useDispatch } from "react-redux";
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
  categoryId: yup.string().required("required"),
  vehicleCompany: yup.string().required("required"),
});

const AdmicVehicleCompany = () => {
  const [open, setOpen] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);

  const [updateVehicleCompany, setUpdateVehicleCompany] = useState("");

  const [updateId, setUpdateId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const vehicleCategories = useSelector(
    (state) => state.adminVehicleReducer.vehicleCategories
  );
  const vehicalCompaniesList = useSelector(
    (state) => state.adminVehicleReducer.vehicalCompaniesList
  );
  const vehicleref = collection(fireStore, "vehicle");
  const vehicleCategoryRef = collection(fireStore, "vehicle_category");

  const db = getFirestore();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setUpdateId("");
  };
  const handleOpenUpdateModal = () => {
    setOpenUpdateModal(true);
  };
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  useEffect(() => {
    // getVehicleCategories()
    dispatch(getVehicleCatrgoryData());
    dispatch(getVehicleCompanyData());
  }, []);
  const addCompanyList = async (data) => {
    const { vehicleCompany, categoryId } = data;
    if (updateId) {
      const docRef = doc(db, "vehicle", updateId);
      let updatedata = {
        company_name: vehicleCompany,
        category_id: categoryId,
      };

      await updateDoc(docRef, updatedata)
        .then((docRef) => {
          console.log("Value of an Existing Document Field has been updated");
        })
        .catch((error) => {
          console.log(error);
        });

      handleCloseUpdateModal();
    } else {
      let vehicleCompanyDetails = {
        company_name: vehicleCompany,
        category_id: categoryId,
      };
      addDoc(vehicleref, vehicleCompanyDetails);

      console.log("adding fucntion");
    }
    dispatch(getVehicleCompanyData());
    handleClose();
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, "vehicle", id.toString());
    deleteDoc(docRef);
    dispatch(getVehicleCompanyData());
  };

  const handleUpdate = (id) => {
    setUpdateId(id);
    handleOpen();
    // const res = await db.collection("vehicle").doc(id).set(data);
  };

  console.log(vehicleCategories);
  return (
    <div className="serviceplanContainer">
      <h1>VEHICAL COMPANIES</h1>
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
                  Vehical company
                </StyledTableCell>
                <StyledTableCell align="center">Edit</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicalCompaniesList &&
                vehicalCompaniesList.map((company, index) => (
                  <StyledTableRow key={company.id}>
                    <StyledTableCell align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {company.company_name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        onClick={() => handleUpdate(company.id)}
                        variant="contained"
                      >
                        Edit
                      </Button>
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(company.id)}
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
              <h3>CREATE VEHICLE COMPANY</h3>
            </div>
            <form onSubmit={handleSubmit(addCompanyList)}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <div className="planFeildContainer">
                    <TextField
                      id="outlined-basic"
                      label="Vehicle Company"
                      variant="outlined"
                      fullWidth
                      {...register("vehicleCompany")}
                      error={errors.vehicleCompany}
                      helperText={errors.vehicleCompany?.message}
                    />
                  </div>
                </Grid>
                <Grid item xs={8}>
                  <div>
                    <FormControl fullWidth error={errors.categoryId}>
                      <InputLabel id="demo-simple-select-label">
                        Company
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Category"
                        {...register("categoryId")}
                      >
                        {Object.keys(vehicleCategories).map((item, index) => {
                          console.log(vehicleCategories[item]);
                          return (
                            <MenuItem key={item} value={item}>
                              {vehicleCategories[item].vehicle_type}
                            </MenuItem>
                          );
                        })}
                      </Select>
                      {errors.categoryId && (
                        <FormHelperText>
                          {errors.categoryId?.message}
                        </FormHelperText>
                      )}
                    </FormControl>
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

export default AdmicVehicleCompany;
