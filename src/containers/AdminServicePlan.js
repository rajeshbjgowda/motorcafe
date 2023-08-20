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
} from "firebase/firestore";
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
import CreatePlanModal from "../components/CreatePlanModal";
import ServicesList from "../components/ServicesList";
import AddService from "../components/AddService";
import AddServicesToPlan from "../components/AddServicesToPlan";
import { getServiceListData } from "../redux/actions/AdminServiceList";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TablePagination from "@mui/material/TablePagination";
import EnhancedTableHead from "../components/mui-components/EnhancedTableHead";
import { getComparator, stableSort } from "../utils/sorting Functions";
import { servicePlanheadCells } from "../utils/TableHeadContsants";
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
const DEFAULT_ORDER = "asc";
const DEFAULT_ORDER_BY = "field_name";
const DEFAULT_ROWS_PER_PAGE = 5;

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
  const [openCreatePlan, setOpenCreatePlan] = useState(false);
  const [openServices, setOpenServices] = useState({
    planId: null,
    open: false,
  });
  const [openAddService, setOpenAddService] = useState({
    plan: null,
    open: false,
  });
  const [selected, setSelected] = useState([]);

  //sorting state
  const [order, setOrder] = React.useState("");
  const [dateSort, setDateSort] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState("");
  const [visibleRows, setVisibleRows] = React.useState(null);

  const [addServiceToPlan, setAddServicePlan] = useState("");
  const [modelUpdateId, setModelUpdateId] = useState("");
  const [serviceID, setServiceId] = useState("");

  const [serviceImage, setServiceImage] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");

  const planRef = collection(fireStore, "plan");
  const servicesRef = collection(fireStore, "service");
  const db = getFirestore(app);

  const dispatch = useDispatch();

  const servicePlans = useSelector(
    (state) => state?.servicePlanReducer?.service_plans
  );
  const includedServicesList = useSelector(
    (state) => state?.servicePlanPriceReducer?.service_plans_prices
  );

  const service_list = useSelector(
    (state) => state.serviceListReducer.service_list
  );

  const admin = useSelector((state) => state?.user?.userDetails);

  useEffect(() => {
    dispatch(getServicePlanData());
    dispatch(getServicePlanPriceData());
    dispatch(getServiceListData());
  }, []);

  useEffect(() => {
    let rowsOnMount = stableSort(
      servicePlans,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY)
    );
    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    );

    setVisibleRows(rowsOnMount);
  }, [servicePlans]);

  const handleUpdate = (id) => {
    setModelUpdateId(id);

    setOpenCreatePlan(true);
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, "plan", id.toString());
    deleteDoc(docRef);
    let serviceId = includedServicesList[id].id;
    const serviceRef = doc(db, "service", serviceId.toString());
    await deleteDoc(serviceRef);
    dispatch(getServicePlanData());
    dispatch(getServicePlanPriceData());
  };

  const handleCloseCreatePlanModal = () => {
    setOpenCreatePlan(false);
    setModelUpdateId("");
    dispatch(getServicePlanData());
    dispatch(getServicePlanPriceData());
  };

  const handleCloseAddServiceModal = () => {
    setOpenAddService({ open: false, plan: null });
    dispatch(getServicePlanData());
    dispatch(getServicePlanPriceData());
  };

 
  const handleActiveState = (e, id) => {
    const planRef = doc(fireStore, "plan", id.toString());

    let data = {
      isActive: e.target.checked,
    };
    updateDoc(planRef, data);
    dispatch(getServicePlanPriceData());
    dispatch(getServicePlanData());
  };

  const handleChangePage = React.useCallback((event, newPage) => {
    setPage(newPage);

    const sortedRows = stableSort(
      servicePlans,
      getComparator(order, orderBy, dateSort),
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
        ? Math.max(0, (1 + newPage) * rowsPerPage - servicePlans.length)
        : 0;
  }, []);

  const handleChangeRowsPerPage = React.useCallback(
    (event) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);
      setPage(0);
      const sortedRows = stableSort(
        servicePlans,
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
        servicePlans,
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
      <h1>SERVICE PLAN</h1>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpenCreatePlan(true);
          }}
        >
          Add Plan
        </Button>
      </div>
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
              rowCount={servicePlans.length}
              headCells={servicePlanheadCells}
            />
            <TableBody>
              {visibleRows &&
                visibleRows.map((servicePlan, index) => (
                  <StyledTableRow key={servicePlan.id}>
                    <StyledTableCell align="center">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {servicePlan?.field_name}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => {
                          setOpenAddService({
                            open: true,
                            plan: servicePlan,
                          });
                        }}
                      >
                        Add Service
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {new Date(
                        servicePlan?.created_at?.seconds * 1000
                      ).toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {new Date(
                        servicePlan?.updated_at?.seconds * 1000
                      ).toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        onClick={() => handleUpdate(servicePlan.id)}
                      >
                        Edit
                      </Button>
                    </StyledTableCell>
                    {/* <StyledTableCell align="center">
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(servicePlan.id)}
                      >
                        delete
                      </Button>
                    </StyledTableCell> */}
                    <StyledTableCell align="center">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={servicePlan.isActive ? true : false}
                            onChange={(e) =>
                              handleActiveState(e, servicePlan.id)
                            }
                            name="vehicle_cmpany_state"
                          />
                        }
                        label={servicePlan.isActive ? "active" : "deactive"}
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
          count={servicePlans.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <CreatePlanModal
        open={openCreatePlan}
        handleClose={handleCloseCreatePlanModal}
        updateId={modelUpdateId}
      />

      {openAddService.open && (
        <AddServicesToPlan
          plan={openAddService.plan}
          open={openAddService.open}
          service_list={service_list}
          handleClose={handleCloseAddServiceModal}
        />
      )}
    </div>
  );
};

export default AdminServicePlan;
