import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import "../styles/EmployeeRecords.css";
import profileImage from "../assets/profile-user.png";
import Image from "../assets/user.png";
import { useNavigate } from "react-router-dom";

const EmployeeRecordsComp = () => {
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [sortBy, setSortBy] = useState('lastname');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    surname: "",
    firstname: "",
    middlename: "",
    extension: "",
    civilStatus: "",
    citizenship: "",
    mobileNo: "",
    email: "",
    password: "",
    contact: "",
    birthdate: "",
    gender: "",
    address: {
      province: "",
      city: "",
      zipCode: "",
      barangay: "",
    },
  });
  const [viewEmployee, setViewEmployee] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleViewClick = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`);
      if (!response.ok) throw new Error('Failed to fetch employee');
      const data = await response.json();
      setViewEmployee(data);
    } catch (error) {
      alert('Error fetching employee details.');
    }
  };

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/login");
  };

  // Fetch employee records from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees");
        const data = await response.json();
        // Ensure all employees have id, position, step, and status (for legacy data)
        const normalized = data.map(emp => ({
          ...emp,
          id: emp.id || emp._id?.slice(-4) || '-',
          position: emp.position || '-',
          step: emp.step || '-',
          status: emp.status || 'Active',
        }));
        // Sort by last name (surname) by default
        const sorted = normalized
          .filter((employee) => employee.status === "Active")
          .sort((a, b) => a.surname.localeCompare(b.surname));
        setActiveEmployees(sorted);
      } catch (error) {
        console.error("Error fetching employee records:", error);
      }
    };
    fetchEmployees();
  }, []);

  // Handle Add Employee Modal
  const handleAddEmployeeClick = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewEmployee({
      surname: "",
      firstname: "",
      middlename: "",
      extension: "",
      civilStatus: "",
      citizenship: "",
      mobileNo: "",
      email: "",
      password: "",
      contact: "",
      birthdate: "",
      gender: "",
      address: {
        province: "",
        city: "",
        zipCode: "",
        barangay: "",
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (["province", "city", "zipCode", "barangay"].includes(name)) {
      setNewEmployee({
        ...newEmployee,
        address: { ...newEmployee.address, [name]: value }
      });
    } else {
      setNewEmployee({ ...newEmployee, [name]: value });
    }
  };

  const generateRandomId = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleAddEmployeeSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    const requiredFields = [
      'surname', 'firstname', 'middlename', 'civilStatus', 'citizenship', 'mobileNo', 'email', 'birthdate', 'gender',
      'province', 'city', 'zipCode', 'barangay'
    ];
    const missingFields = [];
    requiredFields.forEach(field => {
      if (["province", "city", "zipCode", "barangay"].includes(field)) {
        if (!newEmployee.address[field] || newEmployee.address[field].trim() === "") {
          missingFields.push(field.charAt(0).toUpperCase() + field.slice(1));
        }
      } else {
        if (!newEmployee[field] || newEmployee[field].trim() === "") {
          missingFields.push(field.charAt(0).toUpperCase() + field.slice(1));
        }
      }
    });
    if (missingFields.length > 0) {
      alert("Please fill in all required fields: " + missingFields.join(", "));
      return;
    }
    // Prepare employee data for backend
    const employeeData = {
      ...newEmployee,
      id: generateRandomId(),
      position: "HR Staff",
      step: "Step 1",
      status: "Active"
    };
    try {
      const response = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData)
      });
      if (!response.ok) throw new Error("Failed to add employee");
      const saved = await response.json();
      setActiveEmployees((prev) => [...prev, { ...employeeData, _id: saved.employee._id }]);
      handleCloseModal();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert("Error adding employee. Please try again.");
    }
  };

  const handleCloseViewModal = () => setViewEmployee(null);

  const handleDeleteEmployee = async (employeeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete employee");
      setActiveEmployees((prev) => prev.filter(emp => emp._id !== employeeId));
    } catch (error) {
      alert("Error deleting employee. Please try again.");
    }
  };

  // Sorting handler
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (value === 'lastname') {
      setActiveEmployees(prev => [...prev].sort((a, b) => a.surname.localeCompare(b.surname)));
    }
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
              <img src={Image} alt="Image" />
              <span>ADMIN</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>Employee Records</h2>
        </div>

      {/* Add Employee and Sort Dropdown above the Active Employees table */}
      <div className="employee-table-controls">
        <button className="add-employee-button" onClick={handleAddEmployeeClick}>
          Add Employee
        </button>
        <div className="employee-sort-dropdown">
          <label htmlFor="sortBy" className="employee-sort-label">Sort by:</label>
          <select id="sortBy" value={sortBy} onChange={handleSortChange} className="employee-sort-select">
            <option value="lastname">By Last Name</option>
          </select>
        </div>
      </div>
      {showSuccess && (
        <div className="employee-success-popup">Employee successfully added!</div>
      )}

        {/* Add Employee Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="Form-title">
                <h3>Add New Employee</h3>
              <p className="note">
                (Note: Field with <span style={{color: 'red'}}>*</span> is required)
              </p>
              </div>
              <form onSubmit={handleAddEmployeeSubmit} className="add-employee-form">
                <section className="info-section">
                <div className="employee-info1">
                <h4 className="section-title">Employee Information</h4>
                <label>
                  Surname: <span style={{color: 'red'}}>*</span>
                  <input
                    type="text"
                    name="surname"
                    value={newEmployee.surname}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  First Name: <span style={{color: 'red'}}>*</span>
                  <input
                    type="text"
                    name="firstname"
                    value={newEmployee.firstname}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Middle Name: <span style={{color: 'red'}}>*</span>
                  <input
                    type="text"
                    name="middlename"
                    value={newEmployee.middlename}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Extension:
                  <input
                    type="text"
                    name="extension"
                    value={newEmployee.extension}
                    onChange={handleInputChange}
                  />
                </label>
                <label>
                  Civil Status: <span style={{color: 'red'}}>*</span>
                  <select
                    name="civilStatus"
                    value={newEmployee.civilStatus}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                    <option value="Other/s">Other/s</option>
                  </select>
                </label>
                </div>
                <div className="employee-info2">
                <label>
                  Citizenship: <span style={{color: 'red'}}>*</span>
                  <select
                    name="citizenship"
                    value={newEmployee.citizenship}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Filipino">Filipino</option>
                    <option value="Dual Citizenship">Dual Citizenship</option>
                  </select>
                </label>
                <label>
                  Mobile No.: <span style={{color: 'red'}}>*</span>
                  <input
                    type="text"
                    name="mobileNo"
                    value={newEmployee.mobileNo}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Email Address: <span style={{color: 'red'}}>*</span>
                  <input
                    type="email"
                    name="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Birthdate: <span style={{color: 'red'}}>*</span>
                  <input
                    type="date"
                    name="birthdate"
                    value={newEmployee.birthdate}
                    onChange={handleInputChange}
                    required
                  />
                </label>
                <label>
                  Gender: <span style={{color: 'red'}}>*</span>
                  <select
                    name="gender"
                    value={newEmployee.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </label>                  
                </div>
                </section>

                <section className="address-section">
                  <div className="address"> 
                    <h4 className="section-title">Address</h4>
                  <label>
                    Province: <span style={{color: 'red'}}>*</span>
                    <input
                      type="text"
                      name="province"
                      value={newEmployee.address.province}
                      onChange={e => setNewEmployee({
                        ...newEmployee,
                        address: { ...newEmployee.address, province: e.target.value }
                      })}
                      required
                    />
                  </label>
                  <label>
                    City/Municipality: <span style={{color: 'red'}}>*</span>
                    <input
                      type="text"
                      name="city"
                      value={newEmployee.address.city}
                      onChange={e => setNewEmployee({
                        ...newEmployee,
                        address: { ...newEmployee.address, city: e.target.value }
                      })}
                      required
                    />
                  </label>
                    <label>
                    Zip Code: <span style={{color: 'red'}}>*</span>
                    <input
                      type="text"
                      name="zipCode"
                      value={newEmployee.address.zipCode}
                      onChange={e => setNewEmployee({
                        ...newEmployee,
                        address: { ...newEmployee.address, zipCode: e.target.value }
                      })}
                      required
                    />
                  </label>
                  <label>
                    Barangay: <span style={{color: 'red'}}>*</span>
                    <input
                      type="text"
                      name="barangay"
                      value={newEmployee.address.barangay}
                      onChange={e => setNewEmployee({
                        ...newEmployee,
                        address: { ...newEmployee.address, barangay: e.target.value }
                      })}
                      required
                    />
                  </label>
                  </div>

                  <div className="modal-actions">
                  <button type="submit" className="add-employee-button">
                    Add
                  </button>
                  <button type="button" className="delete-employee-button" onClick={handleCloseModal}>
                    Cancel
                  </button>
                </div>
                </section>
              </form>
            </div>
          </div>
        )}

        {/* View Employee Modal */}
        {viewEmployee && (
          <div className="modal-overlay">
            <div className="view-employee-modal">
              <div className="view-employee-header">Employee Details</div>
              <div className="view-employee-details-grid">
                <div>
                  <div className="view-employee-section-title">Personal Information</div>
                  <div className="view-employee-info-list">
                    <p><b>Surname:</b> <u>{viewEmployee.surname}</u> </p>
                    <p><b>First Name:</b> <u>{viewEmployee.firstname}</u> </p>
                    <p><b>Middle Name:</b> <u>{viewEmployee.middlename}</u> </p>
                    <p><b>Extension:</b> <u>{viewEmployee.extension || '-'}</u> </p>
                    <p><b>Civil Status:</b> <u>{viewEmployee.civilStatus}</u> </p>
                    <p><b>Citizenship:</b> <u>{viewEmployee.citizenship}</u> </p>
                    <p><b>Mobile No.:</b> <u>{viewEmployee.mobileNo}</u> </p>
                    <p><b>Email:</b> <u>{viewEmployee.email}</u> </p>
                    <p><b>Birthdate:</b> <u>{viewEmployee.birthdate ? new Date(viewEmployee.birthdate).toLocaleDateString() : '-'}</u> </p>
                    <p><b>Gender:</b> <u>{viewEmployee.gender}</u> </p>
                  </div>
                </div>
                <div>
                  <div className="view-employee-section-title">Address</div>
                  <div className="view-employee-address-list">
                    <p><b>Province:</b> <u>{viewEmployee.address?.province || '-'}</u></p>
                    <p><b>City/Municipality:</b> <u>{viewEmployee.address?.city || '-'}</u></p>
                    <p><b>Zip Code:</b> <u>{viewEmployee.address?.zipCode || '-'}</u></p>
                    <p><b>Barangay:</b> <u>{viewEmployee.address?.barangay || '-'}</u></p>
                  </div>
                </div>
              </div>
              <button className="view-employee-close-btn" onClick={handleCloseViewModal}>Close</button>
            </div>
          </div>
        )}

        {/* Employees Table */}
        <div className="employee-table">
          <div className="employee-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Employee Id</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Position</th>
                  <th>Current Step</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeEmployees.length > 0 ? (
                  activeEmployees.map((employee) => (
                    <tr key={employee._id || employee.id}>
                      <td className="employee-data">{employee.id || '-'}</td>
                      <td className="lastName">{employee.surname} {employee.firstname} {employee.middlename} {employee.extension ? employee.extension : ''}</td>
                      <td className="employee-data">{employee.email || '-'}</td>
                      <td className="employee-data">{employee.position || '-'}</td>
                      <td className="employee-data">{employee.step || '-'}</td>
                      <td className="employee-data">{employee.status || '-'}</td>
                      <td className="employee-data">
                        <button
                          className="view-button"
                          onClick={() => handleViewClick(employee._id)}
                        >
                          View
                        </button>
                        <button
                          className="delete-employee-icon"
                          title="Delete Employee"
                          style={{ marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: '1.2rem' }}
                          onClick={() => handleDeleteEmployee(employee._id)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No active employees found.</td>
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

export default EmployeeRecordsComp;