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

import { app, fireStore } from "./firebase";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore/lite";

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
const AdminServicePlan = () => {
  const [open, setOpen] = useState(false);
  const [serviceIncludeOpen, setServiceIncludeOpen] = useState(false);

  const [services, setServices] = useState([]);
  const [includedServices, setIncludedServices] = useState([]);
  const [includedServicesList, setIncludedServicesList] = useState({});

  const [servicePlan, setServicePlan] = useState("");
  const [addServiceToPlan, setAddServicePlan] = useState("");
  const [modelUpdateId, setModelUpdateId] = useState("");
  const [planId, setPlanId] = useState("");
  const planRef = collection(fireStore, "plan");
  const servicesRef = collection(fireStore, "service");
  const db = getFirestore(app);

  let getPlans = async () => {
    console.log("effect");
    let plansDetails = await getDocs(planRef);
    console.log("effect");

    let plans = [];
    plansDetails.docs.forEach((doc) => {
      // console.log();
      // console.log(doc.id, doc.data());
      plans = [...plans, { id: doc.id, ...doc.data() }];
    });
    setServices([...plans]);
  };
  const getServices = async () => {
    console.log("Services");
    let details = await getDocs(servicesRef);

    let services = {};
    details.docs.forEach((doc) => {
      console.log();
      services = {
        ...services,

        [doc.data().plan_id]: {
          id: doc.id,
          ...doc.data(),
        },
      };
    });
    console.log(services);
    setIncludedServicesList(services);
  };
  const createServiceDocument = (serviceName, id) => {
    const Details = {
      service_include: [],
      service_name: serviceName,
      images: [],
      plan_id: id,
    };

    try {
      let response = addDoc(servicesRef, Details);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddPlans = async (e) => {
    e.preventDefault();
    console.log("hnalde update", modelUpdateId);
    if (modelUpdateId) {
      const docRef = doc(db, "plan", modelUpdateId);
      let data = {
        field_name: servicePlan,

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
        field_name: servicePlan,
        created_at: new Date().toUTCString(),
        updated_at: new Date().toUTCString(),
        img_url: "",
      };

      try {
        addDoc(planRef, Details).then(async (res) => {
          console.log("response", res.id);
          await createServiceDocument(servicePlan, res.id);
        });
      } catch (error) {
        console.log(error);
      }
    }
    getPlans();
    handleClose();

    setServicePlan("");
    setModelUpdateId("");
  };

  useEffect(() => {
    console.log("SssSsdf");
    getPlans();
    getServices();
  }, []);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenServiceIncludeModal = (id) => {
    setPlanId(includedServicesList[id].id);
    setServiceIncludeOpen(true);
    console.log(includedServicesList[id], id, includedServicesList);
    setIncludedServices(includedServicesList[id]);
  };
  const handleCloseServiceIncludeModal = () => {
    setServiceIncludeOpen(false);
  };

  const handleUpdate = (id) => {
    setModelUpdateId(id);
    handleOpen();
  };
  const handleDelete = async (id) => {
    const docRef = doc(db, "plan", id.toString());
    deleteDoc(docRef);
    getPlans();
  };
  const addServicesToPlan = async (id) => {
    const docRef = doc(db, "service", planId);

    await updateDoc(docRef, {
      service_include: arrayUnion(addServiceToPlan), // removes "1" from the array
    });
    getServices();

    console.log(planId);
  };

  const deleteServiceInPlan = async (service) => {
    const docRef = doc(db, "service", planId);

    await updateDoc(docRef, {
      service_include: arrayRemove(service), // removes "1" from the array
    });
    getServices();

    console.log(planId);
  };
  const addServiceInclude = async () => {};

  console.log(
    includedServices,
    includedServicesList,
    includedServices.service_include
  );
  return (
    <div className="serviceplanContainer">
      <h1>SERVICE PLAN</h1>
      <div>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          add plan
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
                <StyledTableCell align="center">Service Plan</StyledTableCell>
                <StyledTableCell align="center">Services</StyledTableCell>
                <StyledTableCell align="center">Created AT</StyledTableCell>
                <StyledTableCell align="center">UpdatedAt</StyledTableCell>
                <StyledTableCell align="center">Edit</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((servicePlan, index) => (
                <StyledTableRow key={servicePlan.id}>
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell align="center">
                    {servicePlan.field_name}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() =>
                        handleOpenServiceIncludeModal(servicePlan.id)
                      }
                    >
                      services include
                    </Button>
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    {/* {console.log(servicePlan.created_at.seconds)} */}
                    {/* {servicePlan.created_at} */}
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    {/* {servicePlan.updated_at} */}
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      onClick={() => handleUpdate(servicePlan.id)}
                    >
                      Edit
                    </Button>
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(servicePlan.id)}
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
              <h3>CREATE SERVICE PLAN</h3>
            </div>
            <div className="planFeildContainer">
              <TextField
                id="outlined-basic"
                label="Enter Plan"
                variant="outlined"
                fullWidth
                value={servicePlan}
                onChange={(e) => setServicePlan(e.target.value)}
              />
            </div>
            <div className="btnContainer">
              <Button variant="contained" color="warning">
                reset
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddPlans}
              >
                add plan{" "}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>

      <Modal
        open={serviceIncludeOpen}
        onClose={handleCloseServiceIncludeModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="addPlanContainer">
            <div className="heading">
              <h3>SERVICE PLANS </h3>
            </div>
            <div className="serviceIncludeContainer">
              <div className="tableContainer">
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Sl.No</StyledTableCell>
                      <StyledTableCell align="center">Service </StyledTableCell>
                      <StyledTableCell align="center">Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {includedServices &&
                      includedServices.service_include &&
                      includedServices.service_include.map((service, index) => (
                        <StyledTableRow key={service}>
                          <StyledTableCell align="center">
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {service}
                          </StyledTableCell>

                          <StyledTableCell align="center">
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => deleteServiceInPlan(service)}
                            >
                              delete
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <div style={{ marginTop: "15px" }}>
                <TextField
                  id="outlined-basic"
                  label="Add Services"
                  variant="outlined"
                  fullWidth
                  value={addServiceToPlan}
                  onChange={(e) => setAddServicePlan(e.target.value)}
                />
              </div>
            </div>
            <div className="btnContainer">
              <Button variant="contained" color="warning">
                reset
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={addServicesToPlan}
              >
                add service{" "}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminServicePlan;
