import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Box from "@mui/material/Box";
import {
  Modal,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { fireStore } from "../containers/firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { StyledTableCell } from "./mui-components/TableComponents";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";

const AddServicesToPlan = ({ handleClose, open, plan, service_list }) => {
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState("");
  const [addedServices, setAddedServices] = useState([]);

  const handleChange = (e) => {
    setService(e.target.value);
  };


  const handleAddServiceToPlan = async (e) => {
    setLoading(true);
    e.preventDefault();
    const planRef = doc(fireStore, "plan", plan.id);

    try {
      await updateDoc(planRef, {
        services: arrayUnion(service),
      });
      setLoading(false);
      handleClose();
    } catch (err) {
      setLoading(false);
      handleClose();
    }
  };

  useEffect(() => {
    let services = Object.keys(service_list).filter(
      (item) => !plan.services.includes(item)
    );
    setAddedServices([...services]);
  }, []);

  const handleDeleteServiceInPlan = async (removingService) => {
    const planRef = doc(fireStore, "plan", plan.id);

    try {
      await updateDoc(planRef, {
        services: arrayRemove(removingService),
      });
      setLoading(false);
      handleClose();
    } catch (err) {
      setLoading(false);
      handleClose();
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
          minWidth: 800,
          maxHeight: "95vh",
          overflowY: "auto",
        }}
      >
        <Typography sx={{ mb: 2 }} variant="h6">
          ADD SERVICE
        </Typography>
        <form onSubmit={handleAddServiceToPlan}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Add Service To Plan
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={service}
                label="Add Service To Plan"
                onChange={handleChange}
              >
                {addedServices.map((service) => {
                  return (
                    <MenuItem value={service} key={service}>
                      {service_list[service].service_name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
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

        <div className="tableContainer">
          <TableContainer component={Paper}>
            <Table
              aria-label="customized table"
              sx={{ minWidth: 650, overflowX: "scroll" }}
            >
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Sl.No</StyledTableCell>
                  <StyledTableCell align="center">Service Name</StyledTableCell>
                  <StyledTableCell align="center">Price</StyledTableCell>
                  <StyledTableCell align="center">discount</StyledTableCell>
                  <StyledTableCell align="center">duration</StyledTableCell>
                  <StyledTableCell align="center">
                    advance_price
                  </StyledTableCell>

                  <StyledTableCell align="center">Delete</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plan.services &&
                  plan.services.map((service, index) => {
                    return (
                      <TableRow key={service.id}>
                        <StyledTableCell align="center">
                          {index + 1}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {service_list[service].service_name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {service_list[service].price}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {service_list[service].discount}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {service_list[service].duration}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {service_list[service].advance_price}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          <Button
                            variant="contained"
                            color="warning"
                            onClick={() => handleDeleteServiceInPlan(service)}
                          >
                            {" "}
                            Delte
                          </Button>
                        </StyledTableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </Modal>
  );
};

export default AddServicesToPlan;
