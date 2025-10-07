import React, { useState, useEffect, useRef } from "react";
import "../styles/Dashboard.css";
import "../styles/PersonalDocuments.css";
import profileImage from "../assets/profile-user.png";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "./NotificationPopUp";

const PersonalDocumentsComp = ({
  unreadNotifications = [],
  readNotifications = [],
  handleMarkAsRead,
  userType = "employee",
}) => {
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState("EmployeeRecords");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notification, setNotification] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Fetch documents for the logged-in employee
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const employeeId = user?._id;
    if (!employeeId) return;

    const fetchDocuments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/documents?employeeId=${employeeId}`);
        const data = await response.json();
        setUploadedDocuments(data);
      } catch (error) {
        setUploadedDocuments([]);
      }
    };

    fetchDocuments();
  }, []);

  // Allowed file types for each tab
  const allowedTypes = {
    EmployeeRecords: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    Supporting: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/png",
      "image/jpeg",
    ],
  };

  // Accept attribute for input
  const acceptAttr = {
    EmployeeRecords: ".pdf,.doc,.docx",
    Supporting: ".pdf,.doc,.docx,.png,.jpg,.jpeg",
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setNotification("");
  };

  const handleUpload = async () => {
    if (file) {
      if (!allowedTypes[activeTab].includes(file.type)) {
        setNotification("❌ Invalid file type for this tab.");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const employeeId = user?._id;
      if (!employeeId) {
        setNotification("❌ User Employee ID missing. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("employeeId", employeeId);
      formData.append("type", activeTab === "EmployeeRecords" ? "EmployeeRecord" : "Supporting");
      formData.append("status", "Pending");

      try {
        const response = await fetch("http://localhost:5000/api/documents", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          setNotification("❌ Failed to upload file to server.");
          return;
        }

        const result = await response.json();
        // Refetch documents after upload
        const fetchDocuments = async () => {
          try {
            const response = await fetch(`http://localhost:5000/api/documents?employeeId=${employeeId}`);
            const data = await response.json();
            setUploadedDocuments(data);
          } catch (error) {
            setUploadedDocuments([]);
          }
        };
        fetchDocuments();

        setFile(null);
        setNotification("✅ File uploaded successfully!");
      } catch (error) {
        setNotification("❌ Error uploading file.");
        console.error(error);
      }
    } else {
      setNotification("❌ Please select a file to upload.");
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (!allowedTypes[activeTab].includes(droppedFile.type)) {
        setNotification("❌ Invalid file type for this tab.");
        return;
      }
      setFile(droppedFile);
      setNotification("");
    }
  };

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/login");
  };

  // Optionally implement delete and validation actions with backend support

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
      <main className="document-content">
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
          <h2>Personal Documents</h2>
        </div>

        {/* File Upload Section */}
        <div className="navigation-tab">
          <div className="file-upload-section">
            <div className="file-buttons">
              <input
                type="file"
                id="fileInput"
                ref={fileInputRef}
                accept={acceptAttr[activeTab]}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="fileInput" className="browse-button">
                Browse
              </label>
              <button
                className="upload-button"
                onClick={handleUpload}
                disabled={!file}
              >
                Upload
              </button>
              {activeTab === "EmployeeRecords" && (
                <>
                  <button
                    className="create-button"
                    onClick={() => navigate("/pds-form")}
                  >
                    Create PDS
                  </button>
                  <button
                    className="create-button"
                    onClick={() => navigate("/saln-form")}
                  >
                    Create SALN
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tab Buttons & Drag and Drop Area */}
          <div className="file-type-section">
            <div className="file-type-buttons">
              <button
                className={`type-btn ${activeTab === "EmployeeRecords" ? "active" : ""}`}
                onClick={() => setActiveTab("EmployeeRecords")}
              >
                Employee Records
              </button>
              <button
                className={`type-btn ${activeTab === "Supporting" ? "active" : ""}`}
                onClick={() => setActiveTab("Supporting")}
              >
                Supporting Documents
              </button>
            </div>
            <div
              className={`file-drop-area${dragActive ? " drag-active" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              style={{ cursor: "pointer", marginTop: "16px" }}
            >
              <p>
                Drag & drop your file here, or <span style={{ color: "#1976d2", textDecoration: "underline" }}>browse</span>
              </p>
              <p style={{ fontSize: "0.9em", color: "#888" }}>
                Allowed: {acceptAttr[activeTab].replace(/\./g, '').replace(/,/g, ', ')}
              </p>
            </div>
          </div>
        </div>

        {file && (
          <div className="selected-file-info">
            <p><b>Selected file:</b> {file.name}</p>
            <p><b>Type:</b> {file.type}</p>
            <p><b>Size:</b> {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}

        {/* Notification */}
        {notification && (
          <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded flex items-center">
            <span role="img" aria-label="bell" className="mr-2">🔔</span> {notification}
          </div>
        )}

        {/* Employee Records Table */}
        {activeTab === "EmployeeRecords" && (
          <div className="personal-documents-table">
            <h3>Employee Records (PDS & SALN)</h3>
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>File Type</th>
                  <th>Date Uploaded</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {uploadedDocuments.filter(
                  (doc) => doc.type === "PDS" || doc.type === "SALN" || doc.type === "EmployeeRecord"
                ).length > 0 ? (
                  uploadedDocuments
                    .filter(
                      (doc) => doc.type === "PDS" || doc.type === "SALN" || doc.type === "EmployeeRecord"
                    )
                    .map((doc) => (
                      <tr key={doc._id}>
                        <td>{doc.fileName}</td>
                        <td>{doc.fileName.split('.').pop().toUpperCase()}</td>
                        <td>{doc.dateUploaded ? new Date(doc.dateUploaded).toLocaleDateString() : "-"}</td>
                        <td>{doc.status}</td>
                        <td>
                          {doc.fileUrl ? (
                            <button
                              className="view-btn"
                              onClick={() => window.open(doc.fileUrl, "_blank")}
                            >
                              View
                            </button>
                          ) : (
                            <span>-</span>
                          )}
                          {/* Add delete/validate actions as needed */}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5">No Employee Records uploaded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Supporting Documents Table */}
        {activeTab === "Supporting" && (
          <div className="personal-documents-table">
            <h3>Supporting Documents</h3>
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Date Uploaded</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {uploadedDocuments.filter((doc) => doc.type === "Supporting").length > 0 ? (
                  uploadedDocuments
                    .filter((doc) => doc.type === "Supporting")
                    .map((doc) => (
                      <tr key={doc._id}>
                        <td>{doc.fileName}</td>
                        <td>{doc.dateUploaded ? new Date(doc.dateUploaded).toLocaleDateString() : "-"}</td>
                        <td>{doc.status}</td>
                        <td>
                          {doc.fileUrl ? (
                            <button
                              className="view-btn"
                              onClick={() => window.open(doc.fileUrl, "_blank")}
                            >
                              View
                            </button>
                          ) : (
                            <span>-</span>
                          )}
                          {/* Add delete action as needed */}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4">No Supporting Documents uploaded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <NotificationPopup
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
          userType={userType}
          unreadNotifications={unreadNotifications}
          readNotifications={readNotifications}
          onMarkAsRead={handleMarkAsRead}
        />
      </main>
    </div>
  );
};

export default PersonalDocumentsComp;
