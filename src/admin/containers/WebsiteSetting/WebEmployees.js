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
  getWebEmployeesData,
  getWebServicesData,
} from "../../redux/actions/Homesection";
import { async } from "@firebase/util";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../components/mui-components/TableComponents";

const WebEmployees = () => {
  const [uploadedImage, setUploadedImage] = useState("");
  const [modelUpdateId, setModelUpdateId] = useState("");

  const WebEmployeesRf = collection(fireStore, "web_employers");
  const db = getFirestore(app);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const dispatch = useDispatch();
  const employees = useSelector((state) => state.homeSectionReducer.employees);

  useEffect(() => {
    dispatch(getWebEmployeesData());
  }, []);

  const addWebServices = async (data) => {
    let imageUrl = "";

    const {
      destination,
      facebook_link,
      insta_link,
      linkedIn_link,
      name,
      twitter_link,
    } = data;
    if (data.web_employes_image) {
      const imageRef = await ref(
        storage,
        `web_employers/${data.web_employes_image.name}`
      );

      await uploadBytes(imageRef, data.web_employes_image).then(
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
      const docRef = doc(db, "web_employers", modelUpdateId);
      let Updatedata = {
        destination,
        facebook_link,
        insta_link,
        linkedIn_link,
        name,
        twitter_link,

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
        destination,
        facebook_link,
        insta_link,
        linkedIn_link,
        name,
        twitter_link,
        image: imageUrl,
      };

      console.log(uploadedImage, "uploadedimage");

      try {
        addDoc(WebEmployeesRf, Details).then(async (res) => {});
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(getWebEmployeesData());
    reset();
  };
  const deleteSlidder = async (id) => {
    const docRef = doc(db, "web_employers", id.toString());

    deleteDoc(docRef);

    dispatch(getWebEmployeesData());
  };
  console.log(employees);
  return (
    <div>
      <form onSubmit={handleSubmit(addWebServices)}>
        <Grid container spacing={2}>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Employee name"
              variant="outlined"
              fullWidth
              {...register("name")}
            />
          </Grid>
          <Grid item xs={6} style={{ marginTop: "15px" }}>
            <TextField
              id="outlined-basic"
              label="Enter Destination"
              variant="outlined"
              fullWidth
              {...register("destination")}
            />
          </Grid>

          <Grid item xs={6}>
            <Button variant="contained" component="label">
              Upload
              <input
                {...register("web_employes_image")}
                hidden
                accept="image/*"
                type="file"
                onChange={(e) =>
                  setValue("web_employes_image", e.target.files[0])
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
                      {employe.name}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {employe.destination}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <img
                        src={employe.image}
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
    </div>
  );
};

export default WebEmployees;
