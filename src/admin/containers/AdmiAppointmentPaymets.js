import React, { useState } from "react";
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d9edf7 ",
    fontWeight: "700",
    padding: "15px 10px",
    "&.MuiTableCell-head": {
      minWidth: "100px",
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const AdmiAppointmentPaymets = () => {
  const [open, setOpen] = React.useState(false);

  const [paymentList, setPaymentList] = useState([
    {
      id: Math.random() * 100,
      serialNo: 1,
      appointMentId: 1,
      user: "jhon",
      price: "TATA",
      discount: "PunchClock",
      advance: "4yr ago",
      paymentMethod: "4yr ago",
      remark: "-",
    },
  ]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="serviceplanContainer">
      <h1>ALL PAYMENTS </h1>

      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table
            aria-label="customized table"
            sx={{ minWidth: 650, overflowX: "scroll" }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sl.No</StyledTableCell>

                <StyledTableCell align="center">User</StyledTableCell>
                <StyledTableCell align="center">Appointment Id</StyledTableCell>
                <StyledTableCell align="center">Price</StyledTableCell>
                <StyledTableCell align="center">discount</StyledTableCell>
                <StyledTableCell align="center">advance</StyledTableCell>
                <StyledTableCell align="center">Payment Method</StyledTableCell>
                <StyledTableCell align="center">Remarks</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentList.map((user) => (
                <StyledTableRow key={user.id}>
                  <StyledTableCell align="center">
                    {user.serialNo}
                  </StyledTableCell>
                  <StyledTableCell align="center">{user.user}</StyledTableCell>
                  <StyledTableCell align="center">
                    {user.appointMentId}
                  </StyledTableCell>
                  <StyledTableCell align="center">{user.price}</StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    {user.discount}
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    {user.advance}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {user.paymentMethod}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {user.remark}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button variant="contained">Edit</Button>
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    <Button variant="contained" color="error">
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
              <h3>CREATE WASHING PLAN</h3>
            </div>
            <div className="planFeildContainer">
              <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
                fullWidth
              />
            </div>
            <div className="btnContainer">
              <Button variant="contained" color="warning">
                reset
              </Button>
              <Button variant="contained" color="primary">
                add plan{" "}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdmiAppointmentPaymets;
