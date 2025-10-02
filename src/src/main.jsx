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
import HRPersonalRecordsDocuments from './components/HRPersonalRecordsDocuments.jsx';
import EmployeeProfileRecordComp from "./components/EmployeeProfileRecordComp.jsx"; // Import Employee Profile Record
import StepIncrementComp from "./components/StepIncrementComp.jsx"; // Import Step Increment Tracker
import Reports from "./pages/Reports.jsx"; // Import Reports and Analytics
import UsersComp from "./components/UsersComp.jsx"; // Import Users Component
import MyProfileComp from "./components/MyProfileComp.jsx"; // Import My Profile
import PersonalDocumentsComp from "./components/PersonalDocumentsComp.jsx"; // Import My Documents
import PDSEditorComp from './components/PDSEditorComp.jsx'; // Import PDS Form Component
import SALNEditorComp from './components/SALNEditorComp.jsx'; // Import SALN Form Component
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
        {/* Route for HR Personal Records Documents */}
        <Route path="/employee-records/:employeeId/documents" element={<HRPersonalRecordsDocuments />} />
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
        <Route path="/personal-documents" element={<PersonalDocumentsComp />} />
        {/* Route for PDS Form */}
        <Route path="/pds-form" element={<PDSEditorComp />} />
        {/* Route for SALN Form */}
        <Route path="/saln-form" element={<SALNEditorComp />} />
        {/* Route for Employee Increment Tracker */}
        <Route path="/employee-increment" element={<EmployeeIncrementComp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);