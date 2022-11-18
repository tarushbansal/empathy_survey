import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Survey from "./pages/Survey";
import Submit from "./pages/Submit";
import MyNavbar from "./components/MyNavbar";
import Container from "react-bootstrap/Container";

function App() {
  return (
    <Container>
      <MyNavbar />
      <Router>
        <Routes>
          <Route exact path="/" element={<Survey />} />
          <Route path="/submit" element={<Submit />} />
        </Routes>
      </Router>
    </Container>
  );
}

export default App;
