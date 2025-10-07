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
  const [pendingRecords, setPendingRecords] = useState([]);
  const [readNotifIds, setReadNotifIds] = useState([]);
  const [activeTab, setActiveTab] = useState("EmployeeRecords");
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
    fetchPendingRecords();
    const interval = setInterval(fetchPendingRecords, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const handleDelete = async (docId) => {
    try {
      await fetch(`http://localhost:5000/api/documents/${docId}`, {
        method: "DELETE",
      });
      setNotification({ visible: true, message: "Document deleted successfully." });
      // Refresh documents after deletion
      setDocuments((prevDocs) => prevDocs.filter((doc) => doc._id !== docId));
    } catch (error) {
      setNotification({ visible: true, message: "Error deleting document." });
    }
  };

  const unreadNotifications = pendingRecords.filter(
    (rec) => !readNotifIds.includes(rec._id)
  );
  const readNotifications = pendingRecords.filter(
    (rec) => readNotifIds.includes(rec._id)
  );

  const handleMarkAsRead = (notifId) => {
    setReadNotifIds((prev) => [...prev, notifId]);
  };

  const employeeRecords = documents.filter(
    (doc) => doc.type === "PDS" || doc.type === "SALN" || doc.type === "EmployeeRecord"
  );
  const supportingDocuments = documents.filter(
    (doc) => doc.type === "Supporting"
  );

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
              style={{ cursor: "pointer", position: "relative" }}
              onClick={() => setShowNotifications(true)}
            >
              🔔
              {unreadNotifications.length > 0 && (
                <span className="notif-badge">{unreadNotifications.length}</span>
              )}
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

        <div className="file-type-buttons" style={{ marginBottom: "1rem" }}>
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

        {activeTab === "EmployeeRecords" && (
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
                  {employeeRecords.length > 0 ? (
                    employeeRecords.map((doc) => (
                      <tr key={doc._id}>
                        <td>{doc.fileName}</td>
                        <td>{doc.fileType || doc.type}</td>
                        <td>{doc.dateUploaded ? new Date(doc.dateUploaded).toLocaleDateString() : "-"}</td>
                        <td>{doc.status}</td>
                        <td>
                          <button className="view-btn" onClick={() => window.open(doc.fileUrl, "_blank")}>View</button>
                          <button className="delete-btn" onClick={() => handleDelete(doc._id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No employee records found for this employee.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "Supporting" && (
          <div className="employee-table">
            <div className="employee-table-scroll" style={{ maxHeight: "60vh", overflowY: "auto" }}>
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
                  {supportingDocuments.length > 0 ? (
                    supportingDocuments.map((doc) => (
                      <tr key={doc._id}>
                        <td>{doc.fileName}</td>
                        <td>{doc.dateUploaded ? new Date(doc.dateUploaded).toLocaleDateString() : "-"}</td>
                        <td>{doc.status}</td>
                        <td>
                          <button className="view-btn" onClick={() => window.open(doc.fileUrl, "_blank")}>View</button>
                          <button className="delete-btn" onClick={() => handleDelete(doc._id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No supporting documents found for this employee.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {notification.visible && (
          <NotificationPopup message={notification.message} onClose={() => setNotification({ visible: false, message: "" })} />
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

export default HRPersonalRecordsDocuments;