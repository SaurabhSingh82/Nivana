import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import NivanaAuth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Assessment from "./components/Assessment";
import Resources from "./components/Resources";
import Profile from "./components/Profile";

function App() {
  return (
    <Routes>
      {/* ✅ Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* ✅ Auth page */}
      <Route path="/auth" element={<NivanaAuth />} />

      {/* ✅ App pages */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assessment" element={<Assessment />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
