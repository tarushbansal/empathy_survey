import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Survey from "./pages/Survey";
import Results from "./pages/Results";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Survey />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
