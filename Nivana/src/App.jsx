import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext"; 

import LandingPage from "./components/LandingPage";
import NivanaAuth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import Assessment from "./components/Assessment";
import Profile from "./components/Profile";
import Guidance from "./components/Guidance";
import History from "./components/History"; // ✅ 1. Import Karein
import GlobalLayout from "./components/GlobalLayout";

function App() {
  return (
    <AuthProvider>
      <Routes>
        
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<NivanaAuth />} />
        <Route path="/signup" element={<NivanaAuth />} />
        <Route path="/auth" element={<NivanaAuth />} />

       <Route element={<GlobalLayout />}>
           <Route path="/dashboard" element={<Dashboard />} />
           <Route path="/assessments" element={<Assessment />} />
           <Route path="/guidance" element={<Guidance />} />
           <Route path="/history" element={<History />} />
           <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;