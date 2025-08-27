import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import './styles/root.css';
import App from './App.jsx';
import Login from './pages/Login.jsx'; // Import Login.jsx
import HRDashboard from "./pages/HRDashboard.jsx"; // Import HR Dashboard
import EmployeeDashboardComp from "./components/EmployeeDashboardComp.jsx"; // Import Employee Dashboard
import EmployeeRecords from "./pages/EmployeeRecords.jsx"; // Import Employee Records
import EmployeeProfileRecordComp from "./components/EmployeeProfileRecordComp.jsx"; // Import Employee Profile Record
import StepIncrementComp from "./components/StepIncrementComp.jsx"; // Import Step Increment Tracker
import Reports from "./pages/Reports.jsx"; // Import Reports and Analytics
import UsersComp from "./components/UsersComp.jsx"; // Import Users Component
import MyProfileComp from "./components/MyProfileComp.jsx"; // Import My Profile
import MyDocumentsComp from "./components/MyDocumentsComp.jsx"; // Import My Documents
import EmployeeIncrementComp from "./components/EmployeeIncrementComp.jsx"; // Import Employee Increment Tracker
import EmployeeFillUpComp from "./components/EmployeeFillUpComp.jsx"; // Import Employee Fill-Up Form

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Default route to App */}
        <Route path="/" element={<App />} />
        {/* Route for the Login page */}
        <Route path="/login" element={<Login />} />
        {/* Route for the HR Dashboard */}
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        {/* Route for Employee Fill-Up Form */}
        <Route path="/employee-fill-up" element={<EmployeeFillUpComp />} />
        {/* Route for the Employee Dashboard */}
        <Route path="/employee-dashboard" element={<EmployeeDashboardComp />} />
        {/* Route for Employee Records */}
        <Route path="/employee-records" element={<EmployeeRecords />} />
        {/* Route for Employee Profile Record */}
        <Route path="/employee-profile/:id" element={<EmployeeProfileRecordComp />} />
        {/* Route for Step Increment Tracker */}
        <Route path="/step-increment" element={<StepIncrementComp />} />
        {/* Route for Reports and Analytics */}
        <Route path="/reports" element={<Reports />} />
        {/* Route for Settings and User Management */}
        <Route path="/users" element={<UsersComp />} />
        {/* Route for My Profile */}
        <Route path="/my-profile" element={<MyProfileComp />} />
        {/* Route for My Documents */}
        <Route path="/my-documents" element={<MyDocumentsComp />} />
        {/* Route for Employee Increment Tracker */}
        <Route path="/employee-increment" element={<EmployeeIncrementComp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);