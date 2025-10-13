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
  const [readNotifIds, setReadNotifIds] = useState(() => {
    const saved = localStorage.getItem("readNotifIds");
    return saved ? JSON.parse(saved) : [];
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRecordId, setRejectRecordId] = useState(null);
  const [rejectFeedback, setRejectFeedback] = useState("");
  const navigate = useNavigate();

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
        const sorted = normalized.sort((a, b) => a.surname.localeCompare(b.surname));
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

  // Fetch pending records for review (notifications)
  useEffect(() => {
    const fetchPendingRecords = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/documents?status=Pending");
        const data = await response.json();

        // Attach employee name to each record
        const recordsWithNames = await Promise.all(
          data.map(async (rec) => {
            if (rec.employeeName) return rec;
            if (rec.employeeId) {
              try {
                const empRes = await fetch(`http://localhost:5000/api/employees/${rec.employeeId}`);
                const empData = await empRes.json();
                return {
                  ...rec,
                  employeeName: `${empData.surname} ${empData.firstname} ${empData.middlename || ""}`.trim(),
                };
              } catch {
                return { ...rec, employeeName: rec.employeeId };
              }
            }
            return rec;
          })
        );

        setPendingRecords(recordsWithNames);
      } catch (error) {
        setPendingRecords([]);
        console.error("Error fetching pending records:", error);
      }
    };
    fetchPendingRecords();
    const interval = setInterval(fetchPendingRecords, 30000);
    return () => clearInterval(interval);
  }, []);

  // Notification logic
  const unreadNotifications = pendingRecords.filter(
    (rec) => !readNotifIds.includes(rec._id)
  );
  const readNotifications = pendingRecords.filter(
    (rec) => readNotifIds.includes(rec._id)
  );

  const handleMarkAsRead = (notifId) => {
    setReadNotifIds((prev) => {
      const updated = [...prev, notifId];
      localStorage.setItem("readNotifIds", JSON.stringify(updated));
      return updated;
    });
  };

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

  useEffect(() => {
    const tab = localStorage.getItem("employeeRecordsActiveTab");
    if (tab) {
      setActiveTab(tab);
      localStorage.removeItem("employeeRecordsActiveTab");
    }
  }, []);

  // Reject handler
  const handleRejectClick = (recordId) => {
    setRejectRecordId(recordId);
    setRejectFeedback("");
    setShowRejectModal(true);
  };

  const handleSendReject = async () => {
    if (!rejectRecordId || !rejectFeedback.trim()) {
      alert("Please provide feedback before rejecting.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/documents/${rejectRecordId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: rejectFeedback }),
      });
      if (!response.ok) throw new Error("Failed to reject record");
      setPendingRecords((prev) => prev.filter((r) => r._id !== rejectRecordId));
      setShowRejectModal(false);
      setRejectRecordId(null);
      setRejectFeedback("");
    } catch (error) {
      alert("Error rejecting record.");
    }
  };

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        setEmployees([]);
      }
    };
    fetchEmployees();
  }, []);

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
              style={{ cursor: "pointer", position: "relative" }}
              onClick={() => setShowNotifications(true)}
            >
              🔔
              {unreadNotifications.length > 0 && (
                <span className="notif-badge">{unreadNotifications.length}</span>
              )}
            </span>
            <div className="profile">
              <img src={Image} alt="Image" />
              <span>HR OFFICER</span>
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
            Employee List
          </button>
          <button
            className={`employee-nav-btn${activeTab === "documents" ? " active" : ""}`}
            onClick={() => setActiveTab("documents")}
          >
            Employee Documents
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
            <h3>Employee List</h3>
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
                        <td colSpan="5">No active employees found.</td>
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
                  {viewEmployee.pdsStatus === "Approved" ? (
                    <div className="view-employee-details-grid">
                      {/* PERSONAL INFORMATION */}
                      <div>
                        <div className="view-employee-section-title">Personal Information</div>
                        <div className="view-employee-info-list">
                          <p><b>Surname:</b> <u>{viewEmployee.surname || "-"}</u></p>
                          <p><b>First Name:</b> <u>{viewEmployee.firstName || "-"}</u></p>
                          <p><b>Middle Name:</b> <u>{viewEmployee.middleName || "-"}</u></p>
                          <p><b>Name Extension:</b> <u>{viewEmployee.nameExt || "-"}</u></p>
                          <p><b>Date of Birth:</b> <u>{viewEmployee.dateOfBirth || "-"}</u></p>
                          <p><b>Place of Birth:</b> <u>{viewEmployee.placeOfBirth || "-"}</u></p>
                          <p><b>Sex:</b> <u>{viewEmployee.sex || "-"}</u></p>
                          <p><b>Civil Status:</b> <u>{viewEmployee.civilStatus || "-"}</u></p>
                          <p><b>Height (m):</b> <u>{viewEmployee.height || "-"}</u></p>
                          <p><b>Weight (kg):</b> <u>{viewEmployee.weight || "-"}</u></p>
                          <p><b>Blood Type:</b> <u>{viewEmployee.bloodType || "-"}</u></p>
                          <p><b>GSIS ID No.:</b> <u>{viewEmployee.gsis || "-"}</u></p>
                          <p><b>PAG-IBIG ID No.:</b> <u>{viewEmployee.pagibig || "-"}</u></p>
                          <p><b>PHILHEALTH No.:</b> <u>{viewEmployee.philhealth || "-"}</u></p>
                          <p><b>SSS No.:</b> <u>{viewEmployee.sss || "-"}</u></p>
                          <p><b>TIN No.:</b> <u>{viewEmployee.tin || "-"}</u></p>
                          <p><b>Agency Employee No.:</b> <u>{viewEmployee.agencyEmployeeNo || "-"}</u></p>
                          <p><b>Citizenship:</b> <u>{viewEmployee.citizenship || "-"}</u></p>
                          <p><b>Dual Citizenship Type:</b> <u>{viewEmployee.dualType || "-"}</u></p>
                          <p><b>Citizenship Country:</b> <u>{viewEmployee.citizenshipCountry || "-"}</u></p>
                        </div>
                      </div>

                      {/* FAMILY BACKGROUND */}
                      <div>
                        <div className="view-employee-section-title">Family Background</div>
                        <div className="view-employee-info-list">
                          <p><b>Spouse:</b></p>
                          <p>Surname: <u>{viewEmployee.spouse_surname || "-"}</u></p>
                          <p>First Name: <u>{viewEmployee.spouse_first || "-"}</u></p>
                          <p>Name Extension: <u>{viewEmployee.spouse_extension || "-"}</u></p>
                          <p>Middle Name: <u>{viewEmployee.spouse_middle || "-"}</u></p>
                          <p>Occupation: <u>{viewEmployee.spouse_occupation || "-"}</u></p>
                          <p>Employer/Business Name: <u>{viewEmployee.spouse_employer || "-"}</u></p>
                          <p>Business Address: <u>{viewEmployee.spouse_businessAddress || "-"}</u></p>
                          <p>Telephone No.: <u>{viewEmployee.spouse_tel || "-"}</u></p>
                          <p><b>Children:</b></p>
                          {(viewEmployee.children && viewEmployee.children.length > 0) ? (
                            viewEmployee.children.map((child, idx) => (
                              <p key={idx}>
                                {child.name || "-"} ({child.dob || "-"})
                              </p>
                            ))
                          ) : (
                            <p>-</p>
                          )}
                          <p><b>Father:</b></p>
                          <p>Surname: <u>{viewEmployee.father_surname || "-"}</u></p>
                          <p>First Name: <u>{viewEmployee.father_first || "-"}</u></p>
                          <p>Middle Name: <u>{viewEmployee.father_middle || "-"}</u></p>
                          <p>Name Extension: <u>{viewEmployee.father_ext || "-"}</u></p>
                          <p><b>Mother:</b></p>
                          <p>Surname: <u>{viewEmployee.mother_surname || "-"}</u></p>
                          <p>First Name: <u>{viewEmployee.mother_first || "-"}</u></p>
                          <p>Middle Name: <u>{viewEmployee.mother_middle || "-"}</u></p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: "2rem", textAlign: "center" }}>
                      <b>No approved PDS yet.</b>
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

        {activeTab === "documents" && (
          <div>
            <h3>Employee Documents</h3>
            <div className="uploaded-documents">
              <table>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeEmployees.length > 0 ? (
                    activeEmployees.map((employee) => (
                      <tr key={employee._id || employee.id}>
                        <td>
                          {employee.surname} {employee.firstname} {employee.middlename} {employee.extension ? employee.extension : ""}
                        </td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() => navigate(`/employee-records/${employee._id}/documents`)}
                          >
                            View Documents
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">No employees found.</td>
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
                        <td>{rec.employeeId ? `${rec.employeeId.surname} ${rec.employeeId.firstname} ${rec.employeeId.middlename} ${rec.employeeId.extension || ""}` : "-"}</td>
                        <td>{rec.fileName}</td>
                        <td>
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
                              } catch (error) {
                                alert("Error approving record.");
                              }
                            }}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            style={{ marginLeft: "4px", background: "#3639f4ff", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "3px" }}
                            onClick={() => handleRejectClick(rec._id)}
                          >
                            Submit
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

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Reject Document</h3>
              <p>Please provide feedback for the employee:</p>
              <textarea
                value={rejectFeedback}
                onChange={e => setRejectFeedback(e.target.value)}
                rows={4}
                style={{ width: "100%", marginBottom: "12px" }}
                placeholder="Why are you rejecting this document?"
              />
              <div className="modal-actions">
                <button
                  className="modal-btn"
                  style={{ background: "#f44336", color: "#fff" }}
                  onClick={handleSendReject}
                >
                  Reject
                </button>
                <button
                  className="modal-btn"
                  style={{ background: "#ccc", color: "#333" }}
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectRecordId(null);
                    setRejectFeedback("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <NotificationPopup
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
          userType="hr"
          unreadNotifications={unreadNotifications}
          readNotifications={readNotifications}
          onMarkAsRead={handleMarkAsRead}
        />
      </main>
    </div>
  );
};

export default EmployeeRecordsComp;