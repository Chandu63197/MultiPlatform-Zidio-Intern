import React, { useState, useEffect, useRef } from "react";
import "./recruterhome.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faFileAlt,
  faGraduationCap,
  faEnvelope,
  faCogs,
  faUser,
  faCalendarAlt,
  faPlus,
  faBars,
  faTimes,
  faMoon,
  faSun,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

import { motion, AnimatePresence } from "framer-motion";

import Dashboard from "./recruPages/RecuDashboard";
import PostJob from "./recruPages/PostJob";
import PostInternship from "./recruPages/PostInternship";
import ViewApplications from "./recruPages/ViewApplication";
import ScheduleInterviews from "./recruPages/ScheduleInterviews";
import Messages from "./recruPages/Messages";
import Profile from "./recruPages/Profile";
import Settings from "./recruPages/Settings";
import { useNavigate } from "react-router-dom";

const RecruiterHome = () => {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const renderContent = () => {
    switch (selectedPage) {
      case "dashboard":
        return <Dashboard />;
      case "post-job":
        return <PostJob />;
      case "post-internship":
        return <PostInternship />;
      case "view-applications":
        return <ViewApplications />;
      case "schedule-interviews":
        return <ScheduleInterviews />;
      case "messages":
        return <Messages />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: faChartBar },
    { id: "post-job", label: "Post a Job", icon: faPlus },
    { id: "post-internship", label: "Post Internship", icon: faGraduationCap },
    { id: "view-applications", label: "Applications", icon: faFileAlt },
    { id: "schedule-interviews", label: "Interviews", icon: faCalendarAlt },
    { id: "messages", label: "Messages", icon: faEnvelope },
    // { id: "profile", label: "Profile", icon: faUser },
    { id: "settings", label: "Settings", icon: faCogs },
  ];

  const navigate = useNavigate();

  return (
    <div className={`recr-home-container ${darkMode ? "dark-mode" : ""}`}>
      <nav className="recr-home-navbar">
        <div className="recr-home-logo">Recruiter Dashboard</div>

        <div className="navbar-controls">
          <button
            className="dark-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>

          <div className="profile-dropdown" ref={profileRef}>
            <FontAwesomeIcon
              icon={faUserCircle}
              className="profile-icon"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            />
            {profileMenuOpen && (
              <div className="dropdown-content">
                <p
                  onClick={() => {
                    setSelectedPage("profile");
                    setProfileMenuOpen(false);
                  }}
                >
                  My Profile
                </p>
                <p
                  onClick={() => {
                    setSelectedPage("settings");
                    setProfileMenuOpen(false);
                  }}
                >
                  Settings
                </p>
                <p
                  onClick={() => {
                    navigate("/login");
                    setProfileMenuOpen(false);
                  }}
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="recr-home-layout">
        <aside className="recr-home-sidebar">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  onClick={() => {
                    setSelectedPage(item.id);
                    setProfileMenuOpen(false);
                  }}
                  className={selectedPage === item.id ? "active-link" : ""}
                >
                  <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <main className="recr-home-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default RecruiterHome;
