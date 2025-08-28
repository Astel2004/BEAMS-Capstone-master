import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css"; // Reuse the same CSS for sidebar and navbar
import "../styles/StepIncrement.css"; // Add specific styles for step increment
import profileImage from "../assets/profile-user.png"; // Import the profile image
import Image from "../assets/user.png"; // Import the admin image
import { useNavigate } from "react-router-dom"; // Import useNavigate

const StepIncrementComp = () => {
  const [eligibleEmployees, setEligibleEmployees] = useState([]); // State for employees eligible for step increment
  const [sortBy, setSortBy] = useState('lastname');
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch eligible employees from the backend
  useEffect(() => {
    const fetchEligibleEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees"); // Replace with your API endpoint
        const data = await response.json();

        // Filter employees eligible for step increment
        const eligible = data.filter((employee) => {
          const currentStep = parseInt(employee.step.replace("Step ", ""));
          return currentStep < 5; // Example logic: Eligible if current step is less than 5
        });

        // Sort by last name by default
        const sorted = eligible.sort((a, b) => {
          // Use surname if available, else fallback to name
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

  // Sorting handler
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
    // Perform logout logic here (e.g., clearing tokens)
    alert("You have been logged out.");
    navigate("/login"); // Redirect to the login page
  };

  const handleSendNotification = (employeeId) => {
    console.log(`Notification sent to employee with ID: ${employeeId}`);
    // Add logic to send notification
  };

  // Function to calculate step based on dateJoined
  const calculateStep = (dateJoined) => {
    if (!dateJoined) return 1;
    const joinDate = new Date(dateJoined);
    const now = new Date();
    const diffMonths = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24 * 30.44)); // Approximate months
    return Math.floor(diffMonths / 3) + 1; // Every 3 months is a new step
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
              <img src={Image} alt="Profile" />
              <span>ADMIN</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>Step Increment Tracker</h2>
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
                    // Calculate due date for next step (3 months after last step increment)
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
      </main>
    </div>
  );
};

export default StepIncrementComp;