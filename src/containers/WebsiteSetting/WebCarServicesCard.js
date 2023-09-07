import React, { useEffect, useState } from "react";

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
import {
  getSliddersData,
  getWebServicesData,
} from "../../redux/actions/Homesection";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/mui-components/TableComponents";
import CircularProgress from "@mui/material/CircularProgress";

import { uploadFileToFirebase } from "../../utils/functions";
import { LoadingButton } from "@mui/lab";
import { useToasts } from "react-toast-notifications";
import { errorToastOption } from "../../utils/constants";

const WebCarServices = () => {
  const [loading, setLoading] = useState(false);
  const [modelUpdateId, setModelUpdateId] = useState("");
  const { addToast } = useToasts();

  const db = getFirestore(app);

  const dispatch = useDispatch();
  const webServices = useSelector(
    (state) => state.homeSectionReducer.webServices
  );

  useEffect(() => {
    dispatch(getWebServicesData());
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
        heading: e.target.heading.value,
        content: e.target.content.value,
      };
      const image_url = await uploadFileToFirebase(e.target.image.files[0]);
      data.image_url = image_url;

      const collectionRef = collection(fireStore, "web_car_services");
      await addDoc(collectionRef, data);
      dispatch(getWebServicesData());
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const deleteSlidder = async (id) => {
    setLoading(true);
    try {
      const docRef = doc(db, "web_car_services", id.toString());

      deleteDoc(docRef);

      dispatch(getWebServicesData());
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>CAR SERVICES</h1>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Heading"
              variant="outlined"
              fullWidth
              name="heading"
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Content"
              variant="outlined"
              fullWidth
              name="content"
            />
          </Grid>

          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              hidden
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

                  <StyledTableCell align="center">Heading</StyledTableCell>

                  <StyledTableCell align="center"> content</StyledTableCell>

                  <StyledTableCell align="center"> image</StyledTableCell>

                  <StyledTableCell align="center">Delete</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {webServices &&
                  webServices.map((service, index) => (
                    <StyledTableRow key={service.id}>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {service.heading}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {service.content}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <img
                          src={service.image_url}
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
                            deleteSlidder(service.id);
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

export default WebCarServices;
