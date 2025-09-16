import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import "../styles/EmployeeRecords.css";
import { useParams, useNavigate } from "react-router-dom";

const HRPersonalRecordsDocuments = () => {
  const { employeeId } = useParams();
  const [documents, setDocuments] = useState([]);
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

  return (
    <div className="dashboard-container" style={{ background: "#f5f7fa", minHeight: "100vh" }}>
      <main className="main-content">
        <header className="dashboard-header">
          <div className="logo">
            <h2>BEAMS</h2>
          </div>
          <div className="header-icons">
            <span className="icon">📧</span>
            <span className="icon">🔔</span>
            <div className="profile">
              <span>ADMIN</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title" style={{ marginBottom: "0.5rem" }}>
          <h2>Employee Personal Records</h2>
        </div>

        <button
          className="back-btn"
          style={{
            marginBottom: "1.5rem",
            marginLeft: "0.5rem",
            padding: "8px 18px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
          onClick={() => navigate("/employee-records", { state: { tab: "personal" } })}
        >
          ← Back to Personal Records
        </button>

        <div
          className="employee-table"
          style={{
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            padding: "24px",
            margin: "0 0.5rem 2rem 0.5rem"
          }}
        >
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
                          onClick={async () => {
                            // Example: Update status to "Validated"
                            await fetch(`http://localhost:5000/api/documents/${doc._id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ status: "Validated" }),
                            });
                            // Optionally, refresh the table
                            alert("Document approved and validated!");
                          }}
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
      </main>
    </div>
  );
};

export default HRPersonalRecordsDocuments;