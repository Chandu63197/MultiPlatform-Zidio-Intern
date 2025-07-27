import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // react-calendar default styles
import "./AdminHome.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUser,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

import DashboardContent from "./adminPages/DashboardContent";
import ManageCourses from "./adminPages/ManageCourses";
import ManageJobs from "./adminPages/ManageJobs";
import ManageInternships from "./adminPages/ManageInternships";
import Applications from "./adminPages/Applications";
import Users from "./adminPages/Users";
import Analytics from "./adminPages/Analytics";
import Settings from "./adminPages/Settings";

const AdminHome = () => {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [date, setDate] = useState(new Date());

  const [notifications, setNotifications] = useState([
    { id: 1, message: "New user registered", read: false },
    { id: 2, message: "New job posted", read: false },
    { id: 3, message: "System maintenance at 12 AM", read: true },
  ]);

  const dropdownRef = useRef(null);
  const calendarRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Admin logged out");
    navigate("/login");
  };

  const handleProfile = () => {
    console.log("Go to profile");
    // navigate("/admin/profile");
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderContent = () => {
    switch (selectedPage) {
      case "dashboard":
        return <DashboardContent />;
      case "courses":
        return <ManageCourses />;
      case "jobs":
        return <ManageJobs />;
      case "internships":
        return <ManageInternships />;
      case "applications":
        return <Applications />;
      case "users":
        return <Users />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardContent />;
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "courses", label: "Manage Courses" },
    { id: "jobs", label: "Manage Jobs" },
    { id: "internships", label: "Manage Internships" },
    { id: "applications", label: "Applications" },
    { id: "users", label: "Users" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <div className="admin-home-layout">
      <nav className="navbar2">
        <h2 className="navbar-title">Admin Panel</h2>

        <div className="navbar-right-section">
          {/* Calendar Icon */}
          <div
            className="calendar-icon"
            ref={calendarRef}
            onClick={() => setCalendarOpen((prev) => !prev)}
            title="Open Calendar"
          >
            <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
          </div>

          {calendarOpen && (
            <div className="calendar-popup" ref={calendarRef}>
              <Calendar onChange={setDate} value={date} locale="en-US" />
            </div>
          )}

          {/* Notification Icon */}
          <div
            className="notification-icon"
            title="Notifications"
            onClick={() => setNotificationsOpen((prev) => !prev)}
            ref={notificationsRef}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={faBell} size="lg" />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}

            {notificationsOpen && (
              <div className="notification-dropdown animate-fade-in">
                <div className="notification-header">
                  <span>Notifications</span>
                  <button
                    className="clear-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAllNotifications();
                    }}
                  >
                    Clear all
                  </button>
                </div>

                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <p className="no-notifications">No notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`notification-item ${
                          !notif.read ? "unread" : ""
                        }`}
                        onClick={() => markAsRead(notif.id)}
                        title="Click to mark as read"
                      >
                        <FontAwesomeIcon
                          icon={faBell}
                          className="notif-icon"
                          fixedWidth
                        />
                        <span>{notif.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="user-profile" ref={dropdownRef}>
            <span
              className="profile-icon"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <img
                src="https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
                alt="Profile"
                className="profile-image"
              />
            </span>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={handleProfile}>
                  <FontAwesomeIcon icon={faUser} /> Profile
                </button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="main-content-wrapper">
        <aside className="vertical-nav">
          <nav>
            {navItems.map((item) => (
              <a
                key={item.id}
                onClick={() => setSelectedPage(item.id)}
                className={selectedPage === item.id ? "active-link" : ""}
                style={{ cursor: "pointer" }}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="main-content">{renderContent()}</main>
      </div>
    </div>
  );
};

export default AdminHome;
