import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import "../styles/StepIncrement.css";
import profileImage from "../assets/profile-user.png";
import Image from "../assets/user.png";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "../context/NotificationPopUp";

const StepIncrementComp = () => {
  const [eligibleEmployees, setEligibleEmployees] = useState([]);
  const [sortBy, setSortBy] = useState('lastname');
  const [userAccounts, setUserAccounts] = useState([]);
  const [showNoAccountModal, setShowNoAccountModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // New state for Generate List feature
  const [showEligibleListModal, setShowEligibleListModal] = useState(false);
  const [loadingEligibleList, setLoadingEligibleList] = useState(false);
  const [eligibleListData, setEligibleListData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEligibleEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees");
        const data = await response.json();
        const eligible = data.filter((employee) => {
          const currentStep = parseInt(employee.step.replace("Step ", ""));
          return currentStep < 5;
        });
        const sorted = eligible.sort((a, b) => {
          const aName = a.surname || a.name || '';
          const bName = b.surname || b.name || '';
          return aName.localeCompare(bName);
        });
        setEligibleEmployees(sorted);
      } catch (error) {
        console.error("Error fetching eligible employees:", error);
      }
    };
    fetchEligibleEmployees();
  }, []);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/list");
        const data = await response.json();
        setUserAccounts(data);
      } catch (error) {
        console.error("Error fetching user accounts:", error);
      }
    };
    fetchUserAccounts();
  }, []);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (value === 'lastname') {
      setEligibleEmployees(prev => [...prev].sort((a, b) => {
        const aName = a.surname || a.name || '';
        const bName = b.surname || b.name || '';
        return aName.localeCompare(bName);
      }));
    }
  };

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/login");
  };

  const handleSendNotification = (employeeId) => {
    const hasAccount = userAccounts.some(user => user.employeeId === employeeId);
    if (!hasAccount) {
      setShowNoAccountModal(true);
      return;
    }
    alert("Notification sent!");
  };

  const calculateStep = (dateJoined) => {
    if (!dateJoined) return 1;
    const joinDate = new Date(dateJoined);
    const now = new Date();
    const diffMonths = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24 * 30.44));
    return Math.floor(diffMonths / 3) + 1;
  };

  // Generate List Button Handler
  const handleGenerateEligibleList = () => {
    setLoadingEligibleList(true);
    setShowEligibleListModal(true);
    // Simulate loading for 3 seconds
    setTimeout(() => {
      // Sample data for eligible employees
      setEligibleListData([
        {
          id: "EMP001",
          name: "John Doe",
          salaryGrade: "SG 11",
          currentStep: "Step 2",
          nextStep: "Step 3",
          dueDate: "2025-12-01"
        },
        {
          id: "EMP002",
          name: "Jane Smith",
          salaryGrade: "SG 12",
          currentStep: "Step 3",
          nextStep: "Step 4",
          dueDate: "2025-11-15"
        },
        {
          id: "EMP003",
          name: "Mark Lee",
          salaryGrade: "SG 10",
          currentStep: "Step 1",
          nextStep: "Step 2",
          dueDate: "2025-10-20"
        }
      ]);
      setLoadingEligibleList(false);
    }, 3000);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="icon">
            <img src={profileImage} alt="Profile" />
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
              <img src={Image} alt="Profile" />
              <span>HR OFFICER</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>Step Increment Tracker</h2>
        </div>

        {/* Generate List Button */}
        <div style={{ marginBottom: "1rem" }}>
          <button
            className="generate-list-btn"
            style={{
              padding: "10px 22px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
            onClick={handleGenerateEligibleList}
          >
            Generate List of Eligible Employees
          </button>
        </div>

        {/* Sort Dropdown above the Step Increment Table */}
        <div className="step-increment-table-controls">
          <div className="step-increment-sort-dropdown">
            <label htmlFor="sortBy" className="step-increment-sort-label">Sort by:</label>
            <select id="sortBy" value={sortBy} onChange={handleSortChange} className="step-increment-sort-select">
              <option value="lastname">By Last Name</option>
            </select>
          </div>
        </div>
        {/* Step Increment Table with Scroll */}
        <div className="step-increment-table">
          <div className="step-increment-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Employee Id</th>
                  <th>Full Name</th>
                  <th>Salary Grade</th>
                  <th>Current Step</th>
                  <th>Next Step</th>
                  <th>Due Date Next Step</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {eligibleEmployees.length > 0 ? (
                  eligibleEmployees.map((employee) => {
                    const currentStep = calculateStep(employee.dateJoined);
                    const nextStep = `Step ${currentStep + 1}`;
                    const joinDate = new Date(employee.dateJoined);
                    const dueDate = new Date(joinDate.getTime() + currentStep * 3 * 30.44 * 24 * 60 * 60 * 1000);
                    return (
                      <tr key={employee.id}>
                        <td className="step">{employee.id}</td>
                        <td className="lastName">{employee.surname ? `${employee.surname} ${employee.firstname || ''} ${employee.middlename || ''} ${employee.extension || ''}` : employee.name}</td>
                        <td className="step">{employee.salaryGrade || "N/A"}</td>
                        <td className="step">{`Step ${currentStep}`}</td>
                        <td className="step">{nextStep}</td>
                        <td className="step">{dueDate.toLocaleDateString()}</td>
                        <td className="step">Pending</td>
                        <td className="step">
                          <button
                            className="notification-button"
                            onClick={() => handleSendNotification(employee.id)}
                          >
                            Send Notification
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8">No employees eligible for step increment.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for No Account */}
        {showNoAccountModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>This employee has no BEAMS account yet.</p>
              <div className="modal-actions">
                <button className="modal-btn" onClick={() => setShowNoAccountModal(false)}>OK</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Eligible Employees List */}
        {showEligibleListModal && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ minWidth: "420px", maxWidth: "90vw" }}>
              <h3>Eligible Employees</h3>
              {loadingEligibleList ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <span style={{ fontSize: "1.2em", color: "#1976d2" }}>Loading...</span>
                </div>
              ) : (
                <table style={{ width: "100%", marginTop: "12px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th>Employee Id</th>
                      <th>Full Name</th>
                      <th>Salary Grade</th>
                      <th>Current Step</th>
                      <th>Next Step</th>
                      <th>Due Date Next Step</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibleListData.length > 0 ? (
                      eligibleListData.map(emp => (
                        <tr key={emp.id}>
                          <td>{emp.id}</td>
                          <td>{emp.name}</td>
                          <td>{emp.salaryGrade}</td>
                          <td>{emp.currentStep}</td>
                          <td>{emp.nextStep}</td>
                          <td>{emp.dueDate}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>No eligible employees found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
              <div className="modal-actions" style={{ marginTop: "18px" }}>
                <button className="modal-btn" onClick={() => setShowEligibleListModal(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        <NotificationPopup
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
          userType="hr"
        />
      </main>
    </div>
  );
};

export default StepIncrementComp;