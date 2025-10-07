import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import profileImage from "../assets/profile-user.png";
import Image from "../assets/user.png";
import NotificationPopup from "./NotificationPopUp";

const HRDashboardComp = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/login");
  };

  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="icon">
            <img src={profileImage} alt="Image" />  
          </div>
          <div className="profile-icon">HR OFFICER</div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => navigate("/hr-dashboard")}>Dashboard</li>
            <li onClick={() => navigate("/employee-records")}>Employee Records</li>
            <li onClick={() => navigate("/step-increment")}>Step Increment Tracker</li>
            <li onClick={() => navigate("/reports")}>Reports & Analytics</li>
            <li onClick={() => navigate("/users")}>User Management</li>
            <li onClick={handleLogout}>Log out</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="logo">
            <h2>BEAMS</h2>
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
              <span className="user">
                <img src={Image} alt="Image" />
              </span>
              HR OFFICER
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>DASHBOARD</h2>
        </div>

        <section className="dashboard-overview">
          <div className="card">
            <h3>Employee Records</h3>
            <p>
              Total Employees: <strong>167</strong>
            </p>
            <button onClick={() => navigate("/employee-records")}>Manage Employees</button>
          </div>
          <div className="card">
            <h3>Step Increments Tracker</h3>
            <p>
              Employees due for Step Increase: <strong>15</strong>
            </p>
            <button>Validate Eligibility</button>
          </div>
          <div className="card">
            <h3>Reports</h3>
            <p>
              <span>Directory 📝</span>
              <br />
              <span>Demographics 📝</span>
              <br />
              <span>Status 📝</span>
            </p>
            <button>Generate Reports</button>
          </div>
        </section>

        <section className="dashboard-charts">
          {/* Placeholder for charts */}
          <div className="chart-placeholder">Chart Placeholder</div>
        </section>

        <NotificationPopup
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
          userType="hr"
        />
      </main>
    </div>
  );
};

export default HRDashboardComp;