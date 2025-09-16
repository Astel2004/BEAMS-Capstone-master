import React, { useState } from "react";
import "../styles/Dashboard.css"; // Reuse the same CSS for sidebar and navbar
import "../styles/PersonalDocuments.css"; // Add specific styles for Personal Documents
import profileImage from "../assets/profile-user.png"; // Import the profile image
import { useNavigate } from "react-router-dom"; // Import useNavigate
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
  ]); // Example uploaded documents
  const [file, setFile] = useState(null); // State for the selected file
  const [activeTab, setActiveTab] = useState("PDS"); // State for the active tab
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    // Example notifications
    {
      title: "Welcome!",
      message: "Your profile was updated.",
      date: "2025-09-16",
    },
    {
      title: "Step Increment",
      message: "You are eligible for a step increment.",
      date: "2025-09-15",
    },
  ]);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      let type = "Other";
      if (file.type === "application/pdf") type = "PDF";
      else if (file.type.startsWith("image/")) type = "Image";
      const newDocument = {
        fileName: file.name,
        type,
        dateUploaded: new Date().toLocaleDateString(),
        status: "Pending",
      };
      setUploadedDocuments([...uploadedDocuments, newDocument]);
      setFile(null); // Reset file input
      alert("File uploaded successfully!");
    } else {
      alert("Please select a file to upload.");
    }
  };

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing tokens)
    alert("You have been logged out.");
    navigate("/login"); // Redirect to the login page
  };

  const handleDelete = (fileName) => {
    const updatedDocuments = uploadedDocuments.filter(
      (doc) => doc.fileName !== fileName
    );
    setUploadedDocuments(updatedDocuments);
    alert("File deleted successfully!");
  };

  const getAcceptTypes = () => {
    if (activeTab === "SALN" || activeTab === "PDS") {
      return ".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }
    // EmployeeRecords and Uploaded can accept any file type
    return "";
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
        <div className="file-upload-section">
          <div className="file-drop-area">
            {file ? (
              <div className="selected-file-info">
                <p>
                  <b>Selected file:</b> {file.name}
                </p>
                <p>
                  <b>Type:</b> {file.type}
                </p>
                <p>
                  <b>Size:</b> {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <>
                <p>Drag and Drop Files Here</p>
                <p>or</p>
              </>
            )}
            <input
              type="file"
              id="fileInput"
              accept={getAcceptTypes()}
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
          </div>
          <div className="file-type-section">
            <div className="file-type-buttons">
              <button
                className="type-btn"
                onClick={() => setActiveTab("PDS")}
              >
                PDS File
              </button>
              <button
                className="type-btn"
                onClick={() => setActiveTab("SALN")}
              >
                SALN File
              </button>
              <button
                className="type-btn"
                onClick={() => setActiveTab("EmployeeRecords")}
              >
                Employee Records
              </button>
              <button
                className="type-btn"
                onClick={() => setActiveTab("Uploaded")}
              >
                Uploaded Documents
              </button>
            </div>
          </div>
        </div>

        {/* Uploaded Documents Table */}
        {activeTab === "PDS" && (
          <div className="uploaded-documents">
            <h3>PDS Documents</h3>
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
                {uploadedDocuments.filter((doc) => doc.type === "PDS").length > 0 ? (
                  uploadedDocuments
                    .filter((doc) => doc.type === "PDS")
                    .map((doc) => (
                      <tr key={doc.fileName}>
                        <td>{doc.fileName}</td>
                        <td>{doc.dateUploaded}</td>
                        <td>{doc.status}</td>
                        <td>
                          <button className="view-btn" onClick={() => alert(`Viewing ${doc.fileName}`)}>View</button>
                          <button className="delete-btn" onClick={() => handleDelete(doc.fileName)}>Request Delete</button>
                          <button className="validate-btn" onClick={() => alert(`Submitted ${doc.fileName} for validation`)}>Submit for Validation</button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4">No PDS documents uploaded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "SALN" && (
          <div className="uploaded-documents">
            <h3>SALN Documents</h3>
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
                {uploadedDocuments.filter((doc) => doc.type === "SALN").length > 0 ? (
                  uploadedDocuments
                    .filter((doc) => doc.type === "SALN")
                    .map((doc) => (
                      <tr key={doc.fileName}>
                        <td>{doc.fileName}</td>
                        <td>{doc.dateUploaded}</td>
                        <td>{doc.status}</td>
                        <td>
                          <button className="view-btn" onClick={() => alert(`Viewing ${doc.fileName}`)}>View</button>
                          <button className="delete-btn" onClick={() => handleDelete(doc.fileName)}>Request Delete</button>
                          <button className="validate-btn" onClick={() => alert(`Submitted ${doc.fileName} for validation`)}>Submit for Validation</button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4">No SALN documents uploaded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "EmployeeRecords" && (
          <div className="uploaded-documents">
            <h3>Employee Records</h3>
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
                  (doc) => doc.type === "EmployeeRecords"
                ).length > 0 ? (
                  uploadedDocuments
                    .filter((doc) => doc.type === "EmployeeRecords")
                    .map((doc) => (
                      <tr key={doc.fileName}>
                        <td>{doc.fileName}</td>
                        <td>{doc.type}</td>
                        <td>{doc.dateUploaded}</td>
                        <td>{doc.status}</td>
                        <td>
                          <button
                            className="view-btn"
                            onClick={() =>
                              alert(`Viewing ${doc.fileName}`)
                            }
                          >
                            View
                          </button>
                          <button
                            className="edit-btn"
                            onClick={() =>
                              alert(`Editing ${doc.fileName}`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(doc.fileName)}
                          >
                            Delete
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

        {activeTab === "Uploaded" && (
          <div className="uploaded-documents">
            <h3>Uploaded Documents</h3>
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Date Uploaded</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {uploadedDocuments.filter(doc => doc.type === "Uploaded").length > 0 ? (
                  uploadedDocuments
                    .filter(doc => doc.type === "Uploaded")
                    .map(doc => (
                      <tr key={doc.fileName}>
                        <td>{doc.fileName}</td>
                        <td>{doc.type}</td>
                        <td>{doc.dateUploaded}</td>
                        <td>{doc.status}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4">No documents uploaded yet.</td>
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