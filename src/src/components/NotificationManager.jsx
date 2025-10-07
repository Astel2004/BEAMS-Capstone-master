import React, { useState, useEffect } from "react";

const NotificationManager = ({ children }) => {
  const [pendingRecords, setPendingRecords] = useState([]);
  const [readNotifIds, setReadNotifIds] = useState([]);

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

  const unreadNotifications = pendingRecords.filter(
    (rec) => !readNotifIds.includes(rec._id)
  );
  const readNotifications = pendingRecords.filter(
    (rec) => readNotifIds.includes(rec._id)
  );

  const handleMarkAsRead = (notifId) => {
    setReadNotifIds((prev) => [...prev, notifId]);
  };

  // Pass notification props to children
  return children({
    unreadNotifications,
    readNotifications,
    handleMarkAsRead,
  });
};

export default NotificationManager;