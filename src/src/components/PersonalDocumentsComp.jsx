import React, { useState } from "react";
import "../styles/Dashboard.css"; 
import "../styles/PersonalDocuments.css"; 
import profileImage from "../assets/profile-user.png"; 
import { useNavigate } from "react-router-dom"; 
import NotificationPopup from "./NotificationPopUp";

const PersonalDocuments = () => {
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

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      const newDocument = {
        fileName: file.name,
        type: activeTab === "EmployeeRecords" ? "EmployeeRecords" : "Supporting",
        dateUploaded: new Date().toLocaleDateString(),
        status: "Pending",
      };
      setUploadedDocuments([...uploadedDocuments, newDocument]);
      setFile(null);
      alert("File uploaded successfully!");
    } else {
      alert("Please select a file to upload.");
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
          <div className="  -icon">EMPLOYEE</div>
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
              style={{ marginLeft: "10px" }}
            >
              Upload
            </button>
            <button
              className="create-button"
              style={{ marginLeft: "10px" }}
              onClick={() => alert("Create PDS coming soon...")}
            >
              Create PDS
            </button>
            <button
              className="create-button"
              style={{ marginLeft: "10px" }}
              onClick={() => alert("Create SALN coming soon...")}
            >
              Create SALN
            </button>
          </div>

          {file && (
            <div className="selected-file-info">
              <p><b>Selected file:</b> {file.name}</p>
              <p><b>Type:</b> {file.type}</p>
              <p><b>Size:</b> {(file.size / 1024).toFixed(2)} KB</p>
            </div>
          )}
        </div>

        {/* Tab Buttons */}
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
        </div>
        </div>

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
                        <td>{doc.type}</td>
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
          userType="employee"
        />
      </main>
    </div>
  );
};

export default PersonalDocuments;
