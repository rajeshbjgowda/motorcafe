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
import {
  StyledTableCell,
  StyledTableRow,
} from "../components/mui-components/TableComponents";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getServicePlanPriceData } from "../redux/actions/serviceplanprice";
import {
  deleteDoc,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore/lite";
import { app } from "./firebase";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { async } from "@firebase/util";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
const schema = yup.object().shape({
  plan_price: yup.number().positive(),
  plan_discount: yup.number().positive(),
  plan_advance: yup.number().positive(),
  plan_duration: yup.string(),
});

const AdminServicePlanPrice = () => {
  const [open, setOpen] = useState(false);
  const [serviceId, setServiceId] = useState("");

  const db = getFirestore(app);

  const servicesList = useSelector(
    (state) => state.servicePlanPriceReducer.service_plans_prices
  );
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    if (Object.keys(servicesList).length === 0) {
      console.log("raejs");
      dispatch(getServicePlanPriceData());
    }
  }, []);

  const handleOpen = (data) => {
    setServiceId(data.id);
    setOpen(true);
    setValue("plan_price", data.price);
    setValue("plan_discount", data.discount);
    setValue("plan_advance", data.advance_price);
    setValue("plan_duration", data.duration);
  };
  const handleClose = () => {
    setOpen(false);
  };

  console.log("sd");

  const handleDelete = (id) => {
    const docRef = doc(db, "service", id.toString());
    deleteDoc(docRef);
    dispatch(getServicePlanPriceData());
  };

  const handleUpdate = async (data) => {
    const docRef = doc(db, "service", serviceId);
    let Updatedata = {
      advance_price: data.plan_advance,
      discount: data.plan_discount,
      duration: data.plan_duration,
      price: data.plan_price,
    };

    await updateDoc(docRef, Updatedata)
      .then((docRef) => {
        console.log("Value of an Existing Document Field has been updated");
      })
      .catch((error) => {
        console.log(error);
      });
    dispatch(getServicePlanPriceData());
  };
  return (
    <div className="serviceplanContainer">
      <h1>SERVICE PLAN PRICE</h1>
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
                <StyledTableCell align="center">Price</StyledTableCell>
                <StyledTableCell align="center">discount</StyledTableCell>
                <StyledTableCell align="center">duration</StyledTableCell>
                <StyledTableCell align="center">advance_price</StyledTableCell>
                <StyledTableCell align="center">Edit</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicesList &&
                Object.keys(servicesList).map((key, index) => {
                  const {
                    id,
                    service_name,
                    advance_price,
                    discount,
                    duration,
                    price,
                  } = servicesList[key];
                  return (
                    <StyledTableRow key={id}>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {service_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">{price}</StyledTableCell>
                      <StyledTableCell align="center">
                        {discount}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {duration}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {advance_price}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          onClick={() => handleOpen(servicesList[key])}
                        >
                          Edit
                        </Button>
                      </StyledTableCell>{" "}
                    </StyledTableRow>
                  );
                })}
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

            <form onSubmit={handleSubmit(handleUpdate)}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <div className="planFeildContainer">
                    <TextField
                      id="outlined-basic"
                      label="Enter Price"
                      variant="outlined"
                      fullWidth
                      {...register("plan_price")}
                    />
                  </div>
                </Grid>{" "}
                <Grid item xs={6}>
                  <div className="planFeildContainer">
                    <TextField
                      id="outlined-basic"
                      label="Enter Discount"
                      variant="outlined"
                      fullWidth
                      {...register("plan_discount")}
                    />
                  </div>
                </Grid>{" "}
                <Grid item xs={6}>
                  <div className="planFeildContainer">
                    <TextField
                      id="outlined-basic"
                      label="Enter Advance Amount"
                      variant="outlined"
                      fullWidth
                      {...register("plan_advance")}
                    />
                  </div>
                </Grid>{" "}
                <Grid item xs={6}>
                  <div className="planFeildContainer">
                    <TextField
                      id="outlined-basic"
                      label="Enter Duration in hours"
                      variant="outlined"
                      fullWidth
                      {...register("plan_duration")}
                    />
                  </div>
                </Grid>
              </Grid>
              <div className="btnContainer">
                <Button variant="contained" color="warning">
                  reset
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  add plan{" "}
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminServicePlanPrice;
