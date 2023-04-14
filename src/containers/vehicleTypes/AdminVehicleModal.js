import React, { useEffect, useState } from "react";
import "../styles/adminVehicleModal.scss";
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { PunchClock } from "@mui/icons-material";
import { fireStore } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { async } from "@firebase/util";
import { useDispatch, useSelector } from "react-redux";
import { StyledTableCell } from "../../components/mui-components/TableComponents";
import { getVehicleCompanyData } from "../../redux/actions/AdminVehicleCompany";
import Grid from "@mui/material/Grid";
import { getVehicleModalData } from "../../redux/actions/AdminVehicleModal";

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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const AdmicVehicleModal = () => {
  const [open, setOpen] = React.useState(false);
  const [disable, setDisable] = React.useState(false);

  const [companyName, setCompanyName] = React.useState("");

  const [vehicleModal, setVehicleModal] = useState("");
  const [variant, setVariant] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const [modelUpdateId, setModelUpdateId] = useState("");
  const vehicleModalRef = collection(fireStore, "vehicleModel");

  const { vehicleCompanies } = useSelector(
    (state) => state.adminVehicleCompanyReducer
  );
  const { vehicleModals, loading, error } = useSelector(
    (state) => state.adminVehicleModal
  );

  const dispatch = useDispatch();
  const handleChange = (event) => {
    setCompanyName(event.target.value);
  };

  useEffect(() => {
    dispatch(getVehicleCompanyData());
    dispatch(getVehicleModalData());
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddModel = async (e) => {
    console.log("submitting");
    e.preventDefault();
    console.log("submitting1");

    setDisable(true);
    if (modelUpdateId) {
      const docRef = doc(fireStore, "vehicleModel", modelUpdateId);
      let data = {
        updatedAt: new Date().toUTCString(),
        company_name: vehicleModal,
      };

      await updateDoc(docRef, data)
        .then((docRef) => {
          console.log("Value of an Existing Document Field has been updated");
        })
        .catch((error) => {
          console.log(error);
        });
      setDisable(false);
    } else {
      const Details = {
        created_at: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        company_name: companyName,
        fuel_type: fuelType,
        variant: variant,
        vehicle_modal: vehicleModal,
        vehicle_type: vehicleType,
      };

      try {
        await addDoc(vehicleModalRef, Details);
        console.log("modal", Details);
      } catch (error) {
        console.log(error);
      }
      setDisable(false);
    }
    handleClose();
    dispatch(getVehicleCompanyData());
    dispatch(getVehicleModalData());
    setModelUpdateId("");
  };

  const handleUpdate = (company) => {
    setModelUpdateId(company.id);
    // setVehicleCompany(company.company_name);
    handleOpen();
  };
  const handleDelete = async (id) => {
    // const docRef = doc(fireStore, "vehicleModel", id.toString());
    // try {
    //   await deleteDoc(docRef);
    //   dispatch(getVehicleCompanyData());
    // } catch (err) {
    //   //
    // }
  };

  const handleActiveState = async (e, id) => {
    const modalRef = await doc(fireStore, "vehicleModel", id.toString());
    console.log("modal", e.target.checked, vehicleModals[0]);
    let data = {
      isActive: e.target.checked,
    };
    await updateDoc(modalRef, data);
    await dispatch(getVehicleModalData());
  };

  console.log("vehicleCompanies", vehicleModals, loading, error);

  let companies = {};
  vehicleCompanies.forEach((item) => {
    companies = { ...companies, [item.id]: { ...item } };
  });

  console.log("modal", vehicleModals);
  return (
    <div className="serviceplanContainer">
      <h1>VEHICAL COMPANIES</h1>
      <div>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          create
        </Button>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <CircularProgress style={{ height: 80, width: 80 }} />
        </div>
      ) : (
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
                  <StyledTableCell align="center">Modal Name</StyledTableCell>
                  <StyledTableCell align="center">Variant</StyledTableCell>
                  <StyledTableCell align="center">Fuel Type</StyledTableCell>
                  <StyledTableCell align="center">Vehicle Type</StyledTableCell>
                  <StyledTableCell align="center">Created AT</StyledTableCell>
                  <StyledTableCell align="center">UpdatedAt</StyledTableCell>
                  <StyledTableCell align="center">Edit</StyledTableCell>
                  {/* <StyledTableCell align="center">Delete</StyledTableCell> */}
                  <StyledTableCell align="center">state</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicleModals &&
                  vehicleModals.map((modal, index) => (
                    <StyledTableRow key={modal.id}>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {companies[modal.company_name].company_name}
                        {/* {company.company_name} */}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {modal.vehicle_modal}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {modal.variant}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {modal.fuel_type}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {modal.vehicle_type}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {modal.created_at}
                      </StyledTableCell>{" "}
                      <StyledTableCell align="center">
                        {modal.updatedAt}
                      </StyledTableCell>{" "}
                      <StyledTableCell
                        align="center"
                        onClick={() => handleUpdate(modal)}
                      >
                        <Button variant="contained">Edit</Button>
                      </StyledTableCell>{" "}
                      {/* <StyledTableCell align="center">
                        <Button
                          onClick={() => handleDelete(company.id)}
                          variant="contained"
                          color="error"
                        >
                          delete
                        </Button>
                      </StyledTableCell> */}
                      <StyledTableCell align="center">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={modal.isActive ? true : false}
                              onChange={(e) => handleActiveState(e, modal.id)}
                              name="vehicle_cmpany_state"
                            />
                          }
                          label={modal.isActive ? "active" : "deactive"}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="addPlanContainer">
            <div className="heading">
              <h3>CREATE VEHICLE MODAL</h3>
            </div>

            <form onSubmit={handleAddModel}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Company Name
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={companyName}
                      label="Company Name"
                      onChange={(e) => setCompanyName(e.target.value)}
                    >
                      {vehicleCompanies &&
                        vehicleCompanies.map((company) => (
                          <MenuItem key={company.id} value={company.id}>
                            {company.company_name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <div className="planFeildContainer">
                    <div>
                      <TextField
                        id="outlined-basic"
                        label="Enter Vehicle Modal"
                        variant="outlined"
                        fullWidth
                        required
                        value={vehicleModal}
                        onChange={(e) => setVehicleModal(e.target.value)}
                      />
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <div className="planFeildContainer">
                    <div>
                      <TextField
                        id="outlined-basic"
                        label="Enter Modal variant"
                        variant="outlined"
                        fullWidth
                        required
                        value={variant}
                        onChange={(e) => setVariant(e.target.value)}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Fuel Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={fuelType}
                      label="Fuel Type"
                      onChange={(e) => setFuelType(e.target.value)}
                    >
                      <MenuItem value={"diesel"}>Diesel</MenuItem>
                      <MenuItem value={"petrol"}>Petrol</MenuItem>
                      <MenuItem value={"CNG"}>CNG</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Vehicle Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={vehicleType}
                      label="Fuel Type"
                      onChange={(e) => setVehicleType(e.target.value)}
                    >
                      <MenuItem value={"car"}>Car</MenuItem>
                      <MenuItem value={"bike"}>Bike</MenuItem>
                    </Select>
                  </FormControl>
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
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={disable}
                >
                  add model{" "}
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdmicVehicleModal;
