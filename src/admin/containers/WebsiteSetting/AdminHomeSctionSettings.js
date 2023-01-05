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
import { getSliddersData } from "../../redux/actions/Homesection";
import { async } from "@firebase/util";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/mui-components/TableComponents";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatch = useDispatch();
  const slidders = useSelector((state) => state.homeSectionReducer.slidders);

  useEffect(() => {
    dispatch(getSliddersData());
  }, []);

  const addSlidders = async (data) => {
    console.log(data.slidder_image.name);

    let imageUrl = "";
    if (data.slidder_image) {
      const imageRef = await ref(
        storage,
        `slidder_images/${data.slidder_image.name}`
      );

      await uploadBytes(imageRef, data.slidder_image).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((url) => {
          // console.log(typeof url);
          // setUploadedImage(url);
          imageUrl = `${url}`;
        });
      });
    }
    console.log("variable url", imageUrl);

    if (modelUpdateId) {
      const docRef = doc(db, "slidders", modelUpdateId);
      let Updatedata = {
        content: data.content,
        heading: data.heading,

        image: imageUrl,
        sub_heading: data.sub_heading,
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
        content: data.content,
        heading: data.heading,
        image: imageUrl,
        sub_heading: data.sub_heading,
      };

      console.log(Details, "uploadedimage");

      try {
        addDoc(sliddersRef, Details).then(async (res) => {});
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(getSliddersData());
    reset();
  };
  const deleteSlidder = async (id) => {
    const docRef = doc(db, "slidders", id.toString());

    deleteDoc(docRef);

    dispatch(getSliddersData());
  };
  console.log(slidders);
  return (
    <div>
      <form onSubmit={handleSubmit(addSlidders)}>
        <Grid container spacing={2}>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Heading"
              variant="outlined"
              fullWidth
              {...register("heading")}
              error={errors.heading}
              helperText={errors.heading?.message}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter SubHeading"
              variant="outlined"
              fullWidth
              {...register("sub_heading")}
              error={errors.sub_heading}
              helperText={errors.sub_heading?.message}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter COntent"
              variant="outlined"
              fullWidth
              {...register("content")}
              error={errors.content}
              helperText={errors.content?.message}
            />
          </Grid>

          <Grid item xs={6}>
            <Button variant="contained" component="label">
              Upload
              <input
                {...register("slidder_image")}
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => setValue("slidder_image", e.target.files[0])}
              />
            </Button>
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
