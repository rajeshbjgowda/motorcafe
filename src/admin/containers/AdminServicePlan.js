import React, { useEffect, useMemo, useState } from "react";
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
import Grid from "@mui/material/Grid";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { app, fireStore, storage } from "./firebase";
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
  StyledTableCell,
  StyledTableRow,
} from "../components/mui-components/TableComponents";
import { useDispatch } from "react-redux";
import { getServicePlanData } from "../redux/actions/serviceplan";
import { useSelector } from "react-redux";
import { getServicePlanPriceData } from "../redux/actions/serviceplanprice";
import { useForm } from "react-hook-form";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { setNestedObjectValues } from "formik";
import { FormHelperText } from "@mui/material";
import { SUPPORTED_FORMATS } from "../components/yupValidation/imageValidation";

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
const schema = yup.object().shape({
  plan: yup.string().required("reqired"),
  plan_price: yup
    .number("please enter numbers only")
    .typeError("please enter value")
    .positive("please enter positive numbers")
    .required("please enter value"),
  plan_discount: yup
    .number("please enter numbers only")
    .typeError("please enter value")
    .positive("please enter positive numbers"),
  plan_advance: yup
    .number("please enter numbers only")
    .typeError("please enter value")
    .positive("please enter positive numbers"),
  plan_duration: yup.string(),
  img_url: yup
    .mixed()
    .test("required", "You need to provide a file", (value) => {
      console.log("rajesh", value);
      return value && value.length;
    })
    .test("fileSize", "The file is too large", (value, context) => {
      return value && value[0] && value[0].size <= 200000;
    })
    .test("type", "We only support jpeg", function (value) {
      return value && value[0] && SUPPORTED_FORMATS.includes(value[0].type);
    }),
});

const schema_update = yup.object().shape({
  update_plan: yup.string().required("reqired"),
});
const add_schema = yup.object().shape({
  add_service: yup.string().required("reqired"),
  service_img_url: yup
    .mixed()
    .test(2000, "File is too large", (value) => value.size <= 2000)
    .test("fileType", "Your Error Message", (value) =>
      SUPPORTED_FORMATS.includes(value.type)
    ),
});

