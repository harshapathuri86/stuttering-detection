import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
// import DoctorHome from "./components/pages/DoctorHome";
// import PatientHome from "./components/pages/PatientHome";
import AdminPage from "./components/pages/Admin";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* <Route path="/doctor/:id" element={<DoctorHome />} /> */}
          {/* <Route path="/patient/:id" element={<PatientHome />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
