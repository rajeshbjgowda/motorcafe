import React, { useEffect, useState } from "react";

import FormControl from "@mui/material/FormControl";

import { app, fireStore, storage } from "../firebase";
import InputLabel from "@mui/material/InputLabel";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  updateDoc,
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
import { getSliddersData } from "../../redux/actions/Homesection";
import { useToasts } from "react-toast-notifications";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/mui-components/TableComponents";
import CircularProgress from "@mui/material/CircularProgress";
import * as yup from "yup";
import { uploadFileToFirebase } from "../../utils/functions";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { errorToastOption, successToastOption } from "../../utils/constants";

const AdminHomeSctionSlidders = () => {
  const [loading, setLoading] = useState(false);

  const [modelUpdateId, setModelUpdateId] = useState("");
  const { addToast } = useToasts();
  const sliddersRef = collection(fireStore, "slidders");
  const db = getFirestore(app);

  const dispatch = useDispatch();
  const slidders = useSelector((state) => state.homeSectionReducer.slidders);

  const getSliders = () => {
    try {
      dispatch(getSliddersData());
    } catch (error) {
      addToast("Something went wrong", errorToastOption);
    }
    setLoading(false);
  };
  useEffect(() => {
    getSliders();
  }, []);

  const addSlidders = async (e) => {
    e.preventDefault();

    const selectedImage = e.target.slidder_image.files[0];
    if (selectedImage.size > 2 * 1024 * 1024) {
      addToast("Please Add Image Less Than 2MB", errorToastOption);
      return;
    }
    setLoading(true);
    const image_url = await uploadFileToFirebase(
      e.target.slidder_image.files[0]
    );

    if (modelUpdateId) {
      const docRef = doc(db, "slidders", modelUpdateId);
      let Updatedata = {
        content: e.target.content.value,
        heading: e.target.heading.value,
        image: image_url,
        sub_heading: e.target.sub_heading.value,
        type: e.target.type.value,
      };

      await updateDoc(docRef, Updatedata)
        .then((docRef) => {
          console.log("Value of an Existing Document Field has been updated");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const Details = {
        content: e.target.content.value,
        heading: e.target.heading.value,
        image: image_url,
        sub_heading: e.target.sub_heading.value,
        type: e.target.type.value,
      };
      try {
        addDoc(sliddersRef, Details).then(async (res) => {});
      } catch (error) {
        console.log(error);
      }
    }
    getSliders();
  };
  const deleteSlidder = async (id) => {
    setLoading(true);
    const docRef = doc(db, "slidders", id.toString());
    deleteDoc(docRef);

    getSliders();
  };
  return (
    <div>
      <form onSubmit={addSlidders}>
        <Grid container spacing={2}>
          <Grid item xs={6} style={{ marginTop: "15px" }} alignItems="stretch">
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
              label="Enter SubHeading"
              variant="outlined"
              fullWidth
              name="sub_heading"
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
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Select Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="type"
                label="Select Type"
              >
                <MenuItem value={"offers"}>Offers</MenuItem>
                <MenuItem value={"sidder"}>slidder</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              variant="outlined"
              fullWidth
              accept="image/*"
              type="file"
              // onChange={(e) => setValue("slidder_image", e.target.files[0])}
              required
              name="slidder_image"
              helperText="Add Image less than 2MB"
            />
          </Grid>
        </Grid>

        <div className="btnContainer">
          <Button variant="contained" color="warning">
            reset
          </Button>
          <Button variant="contained" color="primary" type="submit">
            add slidders{" "}
          </Button>
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
                  <StyledTableCell align="center">SubHeading</StyledTableCell>
                  <StyledTableCell align="center"> Type</StyledTableCell>
                  <StyledTableCell align="center"> content</StyledTableCell>

                  <StyledTableCell align="center"> image</StyledTableCell>

                  <StyledTableCell align="center">Delete</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {slidders &&
                  slidders.map((slider, index) => (
                    <StyledTableRow key={slider.id}>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {slider.heading}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {slider.sub_heading}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {slider.type}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {slider.content}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <img
                          src={slider.image}
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
                            deleteSlidder(slider.id);
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

export default AdminHomeSctionSlidders;
