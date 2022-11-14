import React, { useEffect, useState } from "react";
import "./styles/adminVehicleModal.scss";
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

import { PunchClock } from "@mui/icons-material";
import { fireStore } from "./firebase";
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
import { async } from "@firebase/util";

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
const AdmicVehicleModal = () => {
  const [open, setOpen] = React.useState(false);

  const [vehicleCompanies, setVehicleCompanies] = useState([]);
  const [companyName, setCompanyName] = React.useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicalModelList, setVehicalModelList] = useState([]);
  const [modelUpdateId, setModelUpdateId] = useState("");
  const vehicleref = collection(fireStore, "vehicle");
  const vehiclemodelref = collection(fireStore, "vehicleModel");
  const db = getFirestore();
  const handleChange = (event) => {
    setCompanyName(event.target.value);
  };

  let getData = async () => {
    console.log("effect");
    let details = await getDocs(vehicleref);

    let companies = [];
    details.docs.forEach((doc) => {
      // console.log();
      // console.log(doc.id, doc.data());
      companies = [...companies, { id: doc.id, ...doc.data() }];
    });
    setVehicleCompanies([...companies]);
  };

  let getModelData = async () => {
    console.log("effect");
    let details = await getDocs(vehiclemodelref);
    let vehicleCompanies = await getDocs(vehicleref);
    console.log("raj", details.docs);

    let models = [];

    let companies = {};
    vehicleCompanies.docs.forEach((doc) => {
      // console.log();
      // console.log(doc.id, doc.data());
      companies = {
        ...companies,

        [doc.id]: {
          ...doc.data(),
        },
      };
    });
    console.log(companies, "companies");
    // const docRef = await doc(db, "vehicle", `${docu.data().vehicle_id}`);
    // const docSnap = await getDoc(docRef);
    // console.log(docSnap.data().company_name);
    // const { company_name } = docSnap.data();
    await details.docs.forEach(async (doc) => {
      // console.log();
      // console.log(doc.id, doc.data());
      // const cityRef = db.collection("vehicle").doc(`${doc.data().vehicle_id}`);
      // const vehicle = await cityRef.get();
      // console.log("raj", vehicle);

      let data = {
        ...doc.data(),
      };
      console.log(companies[data.vehicle_id].company_name, "company name");
      models = [
        ...models,
        {
          id: doc.id,
          ...data,
          company_name: companies[data.vehicle_id].company_name,
        },
      ];
      console.log(models);
    });
    console.log(models);
    setVehicalModelList([...models]);
  };

  useEffect(() => {
    getData();
    getModelData();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddModel = async () => {
    // let vehicleMode;

    if (modelUpdateId) {
      const docRef = doc(db, "vehicleModel", modelUpdateId);
      let data = {
        vehicle_id: companyName,
        updatedAt: new Date().toUTCString(),
        vehicleModel: vehicleModel,
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
        vehicle_id: companyName,
        created_at: new Date().toUTCString(),
        updatedAt: new Date().toUTCString(),
        vehicleModel: vehicleModel,
      };

      try {
        await addDoc(vehiclemodelref, Details);
      } catch (error) {
        console.log(error);
      }
    }

    handleClose();
    getModelData();
    setModelUpdateId("");
  };

  const handleUpdate = (id) => {
    setModelUpdateId(id);
    getModelData();
  };
  const handleDelete = async (id) => {
    const docRef = doc(db, "vehicleModel", id.toString());
    deleteDoc(docRef);
    getData();
  };

  // const getCompanyName = async (Companyid) => {

  //   const docRef = await doc(db, "vehicle", `${Companyid}`);
  //   const docSnap = await getDoc(docRef);

  // };

  // let rajesh = getCompanyName("FAyFAfDBnpsCur4oOAWF").then((res) => {
  //   console.log(res.company_name);
  //   return res.company_name;
  // });
  console.log(vehicalModelList);
  return (
    <div className="serviceplanContainer">
      <h1>VEHICAL MODELS</h1>
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
                <StyledTableCell align="center">Vehical model</StyledTableCell>
                <StyledTableCell align="center">Created AT</StyledTableCell>
                <StyledTableCell align="center">UpdatedAt</StyledTableCell>
                <StyledTableCell align="center">Edit</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicalModelList &&
                vehicalModelList.map((company, index) => (
                  <StyledTableRow key={company.id}>
                    <StyledTableCell align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {company.company_name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {company.vehicleModel}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {company.created_at}
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      {company.updatedAt}
                    </StyledTableCell>{" "}
                    <StyledTableCell
                      align="center"
                      onClick={() => handleUpdate(company.id)}
                    >
                      <Button variant="contained">Edit</Button>
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      <Button
                        onClick={() => handleDelete(company.id)}
                        variant="contained"
                        color="error"
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
              <h3>CREATE VEHICLE MODEL</h3>
            </div>
            <div className="planFeildContainer">
              <div>
                <FormControl>
                  <InputLabel id="demo-simple-select-label">Company</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={companyName}
                    label="Company"
                    onChange={handleChange}
                  >
                    {vehicleCompanies.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item.id}>
                          {item.company_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
              <div>
                <TextField
                  id="outlined-basic"
                  label="Model Name"
                  variant="outlined"
                  fullWidth
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
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

export default AdmicVehicleModal;
