import React, { useState, useRef } from "react";
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
  const [uploadedDocuments, setUploadedDocuments] = useState([
    {
      fileName: "PDS_2025.pdf",
      type: "PDS",
      dateUploaded: "April 27, 2025",
      status: "Pending",
    },
    {
      fileName: "SALN.pdf",
      type: "SALN",
      dateUploaded: "March 31, 2025",
      status: "Verified",
    },
    {
      fileName: "Resume.pdf",
      type: "Supporting",
      dateUploaded: "May 5, 2025",
      status: "Pending",
    },
  ]);
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState("EmployeeRecords");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notification, setNotification] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
    setNotification(""); // Clear previous notification
  };

  const handleUpload = async () => {
    if (file) {
      // Validate file type based on active tab
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
        // Adjust the endpoint as needed for your backend
        const response = await fetch("http://localhost:5000/api/documents", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          setNotification("❌ Failed to upload file to server.");
          return;
        }

        const result = await response.json();

        const newDocument = {
          fileName: file.name,
          type: activeTab === "EmployeeRecords" ? "EmployeeRecords" : "Supporting",
          dateUploaded: new Date().toLocaleDateString(),
          status: "Pending",
        };
        setUploadedDocuments([...uploadedDocuments, newDocument]);
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
      // Validate file type based on active tab
      if (!allowedTypes[activeTab].includes(droppedFile.type)) {
        setNotification("❌ Invalid file type for this tab.");
        return;
      }
      setFile(droppedFile);
      setNotification(""); // Clear previous notification
    }
  };

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/login");
  };

  const handleDelete = (fileName) => {
    const updatedDocuments = uploadedDocuments.filter(
      (doc) => doc.fileName !== fileName
    );
    setUploadedDocuments(updatedDocuments);
    alert("File deleted successfully!");
  };

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
          <div className="uploaded-documents">
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
                  (doc) => doc.type === "PDS" || doc.type === "SALN" || doc.type === "EmployeeRecords"
                ).length > 0 ? (
                  uploadedDocuments
                    .filter(
                      (doc) => doc.type === "PDS" || doc.type === "SALN" || doc.type === "EmployeeRecords"
                    )
                    .map((doc) => (
                      <tr key={doc.fileName}>
                        <td>{doc.fileName}</td>
                        <td>{doc.fileName.split('.').pop().toUpperCase()}</td>
                        <td>{doc.dateUploaded}</td>
                        <td>{doc.status}</td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() => alert(`Viewing ${doc.fileName}`)}
                          >
                            View
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(doc.fileName)}
                          >
                            Request Delete
                          </button>
                          <button
                            className="validate-btn"
                            onClick={() => alert(`Submitted ${doc.fileName} for validation`)}
                          >
                            Submit for Validation
                          </button>
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
          <div className="uploaded-documents">
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
                      <tr key={doc.fileName}>
                        <td>{doc.fileName}</td>
                        <td>{doc.dateUploaded}</td>
                        <td>{doc.status}</td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() => alert(`Viewing ${doc.fileName}`)}
                          >
                            View
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(doc.fileName)}
                          >
                            Request Delete
                          </button>
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
