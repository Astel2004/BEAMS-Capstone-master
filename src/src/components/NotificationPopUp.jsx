import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotificationPopup.css";

const NotificationPopup = ({ visible, onClose, userType, notifications, setNotifications }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("unread");

  // Separate notifications for employee and HR
  const employeeNotifications = [
    {
      title: "File Validated",
      message: "Your submitted SALN.pdf has been validated by HR.",
      date: "2025-09-16",
      link: "/employee/personal-documents",
      read: false
    },
    {
      title: "Step Increment Status Update",
      message: "Your step increment status has been updated. Please check your increment tracker.",
      date: "2025-09-15",
      link: "/employee/step-increment",
      read: false
    },
    {
      title: "Step Increment Eligibility",
      message: "You are now eligible for a step increment. View details in your tracker.",
      date: "2025-09-14",
      link: "/employee/step-increment",
      read: false
    }
  ];

  const hrNotifications = [
    {
      title: "Step Increment Eligibility",
      message: "Employee John Doe is now eligible for a step increment. Please review in the Step Increment Tracker.",
      date: "2025-09-16",
      link: "/step-increment",
      read: false
    },
    {
      title: "Incomplete Personal Record",
      message: "Employee Jane Smith has incomplete personal records. Please check and request completion.",
      date: "2025-09-15",
      link: "/employee-records?tab=personal",
      read: false
    },
    {
      title: "Duplicate Record Alert",
      message: "Duplicate record detected for Employee Mark Lee in Personal Records. Please review and resolve.",
      date: "2025-09-14",
      link: "/employee-records?tab=personal",
      read: false
    }
  ];

  // Use passed notifications if provided, else use default based on userType
  const allNotifications =
    notifications && notifications.length > 0
      ? notifications
      : userType === "hr"
      ? hrNotifications
      : employeeNotifications;

  const handleView = (idx, note) => {
    if (!note.read && setNotifications) {
      const updated = [...allNotifications];
      updated[idx] = { ...note, read: true };
      setNotifications(updated);
    }
    navigate(note.link);
  };

  const unreadNotifications = allNotifications.filter(n => !n.read);
  const readNotifications = allNotifications.filter(n => n.read);

  if (!visible) return null;
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
            Unread
          </button>
          <button
            className={`notif-tab-btn${activeTab === "read" ? " active" : ""}`}
            onClick={() => setActiveTab("read")}
          >
            Read
          </button>
        </div>
        <div className="notification-popup-body">
          {(activeTab === "unread" ? unreadNotifications : readNotifications).length > 0 ? (
            (activeTab === "unread" ? unreadNotifications : readNotifications).map((note, idx) => {
              // Find the index in the original notifications array
              const origIdx = allNotifications.findIndex(n => n === note);
              return (
                <div key={idx} className="notification-item">
                  <b
                    className="notification-title-link"
                    style={{ color: "#1976d2", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => handleView(origIdx, note)}
                  >
                    {note.title}
                  </b>
                  <p>{note.message}</p>
                  <span className="notification-date">{note.date}</span>
                </div>
              );
            })
          ) : (
            <div className="notification-empty">No {activeTab} notifications.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;