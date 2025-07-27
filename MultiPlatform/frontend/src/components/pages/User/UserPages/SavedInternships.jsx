import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  FaCode,
  FaBullhorn,
  FaPaintBrush,
  FaBriefcase,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./userpage.css";

const SavedInternships = () => {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [modalData, setModalData] = useState(null);

  const token = localStorage.getItem("token");

  const categoryIcons = {
    Development: <FaCode />,
    Marketing: <FaBullhorn />,
    Design: <FaPaintBrush />,
    Business: <FaBriefcase />,
  };

  const fetchSavedInternships = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/student/favorites",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInternships(response.data || []);
    } catch (error) {
      console.error("Error fetching saved internships:", error);
      toast.error("Failed to load saved internships.");
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/student/internship-applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      toast.error("Failed to load applications.");
    }
  };

  const deleteSavedInternship = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/student/favorites/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.info("Internship removed from saved list.");
      setInternships((prev) => prev.filter((intern) => intern.id !== id));
    } catch (error) {
      console.error("Error removing internship:", error);
      toast.error("Failed to remove internship.");
    }
  };

  const isApplied = (jobId) =>
    applications.some((app) => app.internship.id === jobId);

  const getStatus = (jobId) =>
    applications.find((app) => app.internship.id === jobId)?.application
      ?.status;

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="status-badge pending">Pending</span>;
      case "accepted":
        return <span className="status-badge accepted">Accepted</span>;
      case "rejected":
        return <span className="status-badge rejected">Rejected</span>;
      default:
        return null;
    }
  };

  const handleApply = (id) => {
    if (isApplied(id)) {
      toast.info("You have already applied for this internship.");
    } else {
      toast.info("Please visit the internship details to apply.");
    }
  };

  const openModal = (intern) => setModalData(intern);
  const closeModal = () => setModalData(null);
  const city = modalData?.location?.split(",")[0] || modalData?.location || "";

  useEffect(() => {
    fetchSavedInternships();
    fetchApplications();
  }, []);

  if (internships.length === 0) {
    return (
      <div className="saved-internships-container">
        <h3>Saved Internships</h3>
        <p>You haven't saved any internships yet.</p>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }

  return (
    <div className="saved-internships-container">
      <h3>Saved Internships</h3>

      {internships.map((intern) => (
        <div key={intern.id} className="intern-card">
          <img src={intern.logo} alt={`${intern.company} logo`} />
          <div
            className="intern-info"
            onClick={() => openModal(intern)}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => e.key === "Enter" && openModal(intern)}
          >
            <h4>{intern.title}</h4>
            <p>
              <strong>{intern.company}</strong> — {intern.location}
            </p>
            <p>
              Duration: {intern.duration} | Stipend: {intern.stipend}
            </p>
            <small>
              {intern.posted} | {categoryIcons[intern.category]}{" "}
              {intern.category}
            </small>
          </div>

          <div className="intern-actions">
            <button
              className="intern-apply-btn"
              onClick={() => handleApply(intern.id)}
              disabled={isApplied(intern.id)}
              type="button"
            >
              {isApplied(intern.id) ? "Already Applied" : "Apply"}
            </button>

            {isApplied(intern.id) && getStatusBadge(getStatus(intern.id))}

            <button
              aria-label={`Delete ${intern.title}`}
              onClick={() => deleteSavedInternship(intern.id)}
              type="button"
              className="intern-delete-btn"
            >
              <FaTrash color="red" />
            </button>
          </div>
        </div>
      ))}

      {modalData && (
        <div className="intern-modal">
          <div className="intern-modal-content">
            <button className="intern-close-modal" onClick={closeModal}>
              <FaTimes />
            </button>
            <h2>{modalData.title}</h2>
            <p>
              <strong>{modalData.company}</strong>
            </p>
            <p>
              <strong>City:</strong> {city}
            </p>
            <p>
              <strong>Location:</strong> {modalData.location}
            </p>
            <p>
              <strong>Duration:</strong> {modalData.duration}
            </p>
            <p>
              <strong>Stipend:</strong> {modalData.stipend}
            </p>
            <p>
              <strong>Category:</strong> {modalData.category}
            </p>
            <p>
              <strong>Description:</strong> {modalData.description}
            </p>
            <button
              onClick={() => handleApply(modalData.id)}
              disabled={isApplied(modalData.id)}
              type="button"
            >
              {isApplied(modalData.id) ? "Already Applied" : "Apply Now"}
            </button>
            {isApplied(modalData.id) && getStatusBadge(getStatus(modalData.id))}
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default SavedInternships;
