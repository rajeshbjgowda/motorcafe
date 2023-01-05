import React, { useEffect, useState } from "react";
import "../styles/adminServicePlan.scss";
import { styled } from "@mui/material/styles";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

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
import { useDispatch, useSelector } from "react-redux";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/mui-components/TableComponents";
import { getAppointmentsData } from "../../redux/actions/appointments";
import { getUsersData } from "../../redux/actions/users";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { async } from "@firebase/util";
import { doc, getFirestore, updateDoc } from "firebase/firestore/lite";
import { app } from "../firebase";
import { getServicePlanPriceData } from "../../redux/actions/serviceplanprice";

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

const AdminAppointments = () => {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState([]);

  const dispatch = useDispatch();

  const appointments = useSelector(
    (state) => state.appointmenteducer.appointments
  );
  const users = useSelector((state) => state.userReducer.users);
  const services = useSelector(
    (state) => state.servicePlanPriceReducer.service_plans_prices
  );

  useEffect(() => {
    dispatch(getAppointmentsData());
    dispatch(getUsersData());
    dispatch(getServicePlanPriceData());
  }, []);
  const db = getFirestore(app);

  const handleCLose = () => {
    setOpen(false);
  };

  const handleOpen = (service) => {
    console.log(services, service[0]);
    console.log();

    setModalData(service);
    setOpen(true);
  };
  const handleSetAppointmentStatus = async (e, id) => {
    console.log(e.target.value);
    console.log(id);
    const docRef = doc(db, "appointments", id);
    await updateDoc(docRef, {
      status: e.target.value,
    });
    dispatch(getAppointmentsData());
  };

  return (
    <div className="serviceplanContainer">
      <h1>ALL PAYMENTS </h1>

      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table
            aria-label="customized table"
            sx={{ minWidth: 750, overflowX: "scroll" }}
            id="table-to-xls"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sl.No</StyledTableCell>

                <StyledTableCell align="center">User ID</StyledTableCell>
                <StyledTableCell align="center">Appointment Id</StyledTableCell>
                <StyledTableCell align="center">
                  {" "}
                  optional service
                </StyledTableCell>

                <StyledTableCell align="center"> services</StyledTableCell>
                <StyledTableCell align="center"> vehicle id</StyledTableCell>
                <StyledTableCell align="center">payment id</StyledTableCell>
                <StyledTableCell align="center">payment status</StyledTableCell>
                <StyledTableCell align="center">service type</StyledTableCell>
                <StyledTableCell align="center"> adress</StyledTableCell>
                <StyledTableCell align="center"> status</StyledTableCell>

                <StyledTableCell align="center">accept</StyledTableCell>
                <StyledTableCell align="center">cancel</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments &&
                appointments.map((user, index) => (
                  <StyledTableRow key={user.id}>
                    <StyledTableCell align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {user.user_id}
                    </StyledTableCell>
                    <StyledTableCell align="center">{user.id}</StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      {user.optional_service}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => handleOpen(user.service_ids)}
                      >
                        se services
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {user.vehicle_index}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {user.payments_details?.payment_id}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {user.payments_details?.payment_status}
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      {user.service_type}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {user.address_index}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={user.status}
                          label="status"
                          onChange={(e) =>
                            handleSetAppointmentStatus(e, user.id)
                          }
                        >
                          <MenuItem value={"Booked"}>booked</MenuItem>
                          <MenuItem value={"success"}>sucess</MenuItem>
                          <MenuItem value={"reject"}>reject</MenuItem>
                        </Select>
                      </FormControl>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button variant="contained">accept</Button>
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      <Button variant="contained" color="error">
                        cancel
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button"
        table="table-to-xls"
        filename="tablexls"
        sheet="tablexls"
        buttonText="Download as XLS"
      />

      <Modal
        open={open}
        onClose={handleCLose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="tableContainer">
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Sl.No</StyledTableCell>
                  <StyledTableCell align="center">Service </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {modalData &&
                  Object.keys(services).map((planId, index) => {
                    if (modalData.indexOf(services[planId].id) >= 0) {
                      return (
                        <StyledTableRow key={planId}>
                          <StyledTableCell align="center">
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {services[planId].service_name}
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    }
                  })}
              </TableBody>
            </Table>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminAppointments;
