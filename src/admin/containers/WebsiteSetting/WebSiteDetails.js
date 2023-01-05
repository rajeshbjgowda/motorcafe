import React, { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useForm } from "react-hook-form";
import { app, fireStore, storage } from "../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
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
import {
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getSliddersData,
  getWebDetailsData,
  getWebEmployeesData,
  getWebServicesData,
} from "../../redux/actions/Homesection";
import { async } from "@firebase/util";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/mui-components/TableComponents";

const WebSiteDetails = () => {
  const [uploadedImage, setUploadedImage] = useState("");
  const [modelUpdateId, setModelUpdateId] = useState("OV2f00Q6X2kGuK4hX9EV");

  const WebEmployeesRf = collection(fireStore, "garage_details");
  const db = getFirestore(app);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const garage_Details = useSelector(
    (state) => state.homeSectionReducer.garage_Details
  );

  useEffect(() => {
    dispatch(getWebDetailsData());
  }, []);

  const updateWebDetails = async (data) => {
    let imageUrl = "";

    const {
      adress_line_1,
      adress_line_2,
      city,
      closing_hours,
      email,
      opening_hours,
      phone_1,
      phone_2,
      pincode,
      shop_name,
      state,
      working_days,
    } = data;

    const docRef = doc(db, "garage_details", modelUpdateId);
    let Updatedata = {
      adress_line_1,
      adress_line_2,
      city,
      closing_hours,
      email,
      opening_hours,
      phone_1,
      phone_2,
      pincode,
      shop_name,
      state,
      working_days,
    };

    await updateDoc(docRef, Updatedata)
      .then((docRef) => {
        console.log("Value of an Existing Document Field has been updated");
      })
      .catch((error) => {
        console.log(error);
      });

    dispatch(getWebDetailsData());
    reset();
  };

  console.log(garage_Details);
  return (
    <div>
      <form onSubmit={handleSubmit(updateWebDetails)}>
        <Grid container spacing={2}>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Adress Line1"
              variant="outlined"
              fullWidth
              {...register("adress_line_1")}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Adress Line 2"
              variant="outlined"
              fullWidth
              {...register("adress_line_2")}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter  City Name"
              variant="outlined"
              fullWidth
              {...register("city")}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Opening Hours AM/PM"
              variant="outlined"
              fullWidth
              {...register("opening_hours")}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Closing Hours AM/PM"
              variant="outlined"
              fullWidth
              {...register("closing_hours")}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Compnay Email"
              variant="outlined"
              fullWidth
              {...register("email")}
            />
          </Grid>

          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Phone Number 1"
              variant="outlined"
              fullWidth
              {...register("phone_1")}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Phone Number 2"
              variant="outlined"
              fullWidth
              {...register("phone_2")}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Pin Code"
              variant="outlined"
              fullWidth
              {...register("pincode")}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Shop Name"
              variant="outlined"
              fullWidth
              {...register("shop_name")}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter State"
              variant="outlined"
              fullWidth
              {...register("state")}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Working days"
              variant="outlined"
              fullWidth
              {...register("working_days")}
            />
          </Grid>
        </Grid>

        <div className="btnContainer">
          <Button variant="contained" color="warning">
            reset
          </Button>
          <Button variant="contained" color="primary" type="submit">
            update details{" "}
          </Button>
        </div>
      </form>

      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table
            aria-label="customized table"
            sx={{ minWidth: 750, overflowX: "scroll" }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">shop name</StyledTableCell>
                <StyledTableCell align="center">adress line 1</StyledTableCell>
                <StyledTableCell align="center"> adress line 2</StyledTableCell>
                <StyledTableCell align="center"> city</StyledTableCell>
                <StyledTableCell align="center"> pincode</StyledTableCell>
                <StyledTableCell align="center">state</StyledTableCell>
                <StyledTableCell align="center"> pin code</StyledTableCell>
                <StyledTableCell align="center"> Email</StyledTableCell>
                <StyledTableCell align="center"> phone 1</StyledTableCell>
                <StyledTableCell align="center"> phone 2</StyledTableCell>
                <StyledTableCell align="center"> working days</StyledTableCell>
                <StyledTableCell align="center"> opening hours</StyledTableCell>
                <StyledTableCell align="center"> closing hours</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell align="center">
                  {garage_Details.shop_name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {garage_Details.adress_line_1}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {garage_Details.adress_line_2}
                </StyledTableCell>

                <StyledTableCell align="center">
                  {garage_Details.city}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {garage_Details.pincode}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {garage_Details.email}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {garage_Details.phone_1}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {garage_Details.phone_2}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {garage_Details.working_days}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {garage_Details.opening_hours}
                </StyledTableCell>

                <StyledTableCell align="center">
                  {garage_Details.closing_hours}
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default WebSiteDetails;
