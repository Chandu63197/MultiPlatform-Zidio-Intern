import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaBook,
  FaBriefcase,
  FaGraduationCap,
  FaSearch,
  FaTachometerAlt,
  FaHeart,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";
import "./UserHome.css";
import axios from "axios";

import Dashboard from "./UserPages/Dashboard";
import Notifications from "./UserPages/Notifications";
import Enrollments from "./UserPages/Enrollments";
import BrowseCourses from "./UserPages/BrowseCourses";
import SavedCourses from "./UserPages/SavedCourses";
import CompltedCourses from "./UserPages/CompltedCourses";

import JobListings from "./UserPages/JobListings";
import MyJobs from "./UserPages/MyJobs";
import SavedJobs from "./UserPages/SavedJobs";
import JobCategories from "./UserPages/JobCategories";
import InternshipListings from "./UserPages/InternshipListings";
import MyInternships from "./UserPages/MyInternships";
import SavedInternships from "./UserPages/SavedInternships";
import InternshipCategories from "./UserPages/InternshipCategories";

const UserHomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || "User";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("dashboard");
  const dropdownRef = useRef(null);

  const handleToggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleProfile = () => navigate("/profile");

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/users/logout",
        {},
        { withCredentials: true }
      );
      // Remove token from localStorage on successful logout
      localStorage.removeItem("token");
      alert("Logged out successfully");
      navigate("/login"); // Redirect to login page or wherever you want
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderSection = () => {
    switch (selectedSection) {
      case "dashboard":
        return <Dashboard />;
      case "notifications":
        return <Notifications />;
      case "browse-courses":
        return <BrowseCourses />;
      case "enrollments":
        return <Enrollments />;
      case "Completed Courses":
        return <CompltedCourses />;
      case "saved-courses":
        return <SavedCourses />;
      case "job-listings":
        return <JobListings />;
      case "my-jobs":
        return <MyJobs />;
      case "saved-jobs":
        return <SavedJobs />;
      case "job-Completed Courses":
        return <JobCategories />;
      case "internship-listings":
        return <InternshipListings />;
      case "my-internships":
        return <MyInternships />;
      case "saved-internships":
        return <SavedInternships />;
      case "internship-Completed Courses":
        return <InternshipCategories />;
      default:
        return <p>Welcome back, {username}!</p>;
    }
  };

  return (
    <div className="uh-layout">
      <nav className="uh-navbar">
        <h1 className="uh-title">MultiPlatform App</h1>
        <div
          className="uh-profile"
          ref={dropdownRef}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <span className="uh-username">{username}</span>
          <FaUserCircle
            size={28}
            onClick={handleToggleDropdown}
            style={{ cursor: "pointer" }}
          />
          {dropdownOpen && (
            <div className="uh-dropdown">
              <button onClick={handleProfile}>Profile</button>
              <button onClick={handleLogout}>
                Logout <FaSignOutAlt style={{ marginLeft: "8px" }} />
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="uh-wrapper">
        <aside className="uh-sidebar">
          <div className="uh-searchbar">
            <FaSearch className="uh-searchicon" />
            <input type="text" placeholder="Search..." />
          </div>

          <div className="uh-section">
            <p className="uh-section-title">Dashboard</p>
            <button onClick={() => setSelectedSection("dashboard")}>
              <FaTachometerAlt /> My Dashboard
            </button>
            <button onClick={() => setSelectedSection("notifications")}>
              <FaBell /> Notifications
            </button>
          </div>

          <div className="uh-section">
            <p className="uh-section-title">Courses</p>
            <button onClick={() => setSelectedSection("browse-courses")}>
              <FaBook /> Browse Courses
            </button>
            <button onClick={() => setSelectedSection("enrollments")}>
              <FaBook /> My Enrollments
            </button>
            <button onClick={() => setSelectedSection("Completed Courses")}>
              <FaBook /> Complted Courses
            </button>
            <button onClick={() => setSelectedSection("saved-courses")}>
              <FaHeart /> Saved Courses
            </button>
          </div>

          <div className="uh-section">
            <p className="uh-section-title">Jobs</p>
            <button onClick={() => setSelectedSection("job-listings")}>
              <FaBriefcase /> Job Listings
            </button>
            <button onClick={() => setSelectedSection("my-jobs")}>
              <FaBriefcase /> My Applications
            </button>
            <button onClick={() => setSelectedSection("saved-jobs")}>
              <FaHeart /> Saved Jobs
            </button>
            {/* <button onClick={() => setSelectedSection("job-Completed Courses")}>
              <FaBriefcase /> Job Categories
            </button> */}
          </div>

          <div className="uh-section">
            <p className="uh-section-title">Internships</p>
            <button onClick={() => setSelectedSection("internship-listings")}>
              <FaGraduationCap /> Internship Listings
            </button>
            <button onClick={() => setSelectedSection("my-internships")}>
              <FaGraduationCap /> My Applications
            </button>
            <button onClick={() => setSelectedSection("saved-internships")}>
              <FaHeart /> Saved Internships
            </button>
            <button
              onClick={() => setSelectedSection("internship-Completed Courses")}
            ></button>
          </div>
        </aside>

        <main className="uh-main">{renderSection()}</main>
      </div>
    </div>
  );
};

export default UserHomePage;
