import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import AddNewTrade from "./pages/AddNewTrade";
import DashboardLayout from "./layouts/DashboardLayout";
import Documents from "./pages/Documents";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public page (NO sidebar) */}
        <Route path="/" element={<LandingPage />} />

        {/* Layout wrapper (WITH sidebar) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/add-trade" element={<AddNewTrade />} />
          <Route path="/dashboard/documents" element={<Documents />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
