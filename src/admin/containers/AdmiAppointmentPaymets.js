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
import { PunchClock } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  StyledTableCell,
  StyledTableRow,
} from "../components/mui-components/TableComponents";
import {
  getAppointmentsData,
  getPaymentTransactions,
} from "../redux/actions/appointments";

import useRazorpay from "react-razorpay";
import { useCallback } from "react";
import axios from "axios";
// import { Razorpay } from "razorpay";
// const Razorpay

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

const AdmiAppointmentPaymets = () => {
  const [open, setOpen] = React.useState(false);

  const dispatch = useDispatch();

  const paymentTransactions = useSelector(
    (state) => state.appointmenteducer.paymentTransactions
  );
  const Razorpay = useRazorpay();
  useEffect(() => {
    dispatch(getPaymentTransactions());
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleTestIntegration = async () => {
    // const order = await createOrder  ( params);
    // const options = {
    //   key: "YOUR_KEY_ID",
    //   amount: "3000",
    //   currency: "INR",
    //   name: "Acme Corp",
    //   description: "Test Transaction",
    //   image: "https://example.com/your_logo",
    //   order_id: order.id,
    //   handler: (res) => {
    //     console.log(res);
    //   },
    //   prefill: {
    //     name: "Piyush Garg",
    //     email: "youremail@example.com",
    //     contact: "9999999999",
    //   },
    //   notes: {
    //     address: "Razorpay Corporate Office",
    //   },
    //   theme: {
    //     color: "#3399cc",
    //   },
    // };
    // const rzpay = new Razorpay(options);
    // rzpay.open();
    // var instance = new Razorpay({
    //   key: "rzp_test_na1hVKmXXUs5Ks",
    //   key_secret: "fpPgOyMy274uxf00tLDsla4S",
    // });
    // console.log(instance);

    // let order = instance.orders.create({
    //   amount: 50000,
    //   currency: "INR",
    //   receipt: "receipt#1",
    //   notes: {
    //     key1: "value3",
    //     key2: "value2",
    //   },
    // });
    // console.log(order);
    // var options = {
    //   key: "rzp_test_na1hVKmXXUs5Ks",
    //   amount: "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    //   currency: "INR",
    //   name: "Acme Corp",
    //   description: "Test Transaction",
    //   image: "https://example.com/your_logo",
    //   order_id: "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    //   callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
    //   prefill: {
    //     name: "Gaurav Kumar",
    //     email: "gaurav.kumar@example.com",
    //     contact: "9999999999",
    //   },
    //   notes: {
    //     address: "Razorpay Corporate Office",
    //   },
    //   theme: {
    //     color: "#3399cc",
    //   },
    // };
    // var rzp1 = new Razorpay(options);
    // rzp1.open();

    axios
      .get(
        "https://api.razorpay.com/v1/payments/",

        {
          auth: {
            username: "rzp_test_na1hVKmXXUs5Ks",
            password: "fpPgOyMy274uxf00tLDsla4S",
          },
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*/*",
            Authorization:
              "Basic cnpwX3Rlc3RfbmExaFZLbVhYVXM1S3M6ZnBQZ095TXkyNzR1eGYwMHRMRHNsYTRT",
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
          },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((er) => {
        console.log(er);
      });
  };

  return (
    <div className="serviceplanContainer">
      <h1>ALL PAYMENTS </h1>
      <button onClick={handleTestIntegration}>test the razor pay</button>
      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table
            aria-label="customized table"
            sx={{ minWidth: 650, overflowX: "scroll" }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sl.No</StyledTableCell>

                <StyledTableCell align="center">amount</StyledTableCell>
                <StyledTableCell align="center"> Date</StyledTableCell>
                <StyledTableCell align="center">payment id</StyledTableCell>
                <StyledTableCell align="center">status</StyledTableCell>
                <StyledTableCell align="center">transaction id</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentTransactions.map((transaction, index) => (
                <StyledTableRow key={transaction.id}>
                  <StyledTableCell align="center">{index + 1}</StyledTableCell>
                  <StyledTableCell align="center">
                    {transaction.amount}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {transaction.date}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {transaction.payment_id}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {transaction.status}
                  </StyledTableCell>{" "}
                  <StyledTableCell align="center">
                    {transaction.transaction_id}
                  </StyledTableCell>{" "}
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
