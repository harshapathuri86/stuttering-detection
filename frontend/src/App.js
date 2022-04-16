import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import { Home as AdminHome } from "./components/pages/Admin/Home";
import { Home as DoctorHome } from "./components/pages/Doctor/Home";
import { Home as PatientHome } from "./components/pages/Patient/Home";
import ForgotPassword from "./components/pages/ForgotPassword";
import ResetPassword from "./components/pages/ResetPassword";
import Profile from "./components/pages/Profile";
import NewTest from "./components/pages/Doctor/NewTest";
import ViewTest from "./components/templates/ViewTest";
import Navbar from "./components/templates/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminHome />} />
          <Route path="/doctor" element={<DoctorHome />} />
          <Route path="/patient" element={<PatientHome />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/newtest" element={<NewTest />} />
          <Route path="/test/:id" element={<ViewTest />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
