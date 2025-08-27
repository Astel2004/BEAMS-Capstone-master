import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css"; // Reuse the same CSS for sidebar and navbar
import "../styles/Reports.css"; // Add specific styles for reports
import profileImage from "../assets/profile-user.png"; // Import the profile image
import Image from "../assets/user.png"; // Import the admin image
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ReportsComp = () => {
  const [employees, setEmployees] = useState([]); // State to store employee data
  const [displayedEmployees, setDisplayedEmployees] = useState([]); // State for sorted/filtered employees
  const [selectedReport, setSelectedReport] = useState(""); // State for selected report type
  const [sortBy, setSortBy] = useState('lastname');
  const navigate = useNavigate(); // Initialize useNavigate

  // Sorting handler
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Sort employees whenever sortBy or employees change
  useEffect(() => {
    let sorted = [...employees];
    if (sortBy === 'lastname') {
      sorted.sort((a, b) => {
        const aName = a.surname || a.name || '';
        const bName = b.surname || b.name || '';
        return aName.localeCompare(bName);
      });
    }
    setDisplayedEmployees(sorted);
  }, [sortBy, employees]);


  // Sorting state and handler

  // Fetch employee data from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees"); // Replace with your API endpoint
        const data = await response.json();
        setEmployees(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing tokens)
    alert("You have been logged out.");
    navigate("/login"); // Redirect to the login page
  };

  const handleGenerateReport = () => {
    console.log(`Generating report: ${selectedReport}`);
    // Add logic to generate the selected report
  };

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
            <li onClick={() => navigate("/step-increment")}>Step Increment Tracker</li>
            <li onClick={() => navigate("/reports")}>Reports & Analytics</li>
            <li onClick={() => navigate("/users")}>User Management</li>
            <li onClick={handleLogout}>Log out</li>          </ul>
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
              <img src={Image} alt="Profile" />
              <span>ADMIN</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>Reports and Analytics</h2>
        </div>

        {/* Report Controls and Sort Dropdown */}
        <div className="report-controls">
          <div className="report-controls-group">
            <select
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
            >
              <option value="">Select Report Type</option>
              <option value="Employee Directory Report">Employee Directory Report</option>
              <option value="Employee Demographics Report">Employee Demographics Report</option>
              <option value="Employment Status Report">Employment Status Report</option>
            </select>
            <button
              className="generate-report-button"
              onClick={handleGenerateReport}
            >
              Generate Report
            </button>
          </div>
          <div className="reports-sort-dropdown">
            <label htmlFor="sortBy" className="reports-sort-label">Sort by:</label>
            <select id="sortBy" value={sortBy} onChange={handleSortChange} className="reports-sort-select">
              <option value="lastname">By Last Name</option>
            </select>
          </div>
        </div>

        {/* Employee Table with Scroll and Sticky Header */}
        <div className="reports-table">
          <div className="reports-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Employee Id</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Email Address</th>
                  <th>Employment Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedEmployees.length > 0 ? (
                  displayedEmployees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>{employee.surname ? `${employee.surname} ${employee.firstname || ''} ${employee.middlename || ''} ${employee.extension || ''}` : employee.name}</td>
                      <td>{employee.department}</td>
                      <td>{employee.position}</td>
                      <td>{employee.email}</td>
                      <td>{employee.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No employee data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportsComp;