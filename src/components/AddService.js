import { LoadingButton } from "@mui/lab";
import { TextField, Typography, Grid, Modal } from "@mui/material";
import { Box } from "@mui/system";
import {
  addDoc,
  collection,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fireStore } from "../containers/firebase";
import { SUPER_ADMIN } from "../utils/constants";
import { uploadFileToFirebase } from "../utils/functions";

const AddService = ({ open, handleClose, updateServiceId, service }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state);
  const [formData, setFormData] = useState({
    service_name: "",
    description: "",
    price: "",
    discount: "",
    advance_price: "",
    duration: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    console.log(updateServiceId, service);
    if (updateServiceId && service) {
      setFormData({
        service_name: service.service_name,
        description: service.description,
        price: service.price,
        discount: service.discount,
        advance_price: service.advance_price,
        duration: service.duration,
      });
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (updateServiceId) {
      const data = {
        service_name: e.target.service_name.value,
        description: e.target.description.value,
        price: e.target.price.value,
        discount: e.target.discount.value,
        advance_price: e.target.advance_price.value,
        duration: e.target.duration.value,
        isActive: true,
      };

      try {
        const images = Object.values(e.target.image.files).map((item) => {
          return uploadFileToFirebase(item);
        });
        const uploadedImages = await Promise.all(images);
        data.images = uploadedImages;
        const serviceRef = doc(
          fireStore,
          "service",
          updateServiceId.toString()
        );
        updateDoc(serviceRef, data);
        setLoading(false);
        handleClose();
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      try {
        const data = {
          service_name: e.target.service_name.value,
          description: e.target.description.value,
          price: Number(e.target.price.value),
          discount: Number(e.target.discount.value),
          advance_price: e.target.advance_price.value,
          duration: e.target.duration.value,
          created_at: Timestamp.fromDate(new Date()),
          isActive: true,
        };
        const images = Object.values(e.target.image.files).map((item) => {
          return uploadFileToFirebase(item);
        });
        const uploadedImages = await Promise.all(images);
        data.images = uploadedImages;
        data[user.userType === SUPER_ADMIN ? "super_admin_id" : "admin_id"] =
          user.userDetails.id;
        const collectionRefService = collection(fireStore, "service");
        await addDoc(collectionRefService, data);

        setLoading(false);
        handleClose();
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
        <Typography sx={{ mb: 2 }} variant="h6">
          CREATE SERVICE
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Plan Title"
                variant="outlined"
                required
                fullWidth
                type="text"
                name="service_name"
                value={formData.service_name}
                onChange={handleChange}
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
                value={formData.description}
                onChange={handleChange}
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
                value={formData.price}
                onChange={handleChange}
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
                value={formData.discount}
                onChange={handleChange}
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
                value={formData.advance_price}
                onChange={handleChange}
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
                value={formData.duration}
                onChange={handleChange}
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
  );
};

export default AddService;
