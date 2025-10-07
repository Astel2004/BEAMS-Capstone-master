import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotificationPopup.css";

const NotificationPopup = ({
  visible,
  onClose,
  unreadNotifications = [],
  readNotifications = [],
  onMarkAsRead,
  userType = "hr",
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("unread");

  // Persist read notifications in localStorage for cross-page sync
  useEffect(() => {
    const key = userType === "employee" ? "employeeReadNotifIds" : "hrReadNotifIds";
    if (readNotifications.length > 0) {
      localStorage.setItem(key, JSON.stringify(readNotifications.map(n => n._id)));
    }
  }, [readNotifications, userType]);

  console.log("unreadNotifications:", unreadNotifications);
  console.log("readNotifications:", readNotifications);

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
                    // HR: go to pending tab; Employee: go to personal documents
                    if (userType === "hr") {
                      navigate("/employee-records");
                      setTimeout(() => {
                        localStorage.setItem("employeeRecordsActiveTab", "pending");
                      }, 100);
                    } else {
                      navigate("/personal-documents");
                    }
                    onClose();
                    if (activeTab === "unread" && onMarkAsRead) {
                      onMarkAsRead(note._id);
                      const key = userType === "employee" ? "employeeReadNotifIds" : "hrReadNotifIds";
                      const prev = JSON.parse(localStorage.getItem(key) || "[]");
                      localStorage.setItem(key, JSON.stringify([...prev, note._id]));
                    }
                  }}
                >
                  {note.status === "approved"
                    ? "Document Approved"
                    : note.status === "rejected"
                    ? "Document Rejected"
                    : "New Document Submitted"}
                </b>
                <p>
                  {note.fileName}<br />
                  {note.message}
                </p>
                <span className="notification-date">
                  {note.dateUploaded || note.date
                    ? new Date(note.dateUploaded || note.date).toLocaleDateString()
                    : ""}
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