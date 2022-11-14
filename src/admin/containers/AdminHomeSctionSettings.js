import React from "react";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const AdminHomeSctionSettings = () => {
  return (
    <div>
      <FormControl component="fieldset">
        <FormLabel component="legend">HOME SECTION</FormLabel>
        <FormGroup aria-label="position" row>
          <FormControlLabel
            value="start"
            control={<Switch color="primary" />}
            label="Slider Section"
            labelPlacement="start"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
};

export default AdminHomeSctionSettings;
