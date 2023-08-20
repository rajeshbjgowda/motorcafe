import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import { Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { sendPushNotificationToDeviceTokens } from "../../utils/functions";

const SendNotification = () => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        title: e.target.title.value,
        body: e.target.body.value,
      };

      // sendPushNotificationToDeviceTokens()

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Enter Title"
              variant="outlined"
              required
              fullWidth
              type="text"
              name="title"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              label="Enter Body"
              variant="outlined"
              fullWidth
              required
              type="text"
              name="body"
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
    </div>
  );
};

export default SendNotification;
