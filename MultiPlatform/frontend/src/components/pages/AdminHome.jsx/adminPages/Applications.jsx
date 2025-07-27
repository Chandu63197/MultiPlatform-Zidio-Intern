import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "./adminpage.css";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/admin/applications/with-jobs",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data)) {
        setApplications(response.data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      alert("Error fetching applications.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setSelectedAppId(id);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/admin/applications/${selectedAppId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplications((prev) =>
        prev.filter((item) => {
          const app = item.application || item;
          return app.id !== selectedAppId;
        })
      );

      setShowModal(false);
      setSelectedAppId(null);
    } catch (error) {
      console.error("Failed to delete application:", error);
      alert("Error deleting application.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="page-container"
    >
      <h1>
        <FontAwesomeIcon icon={faFileAlt} /> Applications
      </h1>
      <p>Review received applications below:</p>

      {loading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Applicant Email</th>
              <th>Job Title</th>
              <th>Company</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((item, index) => {
              const application = item.application || item;
              const jobOrInternship = item.job || item.internship || {};

              return (
                <tr key={application.id || index}>
                  <td>{application.studentEmail}</td>
                  <td>{jobOrInternship.title || "N/A"}</td>
                  <td>{jobOrInternship.company || "N/A"}</td>
                  <td>
                    {application.jobType || application.type || "Unknown"}
                  </td>
                  <td>{application.status || "Pending"}</td>
                  <td>
                    <button
                      onClick={() => confirmDelete(application.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this application?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Applications;
