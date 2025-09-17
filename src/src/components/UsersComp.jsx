import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import "../styles/Users.css";
import profileImage from "../assets/profile-user.png";
import Image from "../assets/user.png";
import NotificationPopup from "./NotificationPopUp";

const UsersComp = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");
  const [users, setUsers] = useState([]);
  const [addUserForm, setAddUserForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    password: '',
    role: 'Employee',
    status: 'Active'
  });

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

  // Automatically fill email when last name changes (removes spaces)
  useEffect(() => {
    if (addUserForm.lastName) {
      const cleanedLastName = addUserForm.lastName.replace(/\s+/g, "").toLowerCase();
      setAddUserForm(f => ({
        ...f,
        email: `${cleanedLastName}@beams.com`
      }));
    } else {
      setAddUserForm(f => ({
        ...f,
        email: ''
      }));
    }
  }, [addUserForm.lastName]);

  // Handle create user form submit
  const handleAddUserSubmit = async (e) => {
  e.preventDefault();

  // Always regenerate email
  const cleanedLastName = addUserForm.lastName.replace(/\s+/g, "").toLowerCase();
  const finalEmail = `${cleanedLastName}@beams.com`;

  const payload = {
    firstName: addUserForm.firstName?.trim(),
    lastName: addUserForm.lastName?.trim(),
    middleName: addUserForm.middleName?.trim() || "", // allow blank if needed
    email: finalEmail,
    password: addUserForm.password,
    role: addUserForm.role,
    status: addUserForm.status
  };

  console.log("🚀 Payload being sent:", payload); // 👈 check values here

  try {
    const response = await fetch('http://localhost:5000/api/user/add-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("✅ Server response:", data);

    if (response.ok) {
      alert('User created successfully!');
      setAddUserForm({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        password: '',
        role: 'Employee',
        status: 'Active'
      });
      setActiveTab('list');

      // Refresh user list
      const usersRes = await fetch("http://localhost:5000/api/user/list");
      const usersData = await usersRes.json();
      if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        setUsers([]);
        console.error('User list API did not return an array:', usersData);
      }
    } else {
      alert(data.error || 'Failed to create user.');
    }
  } catch (error) {
    console.error("❌ Submission error:", error);
    alert('An error occurred. Please try again.');
  }
};


  // Handle delete user
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      const response = await fetch(`http://localhost:5000/api/user/${userToDelete}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        alert('User deleted successfully!');
        setUsers(users.filter(user => user._id !== userToDelete));
      } else {
        alert(data.error || 'Failed to delete user.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

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
            CREATE USER
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
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Middle Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(users) && users.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: '#888' }}>No users found.</td>
                    </tr>
                  ) : Array.isArray(users) ? (
                    users.map((user, idx) => (
                      <tr key={user._id || idx}>
                        <td>{user.firstName || ""}</td>
                        <td>{user.lastName || ""}</td>
                        <td>{user.middleName || ""}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.status}</td>
                        <td>
                          <button>View</button>
                          <button className="user-delete-btn" onClick={() => handleDeleteClick(user._id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', color: 'red' }}>User list error</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "add" && (
            <div className="add-user-window">
              <h3>CREATE NEW USER</h3>
              <form className="add-user-form" onSubmit={handleAddUserSubmit}>
                <div className="add-user-form-row">
                  <label htmlFor="firstName">First Name:</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    required
                    value={addUserForm.firstName}
                    onChange={e => setAddUserForm(f => ({ ...f, firstName: e.target.value }))}
                  />
                </div>
                <div className="add-user-form-row">
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    required
                    value={addUserForm.lastName}
                    onChange={e => setAddUserForm(f => ({ ...f, lastName: e.target.value }))}
                  />
                </div>
                <div className="add-user-form-row">
                  <label htmlFor="middleName">Middle Name:</label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
                    placeholder="Enter middle name"
                    value={addUserForm.middleName}
                    required
                    onChange={e => setAddUserForm(f => ({ ...f, middleName: e.target.value }))}
                  />
                </div>
                <div className="add-user-form-row">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email auto-generated"
                    required
                    value={addUserForm.email}
                    readOnly
                  />
                </div>
                <div className="add-user-form-row">
                  <label htmlFor="password">Password:</label>
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
                  <select
                    id="role"
                    name="role"
                    value={addUserForm.role}
                    onChange={e => setAddUserForm(f => ({ ...f, role: e.target.value }))}
                  >
                    <option value="Employee">Employee</option>
                    <option value="HR">HR</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="add-user-form-row">
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    name="status"
                    value={addUserForm.status}
                    onChange={e => setAddUserForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <button type="submit" className="add-user-button">Create User</button>
              </form>
            </div>
          )}
        </section>

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>Are you sure you want to delete this user account?</p>
              <div className="modal-actions">
                <button className="modal-btn yes" onClick={handleDeleteUser}>Yes</button>
                <button className="modal-btn no" onClick={() => { setShowDeleteModal(false); setUserToDelete(null); }}>No</button>
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
}

export default UsersComp;
