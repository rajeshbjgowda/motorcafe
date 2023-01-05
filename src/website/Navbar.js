import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router-dom";
import "./style/styles.css";

function WebNavBar() {
  const navigate = useNavigate();
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="light"
      variant="light"
      className="nav-bar"
    >
      <Container>
        <Navbar.Brand href="#home" class="navbar-brand">
          Menu
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#features" class="nav-item nav-link ">
              Features
            </Nav.Link>
            <Nav.Link href="#pricing" class="nav-item nav-link ">
              Pricing
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={() => navigate("/login")}>Login</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Register
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default WebNavBar;
