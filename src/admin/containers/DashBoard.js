import "./styles/dashboard.scss";
import PersonIcon from "@mui/icons-material/Person";
import Grid from "@mui/material/Grid";

const DashBoard = () => {
  return (
    <div className="dashBoardWrapper">
      <h1>DASHBOARD</h1>
      <div className="mainCardContainer">
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <div className="mainCard">
              <div className="contentContainer">
                <div className="content">
                  <p>1</p>
                  <p>User Registration</p>
                </div>
                <div className="icon">
                  <PersonIcon />
                </div>
              </div>
              <div className="cardFooter">more info</div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default DashBoard;
