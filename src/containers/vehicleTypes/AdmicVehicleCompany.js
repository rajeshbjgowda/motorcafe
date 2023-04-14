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
import Alert from "@mui/material/Alert";
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
const AdmicVehicleCompany = () => {
  const [open, setOpen] = React.useState(false);
  const [disable, setDisable] = React.useState(false);

  const [companyName, setCompanyName] = React.useState("");
  const [vehicleCompany, setVehicleCompany] = useState("");
  const [vehicalModelList, setVehicalModelList] = useState([]);
  const [modelUpdateId, setModelUpdateId] = useState("");
  const vehicleCompanyRef = collection(fireStore, "vehicle_company");

  const { loading, error, vehicleCompanies } = useSelector(
    (state) => state.adminVehicleCompanyReducer
  );

  const dispatch = useDispatch();
  const handleChange = (event) => {
    setCompanyName(event.target.value);
  };

  useEffect(() => {
    dispatch(getVehicleCompanyData());
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddModel = async () => {
    setDisable(true);
    if (modelUpdateId) {
      const docRef = doc(fireStore, "vehicle_company", modelUpdateId);
      let data = {
        updatedAt: new Date().toUTCString(),
        company_name: vehicleCompany,
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
        company_name: vehicleCompany,
      };

      try {
        await addDoc(vehicleCompanyRef, Details);
      } catch (error) {
        console.log(error);
      }
      setDisable(false);
    }
    handleClose();
    dispatch(getVehicleCompanyData());
    setModelUpdateId("");
  };

  const handleUpdate = (company) => {
    setModelUpdateId(company.id);
    setVehicleCompany(company.company_name);
    handleOpen();
  };
  const handleDelete = async (id) => {
    // const docRef = doc(fireStore, "vehicle_company", id.toString());
    // try {
    //   await deleteDoc(docRef);
    //   dispatch(getVehicleCompanyData());
    // } catch (err) {
    //   //
    // }
  };

  const handleActiveState = async (e, id) => {
    const cmpanyRef = doc(fireStore, "vehicle_company", id.toString());

    let data = {
      isActive: e.target.checked,
    };
    await updateDoc(cmpanyRef, data);
    dispatch(getVehicleCompanyData());
  };
  console.log("vehicleCompanies", vehicleCompanies, loading, error);

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
      ) : error && vehicleCompanies.length === 0 ? (
        <Alert severity="warning">No Data Found</Alert>
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

                  <StyledTableCell align="center">Created AT</StyledTableCell>
                  <StyledTableCell align="center">UpdatedAt</StyledTableCell>
                  <StyledTableCell align="center">Edit</StyledTableCell>
                  {/* <StyledTableCell align="center">Delete</StyledTableCell> */}
                  <StyledTableCell align="center">state</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicleCompanies &&
                  vehicleCompanies.map((company, index) => (
                    <StyledTableRow key={company.id}>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {company.company_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {company.created_at}
                      </StyledTableCell>{" "}
                      <StyledTableCell align="center">
                        {company.updatedAt}
                      </StyledTableCell>{" "}
                      <StyledTableCell
                        align="center"
                        onClick={() => handleUpdate(company)}
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
                              checked={company.isActive ? true : false}
                              onChange={(e) => handleActiveState(e, company.id)}
                              name="vehicle_cmpany_state"
                            />
                          }
                          label={company.isActive ? "active" : "deactive"}
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
              <h3>CREATE VEHICLE COMPANY</h3>
            </div>
            <div className="planFeildContainer">
              <div>
                <TextField
                  id="outlined-basic"
                  label="Company Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={vehicleCompany}
                  onChange={(e) => setVehicleCompany(e.target.value)}
                />
              </div>
            </div>
            <div className="btnContainer">
              <Button variant="contained" color="warning" onClick={handleClose}>
                cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddModel}
                disabled={disable}
              >
                add model{" "}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdmicVehicleCompany;
