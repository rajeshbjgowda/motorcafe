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
  getWebServicesData,
} from "../../redux/actions/Homesection";
import { async } from "@firebase/util";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/mui-components/TableComponents";

const WebCarServices = () => {
  const [uploadedImage, setUploadedImage] = useState("");
  const [modelUpdateId, setModelUpdateId] = useState("");

  const sliddersRef = collection(fireStore, "web_car_services");
  const db = getFirestore(app);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const webServices = useSelector(
    (state) => state.homeSectionReducer.webServices
  );

  useEffect(() => {
    dispatch(getWebServicesData());
  }, []);

  const addWebServices = async (data) => {
    let imageUrl = "e";
    if (data.we_services_image) {
      const imageRef = await ref(
        storage,
        `we_services_image/${data.we_services_image.name}`
      );

      await uploadBytes(imageRef, data.we_services_image).then(
        async (snapshot) => {
          await getDownloadURL(snapshot.ref).then((url) => {
            // console.log(typeof url);
            // setUploadedImage(url);
            imageUrl = `${url}`;
          });
        }
      );
    }
    console.log("variable url", imageUrl);

    if (modelUpdateId) {
      const docRef = doc(db, "web_car_services", modelUpdateId);
      let Updatedata = {
        content: data.content,
        heading: data.heading,

        image: imageUrl,
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
      };

      console.log(uploadedImage, "uploadedimage");

      try {
        addDoc(sliddersRef, Details).then(async (res) => {});
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(getWebServicesData());
    reset();
  };
  const deleteSlidder = async (id) => {
    const docRef = doc(db, "web_car_services", id.toString());

    deleteDoc(docRef);

    dispatch(getWebServicesData());
  };
  console.log(webServices);
  return (
    <div>
      <form onSubmit={handleSubmit(addWebServices)}>
        <Grid container spacing={2}>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Heading"
              variant="outlined"
              fullWidth
              {...register("heading")}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter COntent"
              variant="outlined"
              fullWidth
              {...register("content")}
            />
          </Grid>

          <Grid item xs={6}>
            <Button variant="contained" component="label">
              Upload
              <input
                {...register("we_services_image")}
                hidden
                accept="image/*"
                type="file"
                onChange={(e) =>
                  setValue("we_services_image", e.target.files[0])
                }
              />
            </Button>
          </Grid>
        </Grid>

        <div className="btnContainer">
          <Button variant="contained" color="warning">
            reset
          </Button>
          <Button variant="contained" color="primary" type="submit">
            add services{" "}
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
                        src={service.image}
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
    </div>
  );
};

export default WebCarServices;
