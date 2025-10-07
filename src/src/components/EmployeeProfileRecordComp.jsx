import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get the employee ID from the URL
import "../styles/Dashboard.css";
import "../styles/EmployeeProfile.css";
import profileImage from "../assets/profile-user.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import NotificationPopup from "./NotificationPopUp"; // Import NotificationPopup component

const EmployeeProfileRecordComp = () => {
  const { id } = useParams(); // Get the custom employee ID from the URL
  const [employee, setEmployee] = useState(null); // State to store the employee details
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/employees/${id}`); // Fetch employee details by custom ID
        const data = await response.json();
        setEmployee(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployee();
  }, [id]);

  if (!employee) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="icon">
            <img src={profileImage} alt="Profile" />
          </div>
          <div className="profile-icon">HR ADMIN</div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => navigate("/hr-dashboard")}>Dashboard</li>
            <li onClick={() => navigate("/employee-records")}>Employee Records</li>
            <li onClick={() => navigate("/step-increment")}>Step Increment</li>
            <li onClick={() => navigate("/reports")}>Reports & Analytics</li>
            <li onClick={() => navigate("/users")}>User Management</li>
            <li onClick={() => navigate("/logout")}>Logout</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="employee-profile-content">
        <header className="dashboard-header">
          <div className="logo">
            <h2>BOAC: EAMS</h2>
          </div>
          <div className="header-icons">
            <span className="icon">📧</span>
            <span
              className="icon"
              style={{ cursor: "pointer" }}
              onClick={() => setShowNotifications(true)}
            >
              🔔
            </span>
            <div className="profile">
              <img src={profileImage} alt="Profile" />
              <span>ADMIN</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>Employee Profile</h2>
        </div>

        {/* Employee Profile Content */}
        <div className="employee-profile">
          <div className="profile-header">
            <div className="profile-image">
              <img src={profileImage} alt="Employee" />
            </div>
            <div className="profile-details">
              <h3>Full Name: {employee.name}</h3>
              <p>Employee ID: {employee.id}</p>
              <p>Position: {employee.position}</p>
              <p>Department: {employee.department}</p>
              <p>Status: {employee.status}</p>
            </div>
          </div>
        </div>
      </main>
      <NotificationPopup
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        userType="hr"
      />
    </div>
  );
};

export default EmployeeProfileRecordComp;