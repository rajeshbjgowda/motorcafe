import React, { useEffect, useState } from "react";
import "../styles/adminVehicleModal.scss";
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { PunchClock } from "@mui/icons-material";
import { fireStore } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { async } from "@firebase/util";
import { useDispatch, useSelector } from "react-redux";
import { StyledTableCell } from "../../components/mui-components/TableComponents";
import { getVehicleCompanyData } from "../../redux/actions/AdminVehicleCompany";
import Grid from "@mui/material/Grid";
import { getVehicleModalData } from "../../redux/actions/AdminVehicleModal";
import { getComparator, stableSort } from "../../utils/sorting Functions";
import EnhancedTableHead from "../../components/mui-components/EnhancedTableHead";
import { vehicleModalheadCells } from "../../utils/TableHeadContsants";
import TablePagination from "@mui/material/TablePagination";

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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const DEFAULT_ORDER = "asc";
const DEFAULT_ORDER_BY = "company_name";
const DEFAULT_ROWS_PER_PAGE = 5;
const AdmicVehicleModal = () => {
  const [open, setOpen] = React.useState(false);
  const [disable, setDisable] = React.useState(false);

  const [companyName, setCompanyName] = React.useState("");

  const [vehicleModal, setVehicleModal] = useState("");
  const [variant, setVariant] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const [modelUpdateId, setModelUpdateId] = useState("");
  const vehicleModalRef = collection(fireStore, "vehicleModel");
  //sorting state

  const [selected, setSelected] = useState([]);
  const [order, setOrder] = React.useState("");
  const [dateSort, setDateSort] = React.useState(false);
  const [numericSort, setNumbericSort] = React.useState(false);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState("");
  const [visibleRows, setVisibleRows] = React.useState(null);

  const { vehicleCompanies } = useSelector(
    (state) => state.adminVehicleCompanyReducer
  );
  const { vehicleModals, loading, error } = useSelector(
    (state) => state.adminVehicleModal
  );

  const dispatch = useDispatch();
  const handleChange = (event) => {
    setCompanyName(event.target.value);
  };

  useEffect(() => {
    dispatch(getVehicleCompanyData());
    dispatch(getVehicleModalData());
  }, []);

  useEffect(() => {
    let rowsOnMount = stableSort(
      vehicleModals,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY)
    );
    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    );
    setVisibleRows(rowsOnMount);
  }, [vehicleModals]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddModel = async (e) => {
    e.preventDefault();

    setDisable(true);
    if (modelUpdateId) {
      const docRef = doc(fireStore, "vehicleModel", modelUpdateId);
      let data = {
        updatedAt: Timestamp.fromDate(new Date()),
        company_name: vehicleModal,
      };

      await updateDoc(docRef, data)
        .then((docRef) => {
          console.log("Value of an Existing Document Field has been updated");
        })
        .catch((error) => {
          console.log(error);
        });
      setDisable(false);
    } else {
      const Details = {
        created_at: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
        company_name: companyName,
        fuel_type: fuelType,
        variant: variant,
        vehicle_modal: vehicleModal,
        vehicle_type: vehicleType,
      };

      try {
        await addDoc(vehicleModalRef, Details);
      } catch (error) {
        console.log(error);
      }
      setDisable(false);
    }
    handleClose();
    dispatch(getVehicleCompanyData());
    dispatch(getVehicleModalData());
    setModelUpdateId("");
  };

  const handleUpdate = (company) => {
    setModelUpdateId(company.id);
    // setVehicleCompany(company.company_name);
    handleOpen();
  };
  const handleDelete = async (id) => {
    // const docRef = doc(fireStore, "vehicleModel", id.toString());
    // try {
    //   await deleteDoc(docRef);
    //   dispatch(getVehicleCompanyData());
    // } catch (err) {
    //   //
    // }
  };

  const handleActiveState = async (e, id) => {
    const modalRef = await doc(fireStore, "vehicleModel", id.toString());

    let data = {
      isActive: e.target.checked,
    };
    await updateDoc(modalRef, data);
    await dispatch(getVehicleModalData());
  };

  const handleChangePage = React.useCallback((event, newPage) => {
    setPage(newPage);

    const sortedRows = stableSort(
      vehicleModals,
      getComparator(order, orderBy, dateSort, numericSort),
      dateSort
    );
    const updatedRows = sortedRows.slice(
      newPage * rowsPerPage,
      newPage * rowsPerPage + rowsPerPage
    );

    setVisibleRows(updatedRows);

    // Avoid a layout jump when reaching the last page with empty rows.
    const numEmptyRows =
      newPage > 0
        ? Math.max(0, (1 + newPage) * rowsPerPage - vehicleModals.length)
        : 0;
  }, []);

  const handleChangeRowsPerPage = React.useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);
      setPage(0);
      const sortedRows = stableSort(
        vehicleModals,
        getComparator(order, orderBy, dateSort, numericSort),
        dateSort
      );
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage
      );
      setVisibleRows(updatedRows);
      // There is no layout jump to handle on the first page.
    },
    [order, orderBy]
  );

  const handleRequestSort = React.useCallback(
    (event, newOrderBy, dateSort, numeric) => {
      setDateSort(dateSort);
      setNumbericSort(numeric);
      const isAsc = orderBy === newOrderBy && order === "asc";
      const toggledOrder = isAsc ? "desc" : "asc";
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const sortedRows = stableSort(
        vehicleModals,
        getComparator(toggledOrder, newOrderBy, dateSort, numeric),
        dateSort
      );
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );

      setVisibleRows(updatedRows);
    },
    [order, orderBy, page, rowsPerPage]
  );

  return (
    <div className="serviceplanContainer">
      <h1>VEHICAL COMPANIES</h1>
      <div>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          create
        </Button>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "50px",
          }}
        >
          <CircularProgress style={{ height: 80, width: 80 }} />
        </div>
      ) : (
        <div className="tableContainer">
          <TableContainer component={Paper}>
            <Table
              aria-label="customized table"
              sx={{ minWidth: 650, overflowX: "scroll" }}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={vehicleModals.length}
                headCells={vehicleModalheadCells}
              />
              <TableBody>
                {visibleRows &&
                  visibleRows.map((modal, index) => (
                    <StyledTableRow key={modal.id}>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {modal.company_name}
                        {/* {company.company_name} */}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {modal.vehicle_modal}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {modal.variant}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {modal.fuel_type}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {modal.vehicle_type}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {new Date(
                          modal?.created_at?.seconds * 1000
                        ).toLocaleString()}
                      </StyledTableCell>{" "}
                      <StyledTableCell align="center">
                        {new Date(
                          modal?.updatedAt?.seconds * 1000
                        ).toLocaleString()}
                      </StyledTableCell>{" "}
                      <StyledTableCell
                        align="center"
                        onClick={() => handleUpdate(modal)}
                      >
                        <Button variant="contained">Edit</Button>
                      </StyledTableCell>{" "}
                      {/* <StyledTableCell align="center">
                        <Button
                          onClick={() => handleDelete(company.id)}
                          variant="contained"
                          color="error"
                        >
                          delete
                        </Button>
                      </StyledTableCell> */}
                      <StyledTableCell align="center">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={modal.isActive ? true : false}
                              onChange={(e) => handleActiveState(e, modal.id)}
                              name="vehicle_cmpany_state"
                            />
                          }
                          label={modal.isActive ? "active" : "deactive"}
                        />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={vehicleModals.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          <div className="addPlanContainer">
            <div className="heading">
              <h3>CREATE VEHICLE MODAL</h3>
            </div>

            <form onSubmit={handleAddModel}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Company Name
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={companyName}
                      label="Company Name"
                      onChange={(e) => setCompanyName(e.target.value)}
                    >
                      {vehicleCompanies &&
                        vehicleCompanies.map((company) => (
                          <MenuItem key={company.id} value={company.id}>
                            {company.company_name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <div className="planFeildContainer">
                    <div>
                      <TextField
                        id="outlined-basic"
                        label="Enter Vehicle Modal"
                        variant="outlined"
                        fullWidth
                        required
                        value={vehicleModal}
                        onChange={(e) => setVehicleModal(e.target.value)}
                      />
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <div className="planFeildContainer">
                    <div>
                      <TextField
                        id="outlined-basic"
                        label="Enter Modal variant"
                        variant="outlined"
                        fullWidth
                        required
                        value={variant}
                        onChange={(e) => setVariant(e.target.value)}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Fuel Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={fuelType}
                      label="Fuel Type"
                      onChange={(e) => setFuelType(e.target.value)}
                    >
                      <MenuItem value={"diesel"}>Diesel</MenuItem>
                      <MenuItem value={"petrol"}>Petrol</MenuItem>
                      <MenuItem value={"CNG"}>CNG</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Vehicle Type
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={vehicleType}
                      label="Fuel Type"
                      onChange={(e) => setVehicleType(e.target.value)}
                    >
                      <MenuItem value={"car"}>Car</MenuItem>
                      <MenuItem value={"bike"}>Bike</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <div className="btnContainer">
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleClose}
                >
                  cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={disable}
                >
                  add model{" "}
                </Button>
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdmicVehicleModal;
