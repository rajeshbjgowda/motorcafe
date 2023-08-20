import React from "react";
import "./styles/adminAllUsers.scss";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import axios from "axios";
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import { app } from "./firebase";


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

const allUsers = [
  {
    id: Math.random() * 100,
    serialNo: 1,
    name: "jhon",
    email: "jhon@gmail.com",
    gender: "male",
    dob: "11-2-1999",
    mobile: "9108115088",
    address: "uk london",
    role: "subscriber",
    createdAt: "4yr ago",
    updatedAt: "4yr ago",
  },
];

const AdminAllUsers = () => {
  const functions = getFunctions(app, "us-central1");
  const alive = httpsCallable(functions, "fetchMultipleRefundsByPaymentId");
  connectFunctionsEmulator(functions, "localhost", 5001);
  const handleCLick = () => {
    alive({ text: "messageText" })
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;
        const sanitizedMessage = data.text;
      })
      .catch((Err) => {
        console.log(Err);
      });
    // axios
    //   .get("https://us-central1-motorcafe-7ba65.cloudfunctions.net/alive")
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
  return (
    <div className="container">
      <h1> All Users</h1>

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
                <StyledTableCell align="center">Gender</StyledTableCell>
                <StyledTableCell align="center">DOB</StyledTableCell>
                <StyledTableCell align="center">Mobile</StyledTableCell>
                <StyledTableCell align="center">Address</StyledTableCell>
                <StyledTableCell align="center">Role</StyledTableCell>
                <StyledTableCell align="center">Created AT</StyledTableCell>
                <StyledTableCell align="center">UpdatedAt</StyledTableCell>
                <StyledTableCell align="center">Edit</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allUsers.map((user) => (
                <StyledTableRow key={user.id}>
                  <StyledTableCell align="center">
                    {user.serialNo}
                  </StyledTableCell>
                  <StyledTableCell align="center">{user.name}</StyledTableCell>
                  <StyledTableCell align="center">
                    {user.email}
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    {user.gender}
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">{user.dob}</StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    {user.mobile}
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    {user.address}
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">{user.role}</StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    {user.createdAt}
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    {user.updatedAt}
                  </StyledTableCell>{" "}
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

        <button onClick={() => handleCLick()}>hshs</button>
      </div>
    </div>
  );
};

export default AdminAllUsers;
