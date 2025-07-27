import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faEdit,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import "./adminpage.css";

const dummyCourses = [
  {
    name: "React for Beginners",
    instructor: "John Doe",
    startDate: "2025-06-01",
    status: "Active",
  },
  {
    name: "Advanced JavaScript",
    instructor: "Jane Smith",
    startDate: "2025-07-15",
    status: "Upcoming",
  },
  {
    name: "UI/UX Design Basics",
    instructor: "Alex Kim",
    startDate: "2025-05-20",
    status: "Inactive",
  },
];

const ManageCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState(dummyCourses);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusClass = {
      Active: "badge-active",
      Inactive: "badge-inactive",
      Upcoming: "badge-upcoming",
    };
    return (
      <span className={`status-badge ${statusClass[status]}`}>{status}</span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="page-container"
    >
      <div className="header-bar">
        <h1>
          <FontAwesomeIcon icon={faBook} /> Manage Courses
        </h1>
        <button className="add-course-btn" title="Add New Course">
          <FontAwesomeIcon icon={faPlus} /> Add Course
        </button>
      </div>

      <p>Below is a list of all courses:</p>

      {/* Stats */}
      <div className="course-stats">
        <div className="stat-card">📘 Total: {courses.length}</div>
        <div className="stat-card">
          🟢 Active: {courses.filter((c) => c.status === "Active").length}
        </div>
        <div className="stat-card">
          🕒 Upcoming: {courses.filter((c) => c.status === "Upcoming").length}
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="search-bar"
        placeholder="Search by name, instructor, or status..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Instructor</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <AnimatePresence>
          <tbody>
            {filteredCourses.map((course, idx) => (
              <motion.tr
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <td>{course.name}</td>
                <td>{course.instructor}</td>
                <td>{course.startDate}</td>
                <td>{getStatusBadge(course.status)}</td>
                <td>
                  <button className="action-btn" title="Edit Course">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button className="action-btn" title="Delete Course">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </AnimatePresence>
      </table>
    </motion.div>
  );
};

export default ManageCourses;