const AdminServicePlan = () => {
  const [open, setOpen] = useState(false);
  const [serviceIncludeOpen, setServiceIncludeOpen] = useState(false);

  const [includedServices, setIncludedServices] = useState([]);

  const [addServiceToPlan, setAddServicePlan] = useState("");
  const [modelUpdateId, setModelUpdateId] = useState("");
  const [planId, setPlanId] = useState("");
  const [serviceID, setServiceId] = useState("");

  const [serviceImage, setServiceImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const planRef = collection(fireStore, "plan");
  const servicesRef = collection(fireStore, "service");
  const db = getFirestore(app);

  const dispatch = useDispatch();

  const servicePlans = useSelector(
    (state) => state.servicePlanReducer.service_plans
  );
  const includedServicesList = useSelector(
    (state) => state.servicePlanPriceReducer.service_plans_prices
  );

  const admin = useSelector((state) => state.authUserReducer.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    register: register1,
    handleSubmit: handleUpdateValues,
    formState: { errors: updateErrors },
    setValue: setValue2,
  } = useForm({
    resolver: yupResolver(schema_update),
  });

  const {
    register: register2,
    handleSubmit: handleAddServices,
    formState: { errors: serviceErrors },
    setValue: setValue3,
  } = useForm({
    resolver: yupResolver(add_schema),
  });
  const createServiceDocument = (data, id) => {
    const Details = {
      advance_price: data.plan_advance,
      discount: data.plan_discount,
      duration: data.plan_duration,
      images: [],
      plan_id: id,

      price: data.plan_price,

      service_include: [],
      service_name: data.plan,
    };

    try {
      let response = addDoc(servicesRef, Details);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddPlans = async (data) => {
    console.log("error");
    console.log("data.img_url", data.img_url);
    if (data.img_url) {
      console.log("DDD");
      const imageRef = await ref(storage, `images/${data.img_url.name}`);
      await uploadBytes(imageRef, data.img_url).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          console.log(url);
          setUploadedImage(url);
        });
      });
    }

    if (modelUpdateId) {
      console.log("error");
      const docRef = doc(db, "plan", modelUpdateId);
      let Updatedata = {
        field_name: data.plan,

        updated_at: new Date().toUTCString(),
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
        field_name: data.plan,
        created_at: new Date().toUTCString(),
        updated_at: new Date().toUTCString(),
        img_url: uploadedImage,
        adminId: admin.id,
      };

      try {
        addDoc(planRef, Details).then(async (res) => {
          await createServiceDocument(data, res.id);
        });
      } catch (error) {
        console.log(error);
      }
    }
    dispatch(getServicePlanData());
    handleClose();

    setModelUpdateId("");
  };

  useEffect(() => {
    dispatch(getServicePlanData());

    dispatch(getServicePlanPriceData());
  }, []);

  useEffect(() => {
    setIncludedServices(includedServicesList[planId]);
  }, [includedServicesList]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setModelUpdateId("");
  };
  const handleOpenServiceIncludeModal = (id) => {
    setPlanId(id);
    setServiceId(includedServicesList[id].id);
    setServiceIncludeOpen(true);

    setIncludedServices(includedServicesList[id]);
  };
  const handleCloseServiceIncludeModal = () => {
    setServiceIncludeOpen(false);
  };

  const handleUpdate = (id) => {
    setModelUpdateId(id);
    handleOpen();
  };
  const handleDelete = async (id) => {
    const docRef = doc(db, "plan", id.toString());

    deleteDoc(docRef);

    let serviceId = includedServicesList[id].id;
    const serviceRef = doc(db, "service", serviceId.toString());
    deleteDoc(serviceRef);
    dispatch(getServicePlanData());
  };
  const addServicesToPlan = async (data) => {
    const docRef = doc(db, "service", serviceID);
    let service_image;
    if (data.service_img_url) {
      console.log("DDD");

      const imageRef = await ref(
        storage,
        `service_images/${data.service_img_url.name}`
      );
      await uploadBytes(imageRef, data.service_img_url).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setServiceImage(url);
        });
      });
    }

    console.log(service_image);

    await updateDoc(docRef, {
      images: arrayUnion(serviceImage),
      service_include: arrayUnion(data.add_service),
      // removes "1" from the array
    });
    await dispatch(getServicePlanPriceData());

    setAddServicePlan("");
  };

  const deleteServiceInPlan = async (service, index) => {
    const docRef = doc(db, "service", serviceID);
    console.log(index, "delete functin");
    try {
      await updateDoc(docRef, {
        service_include: arrayRemove(service), // removes "1" from the array
      });
    } catch (error) {
      console.log(error);
    }

    dispatch(getServicePlanPriceData());
  };

  const handleuUpdatePlans = async (data) => {
    alert("enetrtng to updation");
    if (modelUpdateId) {
      console.log("error");
      const docRef = doc(db, "plan", modelUpdateId);
      let Updatedata = {
        field_name: data.update_plan,

        updated_at: new Date().toUTCString(),
      };

      await updateDoc(docRef, Updatedata)
        .then((docRef) => {
          console.log("Value of an Existing Document Field has been updated");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    dispatch(getServicePlanData());
    handleClose();

    setModelUpdateId("");
  };
  return (
    <div className="serviceplanContainer">
      <h1>SERVICE PLAN</h1>
      <div>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          add plan
        </Button>
      </div>
      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table
            aria-label="customized table"
            sx={{ minWidth: 650, overflowX: "scroll" }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sl.No</StyledTableCell>
                <StyledTableCell align="center">Service Plan</StyledTableCell>
                <StyledTableCell align="center">Services</StyledTableCell>
                <StyledTableCell align="center">Created AT</StyledTableCell>
                <StyledTableCell align="center">UpdatedAt</StyledTableCell>
                <StyledTableCell align="center">Edit</StyledTableCell>
                <StyledTableCell align="center">Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicePlans &&
                servicePlans.map((servicePlan, index) => (
                  <StyledTableRow key={servicePlan.id}>
                    <StyledTableCell align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {servicePlan.field_name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => {
                          handleOpenServiceIncludeModal(servicePlan.id);
                        }}
                      >
                        services include
                      </Button>
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      {servicePlan.created_at}
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      {servicePlan.updated_at}
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => handleUpdate(servicePlan.id)}
                      >
                        Edit
                      </Button>
                    </StyledTableCell>{" "}
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(servicePlan.id)}
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="addPlanContainer">
            <div className="heading">
              <h3>CREATE SERVICEs PLAN</h3>
            </div>

            {modelUpdateId ? (
              <form onSubmit={handleUpdateValues(handleuUpdatePlans)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <div className="planFeildContainer">
                      <TextField
                        id="outlined-basic"
                        label="Enter Plan"
                        variant="outlined"
                        fullWidth
                        {...register1("update_plan")}
                        error={updateErrors?.update_plan}
                        helperText={updateErrors?.update_plan?.message}
                      />
                    </div>
                  </Grid>
                </Grid>
                <div className="btnContainer">
                  <Button variant="contained" color="primary" type="submit">
                    Update plan{" "}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit(handleAddPlans)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <div className="planFeildContainer">
                      <TextField
                        id="outlined-basic"
                        label="Enter Plan"
                        variant="outlined"
                        fullWidth
                        {...register("plan")}
                        error={errors.plan}
                        helperText={errors.plan?.message}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="planFeildContainer">
                      <TextField
                        id="outlined-basic"
                        label="Enter Price"
                        variant="outlined"
                        fullWidth
                        {...register("plan_price")}
                        error={errors.plan_price}
                        helperText={errors.plan_price?.message}
                      />
                    </div>
                  </Grid>{" "}
                  <Grid item xs={6}>
                    <div className="planFeildContainer">
                      <TextField
                        id="outlined-basic"
                        label="Enter Discount"
                        variant="outlined"
                        fullWidth
                        {...register("plan_discount")}
                        error={errors.plan_discount}
                        helperText={errors.plan_discount?.message}
                      />
                    </div>
                  </Grid>{" "}
                  <Grid item xs={6}>
                    <div className="planFeildContainer">
                      <TextField
                        id="outlined-basic"
                        label="Enter Advance Amount"
                        variant="outlined"
                        fullWidth
                        {...register("plan_advance")}
                        error={errors.plan_advance}
                        helperText={errors.plan_advance?.message}
                      />
                    </div>
                  </Grid>{" "}
                  <Grid item xs={6}>
                    <div className="planFeildContainer">
                      <TextField
                        id="outlined-basic"
                        label="Enter Duration in hours"
                        variant="outlined"
                        fullWidth
                        {...register("plan_duration")}
                        error={errors.plan_duration}
                        helperText={errors.plan_duration?.message}
                      />
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <Button variant="contained" component="label">
                      Upload
                      <input
                        {...register("img_url")}
                        hidden
                        accept="image/*"
                        
                        type="file"
                        onChange={(e) => {
                          setValue("img_url", e.target.files[0]);
                          console.log("rajesh", errors, e.target.files);
                        }}
                        aria-describedby="upload_helper_text"
                      />
                    </Button>
                    <FormHelperText
                      id="upload_helper_text"
                      error={errors.img_url}
                    >
                      {" "}
                      {errors.img_url?.message}
                    </FormHelperText>
                  </Grid>
                </Grid>
                <div className="btnContainer">
                  <Button variant="contained" color="warning">
                    reset
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    add plan{" "}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <span></span>
        </Box>
      </Modal>

      <Modal
        open={serviceIncludeOpen}
        onClose={handleCloseServiceIncludeModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="addPlanContainer">
            <div className="heading">
              <h3>SERVICE PLANS </h3>
            </div>
            <div className="serviceIncludeContainer">
              <div className="tableContainer">
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">Sl.No</StyledTableCell>
                      <StyledTableCell align="center">Service </StyledTableCell>
                      <StyledTableCell align="center">Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {includedServices &&
                      includedServices.service_include &&
                      includedServices.service_include.map((service, index) => (
                        <StyledTableRow key={service}>
                          <StyledTableCell align="center">
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {service}
                          </StyledTableCell>

                          <StyledTableCell align="center">
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() =>
                                deleteServiceInPlan(service, index)
                              }
                            >
                              delete
                            </Button>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <form onSubmit={handleAddServices(addServicesToPlan)}>
                <Grid container spacing={2}>
                  <Grid item xs={9} style={{ marginTop: "15px" }}>
                    <TextField
                      id="outlined-basic"
                      label="Add Services"
                      variant="outlined"
                      fullWidth
                      {...register2("add_service")}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <Button variant="contained" component="label">
                      Upload
                      <input
                        {...register2("service_img_url")}
                        hidden
                        accept="image/*"
                        type="file"
                        onChange={(e) => {
                          setValue3("service_img_url", e.target.files[0]);
                        }}
                      />
                    </Button>
                    <FormHelperText
                      id="upload_helper_text"
                      error={serviceErrors.service_img_url}
                    >
                      {" "}
                      {serviceErrors.service_img_url?.message}
                    </FormHelperText>
                  </Grid>
                </Grid>

                <div className="btnContainer">
                  <Button variant="contained" color="warning">
                    reset
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    add service{" "}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdminServicePlan;
