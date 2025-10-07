import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotificationPopup.css";

const NotificationPopup = ({
  visible,
  onClose,
  unreadNotifications = [],
  readNotifications = [],
  onMarkAsRead,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("unread");

  if (!visible) return null;
  const notifications = activeTab === "unread" ? unreadNotifications : readNotifications;

  return (
    <div className="notification-popup-overlay">
      <div className="notification-popup-window">
        <div className="notification-popup-header">
          <h3>Mailbox</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="notification-tabs" style={{ display: "flex", borderBottom: "1px solid #e3eafc" }}>
          <button
            className={`notif-tab-btn${activeTab === "unread" ? " active" : ""}`}
            onClick={() => setActiveTab("unread")}
          >
            New
          </button>
          <button
            className={`notif-tab-btn${activeTab === "read" ? " active" : ""}`}
            onClick={() => setActiveTab("read")}
          >
            Read
          </button>
        </div>
        <div className="notification-popup-body">
          {notifications.length > 0 ? (
            notifications.map((note, idx) => (
              <div
                key={note._id || idx}
                className="notification-item"
                style={{ opacity: activeTab === "read" ? 0.6 : 1 }}
              >
                <b
                  className="notification-title-link"
                  style={{ color: "#1976d2", cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => {
                    if (note.fileUrl) {
                      window.open(note.fileUrl, "_blank");
                    }
                    if (activeTab === "unread" && onMarkAsRead) {
                      onMarkAsRead(note._id);
                    }
                  }}
                >
                  New Document Submitted
                </b>
                <p>
                  {note.employeeName || note.employeeId || "Unknown Employee"} submitted <b>{note.fileName}</b>
                </p>
                <span className="notification-date">
                  {note.dateUploaded ? new Date(note.dateUploaded).toLocaleDateString() : ""}
                </span>
              </div>
            ))
          ) : (
            <div className="notification-empty">No {activeTab === "unread" ? "new" : "read"} notifications.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;