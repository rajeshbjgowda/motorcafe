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
import moment from "moment/moment";
import { fireStore } from "./firebase";
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
const AdmicVehicleCompany = () => {
  const [open, setOpen] = React.useState(false);
  const [openUpdateModal, setOpenUpdateModal] = React.useState(false);

  const [vehicleCompany, setVehicleCompany] = useState("");
  const [updateVehicleCompany, setUpdateVehicleCompany] = useState("");

  const [vehicalCompaniesList, setVehicalCompaniesList] = useState([]);
  const [updateId, setUpdateId] = useState("");

  const vehicleref = collection(fireStore, "vehicle");
  const db = getFirestore();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenUpdateModal = () => {
    setOpenUpdateModal(true);
  };
  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
  };

  let getData = async () => {
    console.log("effect");
    let details = await getDocs(vehicleref);

    let vechicleCompanies = [];
    details.docs.forEach((doc) => {
      // console.log();
      // console.log(doc.id, doc.data());
      vechicleCompanies = [...vechicleCompanies, { id: doc.id, ...doc.data() }];
    });
    setVehicalCompaniesList([...vechicleCompanies]);
  };
  useEffect(() => {
    getData();

    return () => {
      setVehicalCompaniesList([]);
    };
  }, []);
  const addCompanyList = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDay();

    let vehicleCompanyDetails = {
      company_name: vehicleCompany,
      created_at: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    };
    addDoc(vehicleref, vehicleCompanyDetails);

    getData();
    handleClose();

    console.log("adding fucntion");
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, "vehicle", id.toString());
    deleteDoc(docRef);
    getData();
  };

  const handleUpdate = (id) => {
    handleOpenUpdateModal();
    setUpdateId(id);
    // const res = await db.collection("vehicle").doc(id).set(data);
  };

  const updateDocumnet = async () => {
    const docRef = doc(db, "vehicle", updateId);
    let data = {
      company_name: updateVehicleCompany,
      updatedAt: new Date().toUTCString(),
    };

    await updateDoc(docRef, data)
      .then((docRef) => {
        console.log("Value of an Existing Document Field has been updated");
      })
      .catch((error) => {
        console.log(error);
      });
    getData();
    handleCloseUpdateModal();
  };
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
                <StyledTableCell align="center">Created AT</StyledTableCell>
                <StyledTableCell align="center">UpdatedAt</StyledTableCell>
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
                      {company.created_at}
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      {company.updatedAt}
                    </StyledTableCell>{" "}
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
            <div className="planFeildContainer">
              <TextField
                id="outlined-basic"
                label="Vehicle Company"
                variant="outlined"
                fullWidth
                onChange={(e) => setVehicleCompany(e.target.value)}
              />
            </div>
            <div className="btnContainer">
              <Button variant="contained" color="warning" onClick={handleClose}>
                cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={addCompanyList}
              >
                add{" "}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="addPlanContainer">
            <div className="heading">
              <h3>UPDATE VEHICLE COMPANY</h3>
            </div>
            <div className="planFeildContainer">
              <TextField
                id="outlined-basic"
                label="Vehicle Company"
                variant="outlined"
                fullWidth
                onChange={(e) => setUpdateVehicleCompany(e.target.value)}
              />
            </div>
            <div className="btnContainer">
              <Button
                variant="contained"
                color="warning"
                onClick={handleCloseUpdateModal}
              >
                cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={updateDocumnet}
              >
                add{" "}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdmicVehicleCompany;
