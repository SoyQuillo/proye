import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import axios from "axios";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import ProtectedRoutes from "./pages/ProtectedRoutes";


import PatientPage from "./pages/patient/PatientPage";
import CreatePatientPage from "./pages/patient/CreatePatientPage";
import EditPatientPage from "./pages/patient/EditPatientPage";
import PatientDetailPage from "./pages/patient/PatientDetailPage";

import CreateDoctorPage from "./pages/doctor/CreateDoctorPage";
import DoctorPage from "./pages/doctor/DoctorPage";
import EditDoctorPage from "./pages/doctor/EditDoctorPage";

import AppointmentPage from "./pages/appointment/AppointmentPage";
import CreateAppointmentPage from "./pages/appointment/CreateAppointmentPage";

axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div className="bg-gray-900 min-h-screen">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<HomePage user={user} error={error} />} />

        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <LoginPage setUser={setUser} />}
        />

        <Route
          path="/register"
          element={
            user ? <Navigate to="/" /> : <RegisterPage setUser={setUser} />
          }
        />

        <Route
          path="/patients"
          element={
            <ProtectedRoutes user={user}>
              <PatientPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/patients/create"
          element={
            <ProtectedRoutes user={user}>
              <CreatePatientPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/patients/edit/:id"
          element={
            <ProtectedRoutes user={user}>
              <EditPatientPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/patients/:id"
          element={
            <ProtectedRoutes user={user}>
              <PatientDetailPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoutes user={user}>
              <DoctorPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/doctors/create"
          element={
            <ProtectedRoutes user={user}>
              <CreateDoctorPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/doctors/edit/:id"
          element={
            <ProtectedRoutes user={user}>
              <EditDoctorPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoutes user={user}>
              <AppointmentPage />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/appointments/create"
          element={
            <ProtectedRoutes user={user}>
              <CreateAppointmentPage />
            </ProtectedRoutes>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;