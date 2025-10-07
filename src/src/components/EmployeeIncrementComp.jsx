import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import "../styles/EmployeeIncrement.css";
import profileImage from "../assets/profile-user.png";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "../context/NotificationPopUp";
  
const EmployeeIncrementComp = () => {
  const [employee, setEmployee] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/login");
  };

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId");
        const response = await fetch(
          `http://localhost:5000/api/employees/${employeeId}`
        );
        const data = await response.json();
        setEmployee(data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployee();
  }, []);

  if (!employee) {
    return <div>Loading...</div>;
  }

  // Calculate next step increment date (example logic)
  const nextStepIncrementDate = new Date(employee.dateJoined);
  nextStepIncrementDate.setFullYear(nextStepIncrementDate.getFullYear() + 5);

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
            <li onClick={() => navigate("/personal-documents")}>Personal Documents</li>
            <li onClick={() => navigate("/employee-increment")}>
              Step Increment Status
            </li>
            <li onClick={handleLogout}>Log out</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="increment-content">
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
              <img src={profileImage} alt="Profile" />
              <span>USER</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>Step Increment Status</h2>
        </div>

        {/* Step Increment Tracking */}
        <div className="increment-tracking">
          <div className="left-table">
            <h3>Step Increment Tracking</h3>
            <table>
              <tbody>
                <tr>
                  <td>Employee ID:</td>
                  <td>{employee.id || employee._id}</td>
                </tr>
                <tr>
                  <td>Full Name:</td>
                  <td>
                    {employee.surname} {employee.firstname} {employee.middlename} {employee.extension ? employee.extension : ""}
                  </td>
                </tr>
                <tr>
                  <td>Position:</td>
                  <td>{employee.position}</td>
                </tr>
                <tr>
                  <td>Salary Grade:</td>
                  <td>{employee.salaryGrade || "N/A"}</td>
                </tr>
                <tr>
                  <td>Date Hired:</td>
                  <td>{employee.dateJoined ? new Date(employee.dateJoined).toLocaleDateString() : "-"}</td>
                </tr>
                <tr>
                  <td>Current Step:</td>
                  <td>{employee.step || "Step 1"}</td>
                </tr>
                <tr>
                  <td>Next Step Increment:</td>
                  <td>{nextStepIncrementDate.toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td>Status:</td>
                  <td>
                    {employee.step === "Step 5" ? "Not Eligible" : "Eligible"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="right-table">
            <h3>Service Record Timeline</h3>
            <table>
              <tbody>
                <tr>
                  <td>Year 1</td>
                  <td>✔ Completed</td>
                </tr>
                <tr>
                  <td>Year 2</td>
                  <td>✔ Completed</td>
                </tr>
                <tr>
                  <td>Year 3</td>
                  <td>✔ Completed</td>
                </tr>
                <tr>
                  <td>Year 4</td>
                  <td>✔ Completed</td>
                </tr>
                <tr>
                  <td>Year 5</td>
                  <td>✔ Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="request-review-button">Request Review</button>
          <button className="view-service-record-button">
            View Service Record
          </button>
        </div>
      </main>

      <NotificationPopup
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
        userType="employee"
      />
    </div>
  );
};

export default EmployeeIncrementComp;