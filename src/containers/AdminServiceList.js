import React, { useEffect, useState } from "react";
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
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import {
  StyledTableCell,
  StyledTableRow,
} from "../components/mui-components/TableComponents";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getServicePlanPriceData } from "../redux/actions/serviceplanprice";
import { deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "./firebase";
import Grid from "@mui/material/Grid";
import { useForm } from "react-hook-form";
import { async } from "@firebase/util";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { getServiceListData } from "../redux/actions/AdminServiceList";
import AddService from "../components/AddService";
import EnhancedTableHead from "../components/mui-components/EnhancedTableHead";
import {
  convertObjToArray,
  getComparator,
  stableSort,
} from "../utils/sorting Functions";
import { serviceListheadCells } from "../utils/TableHeadContsants";
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
const schema = yup.object().shape({
  plan_price: yup.number().positive(),
  plan_discount: yup.number().positive(),
  plan_advance: yup.number().positive(),
  plan_duration: yup.string(),
});

const DEFAULT_ORDER = "asc";
const DEFAULT_ORDER_BY = "service_name";
const DEFAULT_ROWS_PER_PAGE = 5;

const AdminServiceList = () => {
  const [open, setOpen] = useState(false);
  const [openAddService, setOpenAddService] = useState({
    service: null,
    open: false,
    updateServiceId: null,
  });
  const [serviceId, setServiceId] = useState("");

  //sorting state
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = React.useState("");
  const [dateSort, setDateSort] = React.useState(false);
  const [numericSort, setNumbericSort] = React.useState(false);

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [visibleRows, setVisibleRows] = React.useState(null);

  const db = getFirestore(app);

  const { service_list, loading } = useSelector(
    (state) => state.serviceListReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // if (Object.keys(service_list).length === 0) {
    //   dispatch(getServiceListData());
    // }
    dispatch(getServiceListData());
  }, []);

  useEffect(() => {
    let rowsOnMount = stableSort(
      convertObjToArray(service_list),
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY)
    );
    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    );

    setVisibleRows(rowsOnMount);
  }, [service_list]);

  const handleOpen = () => {
    // setServiceId(data.id);
    setOpen(true);
    setOpenAddService({
      open: true,
    });
  };
  const handleClose = () => {
    setOpenAddService({
      open: false,
      service: null,
      updateServiceId: null,
    });
    dispatch(getServiceListData());
  };

  const handleDelete = (id) => {
    // const docRef = doc(db, "service", id.toString());
    // deleteDoc(docRef);
    // dispatch(getServiceListData());
  };

  const handleEditService = (id) => {
    setOpenAddService({
      open: true,
      service: service_list[id],
      updateServiceId: id,
    });
  };

  const handleInactive = (e, id) => {
    const serviceRef = doc(db, "service", id.toString());

    let data = {
      isActive: e.target.checked,
    };
    updateDoc(serviceRef, data);
    dispatch(getServiceListData());
  };

  //sort functions

  const handleChangePage = React.useCallback(
    (event, newPage) => {
      setPage(newPage);
      const sortedRows = stableSort(
        convertObjToArray(service_list),
        getComparator(order, orderBy, dateSort, numericSort),
        dateSort
      );
      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage
      );
      console.log("sortedRows", sortedRows);

      setVisibleRows(updatedRows);

      // Avoid a layout jump when reaching the last page with empty rows.
      const numEmptyRows =
        newPage > 0
          ? Math.max(
              0,
              (1 + newPage) * rowsPerPage -
                convertObjToArray(service_list).length
            )
          : 0;
    },
    [service_list]
  );

  const handleChangeRowsPerPage = React.useCallback(
    (event) => {
      console.log("sortedRows", sortedRows);
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);
      setPage(0);
      const sortedRows = stableSort(
        convertObjToArray(service_list),
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
    [order, orderBy, service_list]
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
        convertObjToArray(service_list),
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
  console.log("service_list", service_list);
  return (
    <div className="serviceplanContainer">
      <h1>SERVICE LIST</h1>

      <Button onClick={handleOpen}>Add Services</Button>
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
              rowCount={Object.keys(service_list).length}
              headCells={serviceListheadCells}
            />
            <TableBody>
              {visibleRows &&
                visibleRows.map((service, index) => {
                  return (
                    <TableRow key={service.id}>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {service.service_name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {service.price}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {service.discount}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {service.duration}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {service.advance_price}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEditService(service.id)}
                        >
                          {" "}
                          Edit
                        </Button>
                      </StyledTableCell>
                      {/* <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleDelete(service)}
                      >
                        {" "}
                        Delte
                      </Button>
                    </StyledTableCell> */}
                      <StyledTableCell align="center">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={service.isActive ? true : false}
                              onChange={(e) => handleInactive(e, service.id)}
                              name="gilad"
                            />
                          }
                          label={service.isActive ? "active" : "deactive"}
                        />
                      </StyledTableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={Object.keys(service_list).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>

      {openAddService.open && (
        <AddService
          open={openAddService.open}
          service={openAddService.service}
          updateServiceId={openAddService.updateServiceId}
          handleClose={handleClose}
        />
      )}
    </div>
  );
};

export default AdminServiceList;
