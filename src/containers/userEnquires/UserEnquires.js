import {
  Paper,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyledTableCell } from "../../components/mui-components/TableComponents";
import { getUsersEnquiresData } from "../../redux/actions/UserEnquires";
import Table from "@mui/material/Table";
import { LoadingButton } from "@mui/lab";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { doc, updateDoc } from "firebase/firestore";
import { fireStore } from "../firebase";
import { getUsersData } from "../../redux/actions/users";
import { getServiceListData } from "../../redux/actions/AdminServiceList";

const UserEnquires = () => {
  const [replyModal, setReplyModal] = useState({
    open: false,
    docId: null,
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { enquires } = useSelector((state) => state.userEnqiresReducer);
  const { users } = useSelector((state) => state.userReducer);
  const { service_list } = useSelector((state) => state.serviceListReducer);

  useEffect(() => {
    dispatch(getUsersEnquiresData());
    dispatch(getUsersData());
    dispatch(getServiceListData());
  }, []);

  const handleClose = () => {
    setReplyModal({
      open: false,
      docId: null,
    });
    dispatch(getUsersEnquiresData());
  };
  const handleOpenReply = (id) => {
    setReplyModal({
      open: true,
      docId: id,
    });
  };

  const handleSubmitReply = (e) => {
    setLoading(true);
    const data = {
      admin_reply: e.target.admin_reply.value,
    };

    try {
      const enquiryRef = doc(
        fireStore,
        "enquires_user",
        replyModal.docId.toString()
      );
      updateDoc(enquiryRef, data);
      setLoading(false);
      handleClose();
    } catch (err) {
      handleClose();
      setLoading(false);
    }
  };
  return (
    <div className="serviceplanContainer">
      <h1>USER ENQUIRES</h1>

      {/* <Button onClick={handleOpen}>Add Services</Button> */}
      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table
            aria-label="customized table"
            sx={{ minWidth: 650, overflowX: "scroll" }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Sl.No</StyledTableCell>
                <StyledTableCell align="center">User Name</StyledTableCell>
                <StyledTableCell align="center">User email</StyledTableCell>
                <StyledTableCell align="center">User mobile</StyledTableCell>

                <StyledTableCell align="center">Service</StyledTableCell>
                <StyledTableCell align="center">User Message</StyledTableCell>
                <StyledTableCell align="center">Admin Reply</StyledTableCell>
                <StyledTableCell align="center"> Reply</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enquires &&
                enquires.map((enquiry, index) => {
                  return (
                    <TableRow key={enquiry.id}>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {users[enquiry.user_id].username}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {users[enquiry.user_id].email}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {users[enquiry.user_id].mobile}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {service_list[enquiry.service_id]?.service_name}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {enquiry.user_reply}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {enquiry.admin_reply}
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenReply(enquiry.id)}
                          disabled={enquiry.admin_reply === "" ? false : true}
                        >
                          {" "}
                          {enquiry.admin_reply === "" ? "Reply" : "Replaid"}
                        </Button>
                      </StyledTableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Modal open={replyModal.open} onClose={handleClose}>
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
          <form onSubmit={handleSubmitReply}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Reply"
                  variant="outlined"
                  required
                  fullWidth
                  type="text"
                  name="admin_reply"
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
              reply
            </LoadingButton>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default UserEnquires;
