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
import { async } from "@firebase/util";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/mui-components/TableComponents";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { uploadFileToFirebase } from "../../utils/functions";

const schema = yup.object().shape({
  heading: yup.string().required("reqired"),
  sub_heading: yup.string().required("reqired"),
  content: yup.string().required("required"),
  slidder_image: yup.mixed().required("required"),
});
const AdminHomeSctionSlidders = () => {
  const [uploadedImage, setUploadedImage] = useState("");
  const [modelUpdateId, setModelUpdateId] = useState("");

  const sliddersRef = collection(fireStore, "slidders");
  const db = getFirestore(app);

  const dispatch = useDispatch();
  const slidders = useSelector((state) => state.homeSectionReducer.slidders);

  useEffect(() => {
    dispatch(getSliddersData());
  }, []);

  const addSlidders = async (e) => {
    e.preventDefault();

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
      };
      try {
        addDoc(sliddersRef, Details).then(async (res) => {});
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(getSliddersData());
  };
  const deleteSlidder = async (id) => {
    const docRef = doc(db, "slidders", id.toString());

    deleteDoc(docRef);

    dispatch(getSliddersData());
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
            <TextField
              variant="outlined"
              fullWidth
              accept="image/*"
              type="file"
              // onChange={(e) => setValue("slidder_image", e.target.files[0])}
              required
              name="slidder_image"
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
    </div>
  );
};

export default AdminHomeSctionSlidders;
