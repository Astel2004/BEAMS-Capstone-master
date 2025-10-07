import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import './styles/root.css';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import HRDashboard from "./pages/HRDashboard.jsx";
import EmployeeDashboardComp from "./components/EmployeeDashboardComp.jsx";
import EmployeeRecords from "./pages/EmployeeRecords.jsx";
import HRPersonalRecordsDocuments from './components/HRPersonalRecordsDocuments.jsx';
import EmployeeProfileRecordComp from "./components/EmployeeProfileRecordComp.jsx";
import StepIncrementComp from "./components/StepIncrementComp.jsx";
import Reports from "./pages/Reports.jsx";
import UsersComp from "./components/UsersComp.jsx";
import MyProfileComp from "./components/MyProfileComp.jsx";
import PersonalDocumentsComp from "./components/PersonalDocumentsComp.jsx";
import PDSEditorComp from './components/PDSEditorComp.jsx';
import SALNEditorComp from './components/SALNEditorComp.jsx';
import EmployeeIncrementComp from "./components/EmployeeIncrementComp.jsx";
import EmployeeFillUpComp from "./components/EmployeeFillUpComp.jsx";
import NotificationManager from "./components/NotificationManager";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hr-dashboard" element={<HRDashboard />} />
        <Route path="/employee-fill-up" element={<EmployeeFillUpComp />} />
        {/* Wrap employee dashboard and related routes in NotificationManager */}
        <Route
          path="/employee-dashboard"
          element={
            <NotificationManager>
              {(notifProps) => <EmployeeDashboardComp {...notifProps} />}
            </NotificationManager>
          }
        />
        <Route
          path="/personal-documents"
          element={
            <NotificationManager>
              {(notifProps) => <PersonalDocumentsComp {...notifProps} />}
            </NotificationManager>
          }
        />
        <Route
          path="/employee-increment"
          element={
            <NotificationManager>
              {(notifProps) => <EmployeeIncrementComp {...notifProps} />}
            </NotificationManager>
          }
        />
        <Route
          path="/my-profile"
          element={
            <NotificationManager>
              {(notifProps) => <MyProfileComp {...notifProps} />}
            </NotificationManager>
          }
        />
        <Route
          path="/employee-records"
          element={
            <NotificationManager>
              {(notifProps) => <EmployeeRecords {...notifProps} />}
            </NotificationManager>
          }
        />
        <Route path="/employee-records/:employeeId/documents" element={<HRPersonalRecordsDocuments />} />
        <Route path="/employee-profile/:id" element={<EmployeeProfileRecordComp />} />
        <Route path="/step-increment" element={<StepIncrementComp />} />
        <Route path="/reports" element={<Reports />} />
        <Route
          path="/users"
          element={
            <NotificationManager>
              {(notifProps) => <UsersComp {...notifProps} />}
            </NotificationManager>
          }
        />
        <Route path="/pds-form" element={<PDSEditorComp />} />
        <Route path="/saln-form" element={<SALNEditorComp />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);