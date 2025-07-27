// Notifications.jsx
import React, { useEffect, useState } from "react";
import "./userpage.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/student/notifications") // 🔁 Replace with your actual endpoint
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((note) => ({
          icon: getIconForType(note.type),
          message: note.message,
          time: formatTime(note.createdAt),
        }));
        setNotifications(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch notifications:", err);
        setLoading(false);
      });
  }, []);

  const getIconForType = (type) => {
    switch (type) {
      case "Job":
        return "💼";
      case "Internship":
        return "📘";
      case "Interview":
        return "🎤";
      default:
        return "🔔";
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <section id="notifications" className="notifications-container">
      <h3>Notifications & Alerts</h3>
      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map((note, idx) => (
            <li key={idx}>
              <span className="note-icon">{note.icon}</span> {note.message}{" "}
              <span className="note-time">{note.time}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Notifications;
