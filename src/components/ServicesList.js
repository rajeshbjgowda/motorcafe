import {
  Modal,
  Box,
  Button,
  TableBody,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  Paper,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { fireStore } from "../containers/firebase";
import AddService from "./AddService";
import Loading from "./Loading/Loading";
import {
  StyledTableCell,
  StyledTableRow,
} from "./mui-components/TableComponents";

const ServicesList = ({ open, planId, handleClose }) => {
  const [services, setServices] = useState({});
  const [loading, seLoading] = useState(true);

  const [openAddService, setOpenAddService] = useState({
    plan: null,
    open: false,
    service: null,
    updateServiceId: null,
  });

  const getPlans = () => {
    const collectionRef = query(
      collection(fireStore, "service"),
      where("plan_id", "==", planId)
    );
    const tempServices = {};
    getDocs(collectionRef)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          tempServices[doc.id] = { id: doc.id, ...data };
        });
        setServices(tempServices);
        seLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPlans();
  }, []);

  const deleteService = async (id) => {
    const serviceRef = doc(fireStore, "service", id.toString());
    deleteDoc(serviceRef);

    await updateDoc(serviceRef, {
      isActive: false,
    });
    getPlans();
  };
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: 4,
            borderRadius: "5px",
            minWidth: 500,
            maxHeight: "95vh",
            overflowY: "auto",
          }}
        >
          {loading ? (
            <Box>
              <Loading />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table
                aria-label="customized table"
                sx={{ minWidth: 650, overflowX: "scroll" }}
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">Sl.No</StyledTableCell>
                    <StyledTableCell align="center">Title</StyledTableCell>
                    <StyledTableCell align="center">Price in ₹</StyledTableCell>
                    <StyledTableCell align="center">
                      Advance in ₹
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Discount in ₹
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Duration in hour
                    </StyledTableCell>
                    <StyledTableCell align="center">Created At</StyledTableCell>
                    <StyledTableCell align="center">Edit</StyledTableCell>
                    <StyledTableCell align="center">Delete</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.values(services).map((service, index) => {
                    if (!service.isActive) {
                      return (
                        <StyledTableRow key={service.id}>
                          <StyledTableCell align="center">
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {service?.service_name}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {service?.price}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {service?.advance_price}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {service?.discount}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {service?.duration}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {new Date(
                              service?.created_at?.seconds * 1000
                            ).toLocaleString()}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Button
                              onClick={() => {
                                console.log("service", service);
                                setOpenAddService({
                                  open: true,
                                  plan: null,
                                  updateServiceId: service.id,
                                  service: service,
                                });
                              }}
                              variant="contained"
                            >
                              Edit
                            </Button>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            <Button
                              onClick={() => deleteService(service.id)}
                              variant="contained"
                              color="error"
                            >
                              delete
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      );
                    }
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Modal>

      {openAddService.open && (
        <AddService
          plan={openAddService.plan}
          open={openAddService.open}
          updateServiceId={openAddService.updateServiceId}
          service={openAddService.service}
          handleClose={() => {
            setOpenAddService({
              open: false,
              plan: null,
              updateServiceId: null,
              service: null,
            });
            getPlans();
          }}
        />
      )}
    </>
  );
};

export default ServicesList;
