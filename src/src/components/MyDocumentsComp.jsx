import React, { useState } from "react";
import "../styles/Dashboard.css"; // Reuse the same CSS for sidebar and navbar
import "../styles/MyDocuments.css"; // Add specific styles for My Documents
import profileImage from "../assets/profile-user.png"; // Import the profile image
import { useNavigate } from "react-router-dom"; // Import useNavigate

const MyDocumentsComp = () => {
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
  const [fileType, setFileType] = useState("PDF"); // State for selected file type
  const [file, setFile] = useState(null); // State for the selected file
  const navigate = useNavigate(); // Initialize useNavigate

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (file) {
      const newDocument = {
        fileName: file.name,
        type: fileType,
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
            <li onClick={() => navigate("/my-documents")}>My Documents</li>
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
            <span className="icon">🔔</span>
            <div className="profile">
              <img src={profileImage} alt="Profile" />
              <span>USER</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>My Documents</h2>
        </div>

        {/* File Upload Section */}
        <div className="file-upload-section">
          <div className="file-drop-area">
            <p>Drag and Drop Files Here</p>
            <p>or</p>
            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <label htmlFor="fileInput" className="browse-button">
              Browse
            </label>
          </div>
          <div className="file-type-section">
            <p>Choose File Type</p>
            <div className="file-type-buttons">
              <button
                className={fileType === "PDF" ? "active" : ""}
                onClick={() => setFileType("PDF")}
              >
                PDF
              </button>
              <button
                className={fileType === "DOCX" ? "active" : ""}
                onClick={() => setFileType("DOCX")}
              >
                DOCX
              </button>
            </div>
            <button className="upload-button" onClick={handleUpload}>
              Upload
            </button>
          </div>
        </div>

        {/* Uploaded Documents Table */}
        <div className="uploaded-documents">
          <h3>Uploaded Documents</h3>
          <table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Type</th>
                <th>Date Uploaded</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {uploadedDocuments.length > 0 ? (
                uploadedDocuments.map((doc) => (
                  <tr key={doc.fileName}>
                    <td>{doc.fileName}</td>
                    <td>{doc.type}</td>
                    <td>{doc.dateUploaded}</td>
                    <td>{doc.status}</td>
                    <td>
                      <button className="view-button">View</button>
                      {doc.status === "Pending" && (
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(doc.fileName)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No documents uploaded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default MyDocumentsComp;