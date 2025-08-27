import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../styles/Dashboard.css"; // Assuming you have a CSS file for styling
import "../styles/Users.css"; // Import the CSS file for user management styles
import profileImage from "../assets/profile-user.png"; // Import the image
import Image from "../assets/user.png"; // Import the image

const UsersComp = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [activeTab, setActiveTab] = useState("list");
  // Example: Replace with real data fetching
  const [users, setUsers] = useState([]);
  // Employees for dropdown
  const [employees, setEmployees] = useState([]);

  // Fetch users for user list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/list");
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
          console.error('User list API did not return an array:', data);
        }
      } catch (error) {
        setUsers([]);
        console.error("Error fetching users for user list:", error);
      }
    };
    fetchUsers();
  }, []);

  // Add user form state
  const [addUserForm, setAddUserForm] = useState({
    employeeId: '',
    email: '',
    password: '',
    role: 'Employee',
  });

  // Handle add user form submit
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    // Find selected employee for name
    const selectedEmployee = employees.find(emp => emp._id === addUserForm.employeeId);
    if (!selectedEmployee) {
      alert('Please select a valid employee.');
      return;
    }
    const payload = {
      employeeId: addUserForm.employeeId,
      name: selectedEmployee.surname
        ? `${selectedEmployee.surname} ${selectedEmployee.firstname || ''} ${selectedEmployee.middlename || ''} ${selectedEmployee.extension || ''}`.trim()
        : selectedEmployee.name,
      email: addUserForm.email,
      password: addUserForm.password,
      role: addUserForm.role,
    };
    try {
      const response = await fetch('http://localhost:5000/api/user/add-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        alert('User added successfully!');
        setAddUserForm({ employeeId: '', email: '', password: '', role: 'Employee' });
        setActiveTab('list');
        // Refresh user list so dropdown updates
        const usersRes = await fetch("http://localhost:5000/api/user/list");
        const usersData = await usersRes.json();
        console.log('Fetched users after add:', usersData);
        if (Array.isArray(usersData)) {
          setUsers(usersData);
        } else {
          setUsers([]);
          console.error('User list API did not return an array:', usersData);
        }
      } else {
        alert(data.error || 'Failed to add user.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  // Fetch employees for dropdown
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees");
        const data = await response.json();
        // Sort by surname (or name if no surname)
        const sorted = data.slice().sort((a, b) => {
          const aName = a.surname ? a.surname.toLowerCase() : (a.name || '').toLowerCase();
          const bName = b.surname ? b.surname.toLowerCase() : (b.name || '').toLowerCase();
          return aName.localeCompare(bName);
        });
        setEmployees(sorted);
      } catch (error) {
        console.error("Error fetching employees for dropdown:", error);
      }
    };
    fetchEmployees();
  }, []);
  
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
            <img src={profileImage} alt="Image" />  
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
              <span className="user">
                <img src={Image} alt="Image" />
              </span>
              ADMIN
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>User Management</h2>
        </div>

        {/* Navigation Tabs for User Management */}
        <nav className="user-management-nav">
          <button
            className={`user-nav-btn${activeTab === "list" ? " active" : ""}`}
            onClick={() => setActiveTab("list")}
          >
            USER LIST
          </button>
          <button
            className={`user-nav-btn${activeTab === "add" ? " active" : ""}`}
            onClick={() => setActiveTab("add")}
          >
            ADD USER
          </button>
        </nav>

        {/* Content area for user management pages */}
        <section className="user-management-content">
          {activeTab === "list" && (
            <div className="user-list-window">
              <h3>USER LIST</h3>
              <table className="user-list-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {Array.isArray(users) && users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>No users found.</td>
                  </tr>
                ) : Array.isArray(users) ? (
                  users.map((user, idx) => (
                    <tr key={user._id || idx}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.status}</td>
                      <td><button>View</button></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'red' }}>User list error</td>
                  </tr>
                )}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "add" && (
            <div className="add-user-window">
              <h3>ADD NEW USER</h3>
              <form className="add-user-form" onSubmit={handleAddUserSubmit}>
                <div className="add-user-form-row">
                  <label htmlFor="employee">Employee:</label>
                  <select
                    id="employee"
                    name="employee"
                    required
                    className="employee-dropdown"
                    value={addUserForm.employeeId}
                    onChange={e => setAddUserForm(f => ({ ...f, employeeId: e.target.value }))}
                  >
                    <option value="">Select Employee</option>
                    {employees
                      .filter(emp => !users.some(user => user.employeeId === emp._id))
                      .map(emp => (
                        <option key={emp._id} value={emp._id}>
                          {emp.surname ? `${emp.surname} ${emp.firstname || ''} ${emp.middlename || ''} ${emp.extension || ''}`.trim() : emp.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="add-user-form-row">
                  <label htmlFor="email">Create Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter user email"
                    required
                    value={addUserForm.email}
                    onChange={e => setAddUserForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>

                <div className="add-user-form-row">
                  <label htmlFor="password">Create Password:</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter password"
                    required
                    value={addUserForm.password}
                    onChange={e => setAddUserForm(f => ({ ...f, password: e.target.value }))}
                  />
                </div>

                <div className="add-user-form-row">
                  <label htmlFor="role">Role:</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={addUserForm.role}
                    readOnly
                    style={{ background: '#f4f4f4', color: '#888' }}
                  />
                </div>

                <button type="submit" className="add-user-button">Add User</button>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default UsersComp;