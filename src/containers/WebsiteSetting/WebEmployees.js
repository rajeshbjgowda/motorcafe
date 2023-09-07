import React, { useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import { app, fireStore, storage } from "../firebase";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
} from "firebase/firestore";
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
import { getWebEmployeesData } from "../../redux/actions/Homesection";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/mui-components/TableComponents";
import { LoadingButton } from "@mui/lab";
import { uploadFileToFirebase } from "../../utils/functions";
import { useToasts } from "react-toast-notifications";
import { errorToastOption } from "../../utils/constants";

const WebEmployees = () => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToasts();
  const db = getFirestore(app);

  const dispatch = useDispatch();
  const employees = useSelector((state) => state.homeSectionReducer.employees);

  useEffect(() => {
    dispatch(getWebEmployeesData());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedImage = e.target.image.files[0];
    if (selectedImage.size > 2 * 1024 * 1024) {
      addToast("Please Add Image Less Than 2MB", errorToastOption);
      return;
    }
    setLoading(true);

    try {
      const data = {
        employe_destination: e.target.employe_destination.value,
        employe_name: e.target.employe_name.value,
      };
      const image_url = await uploadFileToFirebase(e.target.image.files[0]);
      data.image_url = image_url;

      const collectionRef = collection(fireStore, "web_employers");
      await addDoc(collectionRef, data);
      dispatch(getWebEmployeesData());
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

    e.target.employe_destination.value = null;
    e.target.employe_name.value = null;
    e.target.image.value = "";
  };

  const deleteSlidder = async (id) => {
    const docRef = doc(db, "web_employers", id.toString());

    deleteDoc(docRef);

    dispatch(getWebEmployeesData());
  };
  console.log(employees);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Employee name"
              variant="outlined"
              fullWidth
              required
              name="employe_name"
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Destination"
              variant="outlined"
              fullWidth
              required
              name="employe_destination"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              accept="image/*"
              type="file"
              name="image"
              required
              fullWidth
              helperText="Add Image less than 2MB"
            />
          </Grid>
        </Grid>

        <div className="btnContainer">
          <Button variant="contained" color="warning">
            reset
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            type="submit"
            loading={loading}
          >
            Save
          </LoadingButton>
        </div>
      </form>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <CircularProgress style={{ height: 80, width: 80 }} />
        </div>
      ) : (
        <div className="tableContainer">
          <TableContainer component={Paper}>
            <Table
              aria-label="customized table"
              sx={{ minWidth: 750, overflowX: "scroll" }}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Sl.No</StyledTableCell>

                  <StyledTableCell align="center">name</StyledTableCell>

                  <StyledTableCell align="center"> destination</StyledTableCell>

                  <StyledTableCell align="center"> Image</StyledTableCell>

                  <StyledTableCell align="center">Delete</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees &&
                  employees.map((employe, index) => (
                    <StyledTableRow key={employe.id}>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {employe.employe_name}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {employe.employe_destination}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <img
                          src={employe.image_url}
                          width="20px"
                          height={"20px"}
                          alt="slider"
                        />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="error"
                          onClick={(e) => {
                            e.preventDefault();
                            deleteSlidder(employe.id);
                          }}
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
      )}
    </div>
  );
};

export default WebEmployees;
