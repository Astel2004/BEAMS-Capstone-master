import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import "../styles/EmployeeRecords.css";
import profileImage from "../assets/profile-user.png";
import Image from "../assets/user.png";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "./NotificationPopUp";

const EmployeeRecordsComp = () => {
  const [activeEmployees, setActiveEmployees] = useState([]);
  const [sortBy, setSortBy] = useState("lastname");
  const [viewEmployee, setViewEmployee] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");
  const [personalEmployees, setPersonalEmployees] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingRecords, setPendingRecords] = useState([]);
  const [approvedEmployees, setApprovedEmployees] = useState([]);
  const navigate = useNavigate();

  const handleViewClick = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`);
      if (!response.ok) throw new Error("Failed to fetch employee");
      const data = await response.json();
      setViewEmployee(data);
    } catch (error) {
      alert("Error fetching employee details.");
    }
  };

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/login");
  };

  // Fetch employee records
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees");
        const data = await response.json();
        const normalized = data.map((emp) => ({
          ...emp,
          id: emp.id || emp._id?.slice(-4) || "-",
          position: emp.position || "-",
          step: emp.step || "-",
        }));
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

  // Fetch employees for personal records tab
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees");
        const data = await response.json();
        setPersonalEmployees(data);
      } catch (error) {
        setPersonalEmployees([]);
        console.error("Error fetching employees:", error);
      }
    };
    if (activeTab === "personal") {
      fetchEmployees();
    }
  }, [activeTab]);

  // Fetch pending records for review
  useEffect(() => {
    const fetchPendingRecords = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/documents?status=Pending");
        const data = await response.json();
        setPendingRecords(data);
      } catch (error) {
        setPendingRecords([]);
        console.error("Error fetching pending records:", error);
      }
    };
    if (activeTab === "pending") {
      fetchPendingRecords();
    }
  }, [activeTab]);

  // Fetch approved employees
  useEffect(() => {
    const fetchApprovedEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees/approved");
        const data = await response.json();
        setApprovedEmployees(data);
      } catch (error) {
        console.error("Error fetching approved employees:", error);
      }
    };
    fetchApprovedEmployees();
  }, []);

  const handleCloseViewModal = () => setViewEmployee(null);

  const handleDeleteEmployeeConfirmed = async () => {
    if (!employeeToDelete) return;
    try {
      const response = await fetch(`http://localhost:5000/api/employees/${employeeToDelete}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete employee");
      setActiveEmployees((prev) => prev.filter((emp) => emp._id !== employeeToDelete));
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 2000);
    } catch (error) {
      alert("Error deleting employee. Please try again.");
    }
    setShowDeleteModal(false);
    setEmployeeToDelete(null);
  };

  const handleDeleteClick = (employeeId) => {
    setEmployeeToDelete(employeeId);
    setShowDeleteModal(true);
  };

  // Sorting handler
  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (value === "lastname") {
      setActiveEmployees((prev) => [...prev].sort((a, b) => a.surname.localeCompare(b.surname)));
    }
  };

  function calculateStep(dateJoined) {
    if (!dateJoined) return "Step 1";
    const joinDate = new Date(dateJoined);
    const now = new Date();
    const diffMonths = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24 * 30.44));
    const step = Math.floor(diffMonths / 3) + 1;
    return `Step ${step}`;
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
              <img src={Image} alt="Image" />
              <span>ADMIN</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>Employee Records</h2>
        </div>

        {/* Tab Navigation */}
        <nav className="employee-records-nav">
          <button
            className={`employee-nav-btn${activeTab === "employees" ? " active" : ""}`}
            onClick={() => setActiveTab("employees")}
          >
            Employee Records List
          </button>
          <button
            className={`employee-nav-btn${activeTab === "supporting" ? " active" : ""}`}
            onClick={() => setActiveTab("supporting")}
          >
            Supporting Documents
          </button>
          <button
            className={`employee-nav-btn${activeTab === "service" ? " active" : ""}`}
            onClick={() => setActiveTab("service")}
          >
            Service Records
          </button>
          <button
            className={`employee-nav-btn${activeTab === "pending" ? " active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            Pending Records
          </button>
        </nav>

        {/* Tab Content */}
        {activeTab === "employees" && (
          <>
            {/* Employees Table */}
            <div className="employee-table">
              <div className="employee-table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>Full Name</th>
                      <th>Email Address</th>
                      <th>Position</th>
                      <th>Current Step</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeEmployees.length > 0 ? (
                      activeEmployees.map((employee) => (
                        <tr key={employee._id || employee.id}>
                          <td className="lastName">
                            {employee.surname} {employee.firstname} {employee.middlename} {employee.extension ? employee.extension : ""}
                          </td>
                          <td className="employee-data">{employee.email || "-"}</td>
                          <td className="employee-data">{employee.position || "-"}</td>
                          <td className="employee-data">{calculateStep(employee.dateJoined)}</td>
                          <td className="employee-data">
                            <button
                              className="view-button"
                              onClick={() => handleViewClick(employee._id)}
                            >
                              View
                            </button>
                            <button
                              className="delete-employee-button"
                              title="Delete Employee"
                              onClick={() => handleDeleteClick(employee._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No active employees found.</td> {/* Update colspan to 5 */}
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

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
                        <p><b>Extension:</b> <u>{viewEmployee.extension || "-"}</u> </p>
                        <p><b>Civil Status:</b> <u>{viewEmployee.civilStatus}</u> </p>
                        <p><b>Citizenship:</b> <u>{viewEmployee.citizenship}</u> </p>
                        <p><b>Mobile No.:</b> <u>{viewEmployee.mobileNo}</u> </p>
                        <p><b>Email:</b> <u>{viewEmployee.email}</u> </p>
                        <p><b>Birthdate:</b> <u>{viewEmployee.birthdate ? new Date(viewEmployee.birthdate).toLocaleDateString() : "-"}</u> </p>
                        <p><b>Date Joined:</b>
                          <u>
                            {viewEmployee.dateJoined
                              ? (() => {
                                  const d = new Date(viewEmployee.dateJoined);
                                  return isNaN(d.getTime()) ? viewEmployee.dateJoined : d.toLocaleDateString();
                            })()
                          : "-"}
                        </u>
                        </p>
                        <p><b>Gender:</b> <u>{viewEmployee.gender}</u> </p>
                      </div>
                    </div>
                    <div>
                      <div className="view-employee-section-title">Address</div>
                      <div className="view-employee-address-list">
                        <p><b>Province:</b> <u>{viewEmployee.address?.province || "-"}</u></p>
                        <p><b>City/Municipality:</b> <u>{viewEmployee.address?.city || "-"}</u></p>
                        <p><b>Zip Code:</b> <u>{viewEmployee.address?.zipCode || "-"}</u></p>
                        <p><b>Barangay:</b> <u>{viewEmployee.address?.barangay || "-"}</u></p>
                      </div>
                    </div>
                  </div>
                  {viewEmployee.pdsData && (
                    <div>
                      <div className="view-employee-section-title">Extracted PDS Data</div>
                      <div className="view-employee-info-list">
                        {Object.entries(viewEmployee.pdsData).map(([key, value]) => (
                          <p key={key}><b>{key}:</b> <u>{value ? value.toString() : "-"}</u></p>
                        ))}
                      </div>
                    </div>
                  )}
                  {viewEmployee.salnData && (
                    <div>
                      <div className="view-employee-section-title">Extracted SALN Data</div>
                      <div className="view-employee-info-list">
                        {Object.entries(viewEmployee.salnData).map(([key, value]) => (
                          <p key={key}><b>{key}:</b> <u>{value ? value.toString() : "-"}</u></p>
                        ))}
                      </div>
                    </div>
                  )}
                  <button className="view-employee-close-btn" onClick={handleCloseViewModal}>Close</button>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <p>When deleting employee, It's User Account will be lost too. <br/> <b>ARE YOU SURE YOU WANT TO DELETE THIS EMPLOYEE?</b> </p>
                  <div className="modal-actions">
                    <button className="modal-btn yes" onClick={handleDeleteEmployeeConfirmed}>Yes</button>
                    <button className="modal-btn no" onClick={() => { setShowDeleteModal(false); setEmployeeToDelete(null); }}>No</button>
                  </div>
                </div>
              </div>
            )}
            {showDeleteSuccess && (
              <div className="employee-success-popup" style={{background: "#4caf50", color: "#fff"}}>
                Employee Successfully Deleted!
              </div>
            )}
          </>
        )}

        {activeTab === "supporting" && (
          <div>
            <h3>Supporting Documents</h3>
            <div className="uploaded-documents">
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {personalEmployees.length > 0 ? (
                    personalEmployees.map((emp) => (
                      <tr key={emp._id}>
                        <td>
                          {emp.surname} {emp.firstname} {emp.middlename} {emp.extension ? emp.extension : ""}
                        </td>
                        <td>
                          <button
                            className="manage-records-btn"
                            onClick={() => navigate(`/employee-records/${emp._id}/documents`)}
                          >
                            Manage Records
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No employees found.</td> {/* Update colspan to 2 */}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "service" && (
          <div>
            {/* Service Records content goes here */}
            <h3>Service Records</h3>
          </div>
        )}

        {activeTab === "pending" && (
          <div>
            <h3>Pending Records</h3>
            <div className="uploaded-documents">
              <table>
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>File Name</th>
                    <th>Type</th>
                    <th>Date Uploaded</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRecords.length > 0 ? (
                    pendingRecords.map((rec) => (
                      <tr key={rec._id}>
                        <td>{rec.employeeName || rec.employeeId || "-"}</td>
                        <td>{rec.fileName}</td>
                        <td>
                          {/* Show file format type from fileName */}
                          {rec.fileName && rec.fileName.includes('.') 
                            ? rec.fileName.split('.').pop().toUpperCase() 
                            : "-"}
                        </td>
                        <td>{rec.dateUploaded ? new Date(rec.dateUploaded).toLocaleDateString() : "-"}</td>
                        <td>{rec.status}</td>
                        <td>
                          {rec.fileUrl ? (
                            <button
                              className="view-btn"
                              onClick={() => window.open(rec.fileUrl, "_blank")}
                            >
                              View
                            </button>
                          ) : (
                            <span>-</span>
                          )}
                          <button
                            className="approve-btn"
                            style={{ marginLeft: "4px", background: "#4caf50", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "3px" }}
                            onClick={async () => {
                              try {
                                const response = await fetch(`http://localhost:5000/api/documents/${rec._id}/approve`, { method: "POST" });
                                if (!response.ok) throw new Error("Failed to approve record");
                                setPendingRecords((prev) => prev.filter((r) => r._id !== rec._id));
                                alert("Record approved!");
                              } catch (error) {
                                alert("Error approving record.");
                              }
                            }}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            style={{ marginLeft: "4px", background: "#f44336", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "3px" }}
                            onClick={async () => {
                              try {
                                const response = await fetch(`http://localhost:5000/api/documents/${rec._id}/reject`, { method: "POST" });
                                if (!response.ok) throw new Error("Failed to reject record");
                                setPendingRecords((prev) => prev.filter((r) => r._id !== rec._id));
                                alert("Record rejected!");
                              } catch (error) {
                                alert("Error rejecting record.");
                              }
                            }}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">No pending records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "approved" && (
          <div>
            <h3>Approved Employee Records</h3>
            <table>
              <thead>
                <tr>
                  <th>Employee Id</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>PDS Status</th>
                  <th>SALN Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {approvedEmployees.length > 0 ? (
                  approvedEmployees.map((employee) => (
                    <tr key={employee._id}>
                      <td>{employee.id}</td>
                      <td>
                        {employee.surname} {employee.firstname} {employee.middlename}
                      </td>
                      <td>{employee.email}</td>
                      <td>{employee.position}</td>
                      <td>{employee.pdsStatus}</td>
                      <td>{employee.salnStatus}</td>
                      <td>
                        <button onClick={() => setViewEmployee(employee)}>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No approved employees found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            {viewEmployee && (
              <div className="modal-overlay">
                <div className="view-employee-modal">
                  <h3>Employee Details</h3>
                  <p><b>ID:</b> {viewEmployee.id}</p>
                  <p><b>Name:</b> {viewEmployee.surname} {viewEmployee.firstname} {viewEmployee.middlename}</p>
                  <p><b>Email:</b> {viewEmployee.email}</p>
                  <p><b>Position:</b> {viewEmployee.position}</p>
                  <p><b>PDS Status:</b> {viewEmployee.pdsStatus}</p>
                  <p><b>SALN Status:</b> {viewEmployee.salnStatus}</p>
                  {viewEmployee.pdsData && Object.keys(viewEmployee.pdsData).length > 0 && (
                    <div>
                      <h4>PDS Data</h4>
                      {Object.entries(viewEmployee.pdsData).map(([key, value]) => (
                        <p key={key}><b>{key}:</b> {value ? value.toString() : "-"}</p>
                      ))}
                    </div>
                  )}
                  {viewEmployee.salnData && Object.keys(viewEmployee.salnData).length > 0 && (
                    <div>
                      <h4>SALN Data</h4>
                      {Object.entries(viewEmployee.salnData).map(([key, value]) => (
                        <p key={key}><b>{key}:</b> {value ? value.toString() : "-"}</p>
                      ))}
                    </div>
                  )}
                  <button onClick={() => setViewEmployee(null)}>Close</button>
                </div>
              </div>
            )}
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

export default EmployeeRecordsComp;