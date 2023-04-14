import { LoadingButton } from "@mui/lab";
import { Grid, Modal, TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { fireStore } from "../containers/firebase";
import { SUPER_ADMIN } from "../utils/constants";
import { uploadFileToFirebase } from "../utils/functions";

const CreatePlanModal = ({ open, handleClose, updateId }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (updateId) {
      console.log("S");

      try {
        const data = {
          field_name: e.target.field_name.value,
          description: e.target.description.value,
          updated_at: Timestamp.fromDate(new Date()),
        };
        const image_url = await uploadFileToFirebase(e.target.image.files[0]);
        data.image_url = image_url;
        data[user.userType === SUPER_ADMIN ? "super_admin_id" : "admin_id"] =
          user.userDetails.id;

        const collectionRef = doc(fireStore, "plan", updateId);

        await updateDoc(collectionRef, data);
        setLoading(false);
        handleClose();
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      try {
        const data = {
          field_name: e.target.field_name.value,
          description: e.target.description.value,
          created_at: Timestamp.fromDate(new Date()),
          updated_at: Timestamp.fromDate(new Date()),
          services: [],
        };
        const image_url = await uploadFileToFirebase(e.target.image.files[0]);
        data.image_url = image_url;
        data[user.userType === SUPER_ADMIN ? "super_admin_id" : "admin_id"] =
          user.userDetails.id;
        const collectionRef = collection(fireStore, "plan");
        await addDoc(collectionRef, data);
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
          CREATE PLAN
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
                name="field_name"
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

export default CreatePlanModal;
