import React, { useState, useEffect } from "react";

// Helper to get user type and ID (customize as needed)
function getUserTypeAndId() {
  // Example: get from localStorage, context, or props
  const userType = localStorage.getItem("userType"); // "hr" or "employee"
  const employeeId = localStorage.getItem("employeeId");
  return { userType, employeeId };
}

const NotificationManager = ({ children }) => {
  const { userType, employeeId } = getUserTypeAndId();

  const [pendingRecords, setPendingRecords] = useState([]);
  const [employeeNotifications, setEmployeeNotifications] = useState([]);
  const [readNotifIds, setReadNotifIds] = useState(() => {
    // Use different localStorage keys for HR and employee
    const key = userType === "employee" ? "employeeReadNotifIds" : "hrReadNotifIds";
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (userType === "hr") {
      // HR: fetch pending records
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
    } else if (userType === "employee" && employeeId) {
      // Employee: fetch notifications
      const fetchEmployeeNotifications = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/notifications/${employeeId}`);
          const data = await response.json();
          setEmployeeNotifications(data);
          console.log("Fetched employee notifications:", data); // <-- ADD HERE
        } catch (error) {
          setEmployeeNotifications([]);
          console.error("Error fetching employee notifications:", error);
        }
      };
      fetchEmployeeNotifications();
      const interval = setInterval(fetchEmployeeNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [userType, employeeId]);

  // Calculate notifications
  let unreadNotifications = [];
  let readNotifications = [];
  if (userType === "hr") {
    unreadNotifications = pendingRecords.filter(
      (rec) => !readNotifIds.includes(rec._id)
    );
    readNotifications = pendingRecords.filter(
      (rec) => readNotifIds.includes(rec._id)
    );
  } else if (userType === "employee") {
    unreadNotifications = employeeNotifications.filter(
      (n) => !readNotifIds.includes(n._id)
    );
    readNotifications = employeeNotifications.filter(
      (n) => readNotifIds.includes(n._id)
    );
  }

  // Mark as read and persist to localStorage
  const handleMarkAsRead = (notifId) => {
    setReadNotifIds((prev) => {
      if (prev.includes(notifId)) return prev;
      const updated = [...prev, notifId];
      const key = userType === "employee" ? "employeeReadNotifIds" : "hrReadNotifIds";
      localStorage.setItem(key, JSON.stringify(updated));
      return updated;
    });
  };

  // Pass notification props to children
  return children({
    unreadNotifications,
    readNotifications,
    handleMarkAsRead,
    userType,
  });
};

export default NotificationManager;