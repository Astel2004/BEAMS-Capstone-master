import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import "../styles/EmployeeRecords.css";
import "../styles/HRPersonalRecordsDocuments.css";
import { useParams, useNavigate } from "react-router-dom";
import NotificationPopup from "./NotificationPopUp";

const HRPersonalRecordsDocuments = () => {
  const { employeeId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [notification, setNotification] = useState({ visible: false, message: "" });
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/documents?type=Personal&employeeId=${employeeId}`);
        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        setDocuments([]);
      }
    };
    fetchDocs();
  }, [employeeId]);

  const handleApprove = async (docId) => {
    try {
      await fetch(`http://localhost:5000/api/documents/${docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Validated" }),
      });
      setNotification({ visible: true, message: "Document approved and validated!" });
      // Refresh documents after approval
      setDocuments((prevDocs) =>
        prevDocs.map((doc) => (doc._id === docId ? { ...doc, status: "Validated" } : doc))
      );
    } catch (error) {
      setNotification({ visible: true, message: "Error approving document." });
    }
  };

  return (
    <div className="dashboard-container" style={{ background: "#f5f7fa", minHeight: "100vh" }}>
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
              <span>HR OFFICER</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title" style={{ marginBottom: "0.5rem" }}>
          <h2>Employee Personal Records</h2>
        </div>

        <button
          className="back-btn" onClick={() => navigate("/employee-records", { state: { tab: "personal" } })}
        >
          ← Back to Personal Records
        </button>

        <div className="employee-table">
          <div className="employee-table-scroll" style={{ maxHeight: "60vh", overflowY: "auto" }}>
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
                {documents.length > 0 ? (
                  documents.map((doc) => (
                    <tr key={doc._id}>
                      <td>{doc.fileName}</td>
                      <td>{doc.fileType || doc.type}</td>
                      <td>{doc.dateUploaded ? new Date(doc.dateUploaded).toLocaleDateString() : "-"}</td>
                      <td>{doc.status}</td>
                      <td>
                        <button className="view-btn" onClick={() => window.open(doc.fileUrl, "_blank")}>View</button>
                        <button
                          className="approve-btn"
                          onClick={() => handleApprove(doc._id)}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No personal records found for this employee.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {notification.visible && (
          <NotificationPopup message={notification.message} onClose={() => setNotification({ visible: false, message: "" })} />
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

export default HRPersonalRecordsDocuments;