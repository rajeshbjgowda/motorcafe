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
import { getAdminListData } from "../../redux/actions/AdminsList";
import { Checkbox, FormGroup, FormLabel } from "@mui/material";

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
const AdminsRolesPermissions = () => {
  const [open, setOpen] = React.useState(false);
  const [disable, setDisable] = React.useState(false);

  const [companyName, setCompanyName] = React.useState("");
  const [vehicleCompany, setVehicleCompany] = useState("");
  const [vehicalModelList, setVehicalModelList] = useState([]);
  const [modelData, setModelData] = useState({});
  const [rolesPermissions, setRolesPermissions] = useState({
    hasPermission: false,
    disable: false,
    service_Plan: false,
  });
  const vehicleCompanyRef = collection(fireStore, "vehicle_company");

  const { loading, error, adminsList } = useSelector(
    (state) => state.adminListReducer
  );

  const dispatch = useDispatch();
  const handleChange = (event) => {
    setRolesPermissions({
      ...rolesPermissions,
      [event.target.name]: event.target.checked,
    });
  };

  useEffect(() => {
    dispatch(getAdminListData());
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateRolesPermission = async (e) => {
    e.preventDefault();
    setDisable(true);
    if (modelData.id) {
      const docRef = doc(fireStore, "admins", modelData.id);
      let data = {
        ...rolesPermissions,
      };

      await updateDoc(docRef, data)
        .then((docRef) => {
          console.log("Value of an Existing Document Field has been updated");
        })
        .catch((error) => {
          console.log(error);
        });
      setDisable(false);
    }
    handleClose();
    dispatch(getAdminListData());
    setModelData("");
  };

  const handleUpdate = (admin) => {
    setRolesPermissions({
      hasPermission: admin.hasPermission,
      disable: admin.disable,
      service_Plan: admin.service_Plan,
    });
    setModelData(admin);

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
  console.log("vehicleCompanies", adminsList, loading, error);

  return (
    <div className="serviceplanContainer">
      <h1>ADMIN LIST</h1>

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
      ) : error && adminsList.length === 0 ? (
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

                  <StyledTableCell align="center">Name</StyledTableCell>

                  <StyledTableCell align="center">Email</StyledTableCell>
                  <StyledTableCell align="center">Disable</StyledTableCell>
                  <StyledTableCell align="center">Permmision</StyledTableCell>
                  {/* <StyledTableCell align="center">Delete</StyledTableCell> */}
                  <StyledTableCell align="center">edit</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminsList &&
                  adminsList.map((admin, index) => (
                    <StyledTableRow key={admin.id}>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {admin.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {admin.email}
                      </StyledTableCell>{" "}
                      <StyledTableCell align="center">
                        {admin.disable ? "true" : "false"}
                      </StyledTableCell>{" "}
                      <StyledTableCell align="center">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={admin.hasPermission ? true : false}
                              onChange={(e) => handleActiveState(e, admin.id)}
                              name="vehicle_cmpany_state"
                            />
                          }
                          label={admin.hasPermission ? "active" : "deactive"}
                        />
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        onClick={() => handleUpdate(admin)}
                      >
                        <Button variant="contained">Edit</Button>
                      </StyledTableCell>{" "}
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
              <h3>UPDATE ADMIN ROLES AND PERMISSIONS</h3>
            </div>

            <form onSubmit={handleUpdateRolesPermission}>
              <FormControl
                sx={{ m: 3 }}
                component="fieldset"
                variant="standard"
              >
                <FormLabel component="legend">Roles And Permissions</FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rolesPermissions.disable}
                        onChange={handleChange}
                        name="disable"
                      />
                    }
                    label="Disable the Admin"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rolesPermissions.hasPermission}
                        onChange={handleChange}
                        name="hasPermission"
                      />
                    }
                    label="Admin Permission"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rolesPermissions.service_Plan}
                        onChange={handleChange}
                        name="service_Plan"
                      />
                    }
                    label="Service plan permission"
                  />
                </FormGroup>
              </FormControl>
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
                  disabled={disable}
                  type="submit"
                >
                  Update
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminsRolesPermissions;
