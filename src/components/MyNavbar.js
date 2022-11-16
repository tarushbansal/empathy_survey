import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.css";

function MyNavbar() {
  return (
    <Navbar expand="lg" variant="dark" bg="dark">
      <Container>
        <Navbar.Brand href="#">Empathetic Dialogue Model Survey</Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
