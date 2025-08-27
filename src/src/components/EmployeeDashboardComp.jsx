import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/Dashboard.css"; // Import the CSS file for styling
import profileImage from "../assets/profile-user.png"; // Import the profile image

const EmployeeDashboardComp = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing tokens)
    alert("You have been logged out.");
    navigate("/login"); // Redirect to the login page
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="icon">
            <img src={profileImage} alt="Profile" />
          </div>
          <div className="profile-icon">EMPLOYEE</div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => navigate("/employee-dashboard")}>Dashboard</li>
            <li onClick={() => navigate("/my-profile")}>My Profile</li>
            <li onClick={() => navigate("/my-documents")}>My Documents</li>
            <li onClick={() => navigate("/employee-increment")}>
              Step Increment Status
            </li>
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
            <span className="icon">🔔</span>
            <div className="profile">
              <img src={profileImage} alt="Profile" className="profile-image" />
              <span>EMPLOYEE</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>DASHBOARD</h2>
        </div>

        <section className="dashboard-overview">
          <div className="card">
            <h3>Profile Summary</h3>
            <p>View and update your profile information.</p>
            <button onClick={() => navigate("/my-profile")}>
              Update Profile
            </button>
          </div>
          <div className="card">
            <h3>Latest Uploaded Documents</h3>
            <p>Access your recently uploaded documents.</p>
            <button onClick={() => navigate("/my-documents")}>
              View Documents
            </button>
          </div>
          <div className="card">
            <h3>Step Increment Countdown</h3>
            <p>Track your step increment progress.</p>
            <button onClick={() => navigate("/employee-increment")}>
              View Progress
            </button>
          </div>
        </section>

        <section className="dashboard-charts">
          {/* Placeholder for charts */}
          <div className="chart-placeholder">Chart Placeholder</div>
        </section>
      </main>
    </div>
  );
};

export default EmployeeDashboardComp;