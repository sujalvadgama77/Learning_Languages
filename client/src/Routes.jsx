/* eslint-disable no-unused-vars */
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Form_sans from "./component/pages/Form_sans";
import Login from "./component/pages/Login";
import Form_eng from "./component/pages/Form_eng";
import Form_guj from "./component/pages/Form_guj";
import Form_hindi from "./component/pages/Form_hindi";
import Homepage from "./component/pages/Homepage.jsx";
import AboutUs from "./component/pages/AboutUs.jsx";
import ContactUs from "./component/pages/contactUs.jsx";
import ProfilePage from "./component/pages/profile_page.jsx";
import ProfileEditPage from "./component/pages/profile_edit_page.jsx";
import ProtectedRoutes from "../src/context/ProtectedRoutes.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import AIPractice from "./component/pages/AIPractice";
import Pathway from "./component/pages/Pathway";

const AppRoutes = () => {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/homepage"
              element={
                <ProtectedRoutes>
                  <Homepage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/sanskrit"
              element={
                <ProtectedRoutes>
                  <Form_sans />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/english"
              element={
                <ProtectedRoutes>
                  <Form_eng />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/gujarati"
              element={
                <ProtectedRoutes>
                  <Form_guj />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/hindi"
              element={
                <ProtectedRoutes>
                  <Form_hindi />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/about-us"
              element={
                <ProtectedRoutes>
                  <AboutUs />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/contact-us"
              element={
                <ProtectedRoutes>
                  <ContactUs />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoutes>
                  <ProfilePage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/editprofile"
              element={
                <ProtectedRoutes>
                  <ProfileEditPage />
                </ProtectedRoutes>
              }
            />
            <Route
              path="/pathway"
              element={
                <ProtectedRoutes>
                  <Pathway />
                </ProtectedRoutes>
              }
            />
            <Route path="/ai-practice" element={<AIPractice />} />
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
};

export default AppRoutes;
