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
import { DateRange, PunchClock } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/mui-components/TableComponents";
import { getAppointmentsData } from "../../redux/actions/appointments";
import { getUsersData } from "../../redux/actions/users";
import {
  CardActions,
  CardContent,
  CardMedia,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { async } from "@firebase/util";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { app } from "../firebase";
import { getServicePlanPriceData } from "../../redux/actions/serviceplanprice";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import generatePDF, { generateInvoicePdf } from "./generateAppoinmentPdf";
import Calendar from "../../components/DateRangePicker";
import { sendPushNotificationToDeviceTokens } from "../../utils/functions";
import { LoadingButton } from "@mui/lab";
import Checkbox from "@mui/material/Checkbox";

import axios from "axios";
import DateRangePickerValue from "../../components/DateRangePicker";

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
  const [openUserDetailModal, setOpenUserDetailModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [userAdress, setUserAddress] = useState({
    open: false,
    address: null,
  });

  const [openAddServiceModal, setOpenAddServiceModal] = useState(false);

  const db = getFirestore(app);

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
    const collectionRef = collection(db, "service");
    getDocs(collectionRef)
      .then((snapShot) => {
        const services = {};
        snapShot.forEach((service) => {
          services[service.id] = { id: service.id, ...service.data() };
        });
        setAllServices(services);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCLose = () => {
    setModalData(null);
    setOpen(false);
  };

  const handleOpen = (service) => {
    setModalData(service);
    setOpen(true);
    setAppointmentId(service.id);
  };

  const handleOpenAddServiceModal = (id) => {
    setOpenAddServiceModal(true);
    setAppointmentId(id);
  };

  const handleCloseAddServiceModal = () => {
    setOpenAddServiceModal(false);

    setAppointmentId(null);
  };

  const handleCloseUserModal = () => {
    setOpenUserDetailModal(false);
    setUserDetails({});
  };

  const handleOpenUserModal = (userId) => {
    console.log("click");
    setOpenUserDetailModal(true);

    setUserDetails({
      ...users[userId],
    });

    console.log(users[userId]);
  };

  const handleSetAppointmentStatus = async (e, id) => {
    const docRef = doc(db, "appointments", id);
    await updateDoc(docRef, {
      status: e.target.value,
    });
    dispatch(getAppointmentsData());
  };
  console.log("appointments", appointments, users);

  const handleCreateInvoice = (appointment) => {
    // console.log("handleCreateInvoice", appointment);
    // console.log("handleCreateInvoice", users[appointment.user_id].fcm_token);

    // let notificationDetail = {
    //   to: users[appointment.user_id].fcm_token,
    //   data: {
    //     title: "Portugal vs. Denmark",
    //     body: "great match!",
    //   },
    // };
    // sendPushNotificationToDeviceTokens(notificationDetail);
    // generateInVoice();

    // axios
    //   .get("https://jsonplaceholder.typicode.com/posts")
    //   .then((res) => {
    //     console.log("res", res);
    //   })
    //   .catch((err) => {
    //     console.log("err", err);
    //   });

    generateInvoicePdf(appointment, users, allServices);
  };

  const handleOrderAccept = async (appointment) => {
    console.log("handleCreateInvoice", users);

    const docRef = doc(db, "appointments", appointment.id);
    await updateDoc(docRef, {
      isOrderAccepted: true,
      status: "accepted",
    });
    dispatch(getAppointmentsData());
  };

  const handleOrderCanceled = async (appointment) => {
    const docRef = doc(db, "appointments", appointment.id);
    await updateDoc(docRef, {
      isCanceled: true,
      status: "canceled",
    });
    dispatch(getAppointmentsData());
  };

  const handleAddExtraService = async (e) => {
    e.preventDefault();
    const appointmentRef = doc(db, "appointments", appointmentId);
    setLoading(true);
    const data = {
      service_name: e.target.service_name.value,
      description: e.target.description.value,
      price: e.target.price.value,
      discount: e.target.discount.value,
      advance_price: e.target.advance_price.value,
      duration: e.target.duration.value,
      isActive: true,
    };
    await updateDoc(appointmentRef, {
      extra_services: arrayUnion(data),
    })
      .then((docRef) => {
        console.log("Value of an Existing Document Field has been updated");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
    handleCloseAddServiceModal();
  };
  console.log("userType", users);

  const hadleChangePaymentCollected = async (e, id) => {
    const appointmentRef = doc(db, "appointments", id);
    await updateDoc(appointmentRef, {
      amount_collected: e.target.checked,
    });
    dispatch(getAppointmentsData());
  };
  return (
    <div className="serviceplanContainer">
      <h1>ALL APPOINTMENTS </h1>
      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table
            aria-label="customized table"
            sx={{ minWidth: 950, overflowX: "scroll" }}
            id="table-to-xls"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sl.No</StyledTableCell>
                <StyledTableCell align="center">User </StyledTableCell>
                <StyledTableCell align="center"> view User </StyledTableCell>

                <StyledTableCell align="center">Appointment Id</StyledTableCell>
                <StyledTableCell align="center">
                  optional service
                </StyledTableCell>
                <StyledTableCell align="center"> services</StyledTableCell>
                <StyledTableCell align="center"> Add Services</StyledTableCell>

                <StyledTableCell align="center"> vehicle id</StyledTableCell>
                <StyledTableCell align="center">payment id</StyledTableCell>
                <StyledTableCell align="center">payment status</StyledTableCell>
                <StyledTableCell align="center">service type</StyledTableCell>
                <StyledTableCell align="center"> adress</StyledTableCell>
                <StyledTableCell align="center"> status</StyledTableCell>
                <StyledTableCell align="center">accept</StyledTableCell>
                <StyledTableCell align="center">cancel</StyledTableCell>
                <StyledTableCell align="center">
                  is payment collected
                </StyledTableCell>

                <StyledTableCell align="center">bill</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments &&
                appointments.map((appointment, index) => (
                  <StyledTableRow key={appointment.id}>
                    <StyledTableCell align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {users[appointment.user_id]?.username}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => handleOpenUserModal(appointment.user_id)}
                        fullWidth
                        size="small"
                        sx={{ minWidth: 150 }}
                      >
                        View user detail
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {appointment.id}
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      {appointment.optional_service}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => handleOpen(appointment)}
                      >
                        services
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleOpenAddServiceModal(appointment.id)
                        }
                      >
                        add services
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {appointment.vehicle_index}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {appointment.payments_details?.payment_id}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {appointment.payments_details?.payment_status}
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      {appointment.service_type}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => {
                          setUserAddress({
                            open: true,
                            address:
                              users[appointment.user_id].address[
                                appointment.address_index
                              ],
                          });
                        }}
                      >
                        view Booked Address
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={appointment.status.toLowerCase()}
                          label="status"
                          onChange={(e) =>
                            handleSetAppointmentStatus(e, appointment.id)
                          }
                        >
                          {appointment.isOrderAccepted && (
                            <MenuItem value={"accepted"} disabled>
                              Accepted
                            </MenuItem>
                          )}

                          {appointment.isCanceled && (
                            <MenuItem value={"canceled"} disabled>
                              Canceled
                            </MenuItem>
                          )}
                          {!(
                            appointment.isOrderAccepted ||
                            appointment.isCanceled
                          ) && <MenuItem value={"booked"}>Booked</MenuItem>}

                          <MenuItem
                            value={"success"}
                            disabled={appointment.isCanceled ? true : false}
                          >
                            sucess
                          </MenuItem>
                          <MenuItem
                            value={"reject"}
                            disabled={appointment.isCanceled ? true : false}
                          >
                            reject
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        disabled={
                          appointment.isOrderAccepted || appointment.isCanceled
                            ? true
                            : false
                        }
                        onClick={() => handleOrderAccept(appointment)}
                      >
                        accept
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleOrderCanceled(appointment)}
                        disabled={appointment.isCanceled ? true : false}
                      >
                        cancel
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Checkbox
                        checked={appointment.amount_collected}
                        onChange={(e) =>
                          hadleChangePaymentCollected(e, appointment.id)
                        }
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCreateInvoice(appointment)}
                      >
                        Download
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* <Calendar /> */}

      <div className="appointmentDetailsBtn">
        <DateRangePickerValue />
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="table-to-xls"
          filename="tablexls"
          sheet="tablexls"
          buttonText="Download as XLS"
        />

        <Button
          variant="contained"
          onClick={() => generatePDF(appointments, users)}
        >
          Generate pdf
        </Button>
      </div>

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
                  modalData.service_ids.map((serviceId, index) => {
                    const service = allServices[serviceId];
                    if (service) {
                      return (
                        <StyledTableRow key={serviceId}>
                          <StyledTableCell align="center">
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {service.service_name}
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

      <Modal
        open={openUserDetailModal}
        onClose={handleCloseUserModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Card
          sx={{ maxWidth: 345, ...style, height: "500px", overflow: "auto" }}
        >
          <CardMedia
            sx={{ height: 140 }}
            image={userDetails.profile_url}
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {userDetails.username}
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              {userDetails.mobile}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userDetails?.address &&
                userDetails?.address.map((addres, index) => {
                  return (
                    <div key={index}>
                      <Typography gutterBottom variant="h6" component="div">
                        address {index + 1}
                      </Typography>
                      <Typography gutterBottom variant="p" component="div">
                        primary address:{addres.address_priamry}
                      </Typography>
                      <Typography gutterBottom variant="p" component="div">
                        addressLine1:{addres.address1}
                      </Typography>
                      <Typography gutterBottom variant="p" component="div">
                        addressLine2:{addres.address2}
                      </Typography>
                      <Typography gutterBottom variant="p" component="div">
                        {addres.city}, {addres.state},{addres.pincode}
                      </Typography>
                      <Typography gutterBottom variant="p" component="div">
                        landmark:{addres.landmark}
                      </Typography>
                    </div>
                  );
                })}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleCloseUserModal}>
              close
            </Button>
          </CardActions>
        </Card>
      </Modal>

      <Modal
        open={userAdress.open}
        onClose={() => {
          setUserAddress({
            open: false,
            address: null,
          });
        }}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ maxWidth: 345, ...style }}>
          <Typography gutterBottom variant="h4" component="div">
            Booked Address
          </Typography>
          <Typography gutterBottom variant="p" component="div">
            primary address:{userAdress.address?.address_priamry}
          </Typography>
          <Typography gutterBottom variant="p" component="div">
            addressLine1:{userAdress.address?.address1}
          </Typography>
          <Typography gutterBottom variant="p" component="div">
            addressLine2:{userAdress.address?.address2}
          </Typography>
          <Typography gutterBottom variant="p" component="div">
            {userAdress.address?.city}, {userAdress.address?.state},
            {userAdress.address?.pincode}
          </Typography>
          <Typography gutterBottom variant="p" component="div">
            landmark:{userAdress.address?.landmark}
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openAddServiceModal}
        onClose={handleCloseAddServiceModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
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
          <form onSubmit={handleAddExtraService}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Plan Title"
                  variant="outlined"
                  required
                  fullWidth
                  type="text"
                  name="service_name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  multiline
                  label="Plan Description"
                  variant="outlined"
                  fullWidth
                  required
                  rows={5}
                  type="text"
                  name="description"
                  placeholder="give coma for creating the points"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Price"
                  fullWidth
                  required
                  rows={5}
                  type="number"
                  name="price"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Discount"
                  fullWidth
                  required
                  rows={5}
                  type="number"
                  name="discount"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Advance Price"
                  fullWidth
                  required
                  rows={5}
                  type="number"
                  name="advance_price"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  label="Duration"
                  fullWidth
                  required
                  rows={5}
                  type="number"
                  name="duration"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  required
                  rows={5}
                  type="file"
                  name="image"
                />
              </Grid>
            </Grid>
            <LoadingButton
              sx={{ mt: 4 }}
              variant="contained"
              color="primary"
              type="submit"
              loading={loading}
            >
              Save
            </LoadingButton>
          </form>
        </Box>
      </Modal>

      <div></div>
    </div>
  );
};

export default AdminAppointments;
