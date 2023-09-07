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
import Alert from "@mui/material/Alert";
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
import { getComparator, stableSort } from "../../utils/sorting Functions";
import EnhancedTableHead from "../../components/mui-components/EnhancedTableHead";
import { vehicleCompanyheadCells } from "../../utils/TableHeadContsants";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
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
const AdmicVehicleCompany = () => {
  const [open, setOpen] = React.useState(false);
  const [disable, setDisable] = React.useState(false);

  const [companyName, setCompanyName] = React.useState("");
  const [vehicleCompany, setVehicleCompany] = useState("");
  const [vehicalModelList, setVehicalModelList] = useState([]);
  const [modelUpdateId, setModelUpdateId] = useState("");
  const vehicleCompanyRef = collection(fireStore, "vehicle_company");

  //sorting state
  const [selected, setSelected] = useState([]);

  const [order, setOrder] = React.useState("");
  const [dateSort, setDateSort] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [visibleRows, setVisibleRows] = React.useState(null);

  const { loading, error, vehicleCompanies } = useSelector(
    (state) => state.adminVehicleCompanyReducer
  );

  const dispatch = useDispatch();
  const handleChange = (event) => {
    setCompanyName(event.target.value);
  };

  useEffect(() => {
    dispatch(getVehicleCompanyData());
  }, []);

  useEffect(() => {
    let rowsOnMount = stableSort(
      vehicleCompanies,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY)
    );
    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    );
    setVisibleRows(rowsOnMount);
  }, [vehicleCompanies]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleAddModel = async () => {
    setDisable(true);
    if (modelUpdateId) {
      const docRef = doc(fireStore, "vehicle_company", modelUpdateId);
      let data = {
        updatedAt: Timestamp.fromDate(new Date()),
        company_name: vehicleCompany,
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
        company_name: vehicleCompany,
      };

      try {
        await addDoc(vehicleCompanyRef, Details);
      } catch (error) {
        console.log(error);
      }
      setDisable(false);
    }
    handleClose();
    dispatch(getVehicleCompanyData());
    setModelUpdateId("");
  };

  const handleUpdate = (company) => {
    setModelUpdateId(company.id);
    setVehicleCompany(company.company_name);
    handleOpen();
  };
 

  const handleActiveState = async (e, id) => {
    const cmpanyRef = doc(fireStore, "vehicle_company", id.toString());

    let data = {
      isActive: e.target.checked,
    };
    await updateDoc(cmpanyRef, data);
    dispatch(getVehicleCompanyData());
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log(
      "handlePage",
      newPage,
      stableSort(
        vehicleCompanies,
        getComparator(order, orderBy, dateSort),
        dateSort
      )
    );
    const sortedRows = stableSort(
      vehicleCompanies,
      getComparator(order, orderBy, dateSort),
      dateSort
    );
    console.log("handlePage1", vehicleCompanies, sortedRows);

    const updatedRows = sortedRows.slice(
      newPage * rowsPerPage,
      newPage * rowsPerPage + rowsPerPage
    );
    console.log("sortedRows", sortedRows);
    setVisibleRows(updatedRows);

    const numEmptyRows =
      newPage > 0
        ? Math.max(0, (1 + newPage) * rowsPerPage - vehicleCompanies.length)
        : 0;
  };

  const handleChangeRowsPerPage = React.useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);
      setPage(0);
      const sortedRows = stableSort(
        vehicleCompanies,
        getComparator(order, orderBy, dateSort),
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
    (event, newOrderBy, dateSort) => {
      setDateSort(dateSort);
      const isAsc = orderBy === newOrderBy && order === "asc";
      const toggledOrder = isAsc ? "desc" : "asc";
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const sortedRows = stableSort(
        vehicleCompanies,
        getComparator(toggledOrder, newOrderBy, dateSort),
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
      ) : error && vehicleCompanies.length === 0 ? (
        <Alert severity="warning">No Data Found</Alert>
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
                rowCount={vehicleCompanies.length}
                headCells={vehicleCompanyheadCells}
              />
              <TableBody>
                {visibleRows &&
                  visibleRows.map((company, index) => (
                    <StyledTableRow key={company.id}>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {company.company_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {new Date(
                          company?.created_at?.seconds * 1000
                        ).toLocaleString()}
                      </StyledTableCell>{" "}
                      <StyledTableCell align="center">
                        {new Date(
                          company?.updatedAt?.seconds * 1000
                        ).toLocaleString()}
                      </StyledTableCell>{" "}
                      <StyledTableCell
                        align="center"
                        onClick={() => handleUpdate(company)}
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
                              checked={company.isActive ? true : false}
                              onChange={(e) => handleActiveState(e, company.id)}
                              name="vehicle_cmpany_state"
                            />
                          }
                          label={company.isActive ? "active" : "deactive"}
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
            count={vehicleCompanies.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, ty) => {
              console.log("handleChangePage");
              handleChangePage(e, ty);
            }}
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
              <h3>CREATE VEHICLE COMPANY</h3>
            </div>
            <div className="planFeildContainer">
              <div>
                <TextField
                  id="outlined-basic"
                  label="Company Name"
                  variant="outlined"
                  fullWidth
                  required
                  value={vehicleCompany}
                  onChange={(e) => setVehicleCompany(e.target.value)}
                />
              </div>
            </div>
            <div className="btnContainer">
              <Button variant="contained" color="warning" onClick={handleClose}>
                cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddModel}
                disabled={disable}
              >
                add model{" "}
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AdmicVehicleCompany;
