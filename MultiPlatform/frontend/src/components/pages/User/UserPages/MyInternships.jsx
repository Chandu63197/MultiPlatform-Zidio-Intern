import React, { useEffect, useState } from "react";
import "./userpage.css";
import { FaTrashAlt, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const MyInternships = () => {
  const [appliedInternships, setAppliedInternships] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detailModalData, setDetailModalData] = useState(null);

  useEffect(() => {
    fetchAppliedInternships();
  }, []);

  const fetchAppliedInternships = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:8080/api/student/internship-applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppliedInternships(response.data);
    } catch (error) {
      console.error("Error fetching internships:", error);
      toast.error("Failed to load internships.");
    }
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:8080/api/student/internship-applications/${selectedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppliedInternships((prev) =>
        prev.filter((item) => item.application.id !== selectedId)
      );
      setShowModal(false);
      toast.success("Internship removed!");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete internship application.");
    }
  };

  const openDetailModal = (internship) => {
    setDetailModalData(internship);
  };

  const closeDetailModal = () => {
    setDetailModalData(null);
  };

  return (
    <div className="intern-comp-wrapper">
      <h3 className="intern-title">My Internships</h3>

      {appliedInternships.length === 0 ? (
        <p className="intern-empty">
          You haven't applied to any internships yet.
        </p>
      ) : (
        <ul className="intern-list">
          {appliedInternships.map(({ application, internship }) => {
            const status = application.status || "";
            const statusClass =
              status === "Shortlisted"
                ? "shortlisted"
                : status === "Rejected"
                ? "rejected"
                : "";

            return (
              <li className={`intern-card ${statusClass}`} key={application.id}>
                <img
                  className="intern-logo"
                  src={
                    internship?.logo ||
                    "https://ui-avatars.com/api/?name=INT&size=40"
                  }
                  alt="Company logo"
                  onClick={() => openDetailModal(internship)}
                />
                <div
                  className="intern-info"
                  onClick={() => openDetailModal(internship)}
                >
                  <strong>{internship?.title}</strong> at {internship?.company}{" "}
                  — {internship?.location}
                  <br />
                  Duration: {internship?.duration} | Stipend:{" "}
                  {internship?.stipend}
                  {status && (
                    <div
                      className={`status-tag ${
                        status === "Shortlisted"
                          ? "green"
                          : status === "Rejected"
                          ? "red"
                          : ""
                      }`}
                    >
                      {status}
                    </div>
                  )}
                </div>
                <FaTrashAlt
                  className="intern-delete-btn"
                  title="Remove internship"
                  onClick={() => confirmDelete(application.id)}
                />
              </li>
            );
          })}
        </ul>
      )}

      {/* Delete confirmation modal */}
      {showModal && (
        <div className="intern-modal-overlay">
          <div className="intern-modal-box">
            <h4>Are you sure you want to delete this internship?</h4>
            <div className="intern-modal-actions">
              <button
                className="intern-btn confirm"
                onClick={handleDeleteConfirmed}
              >
                Yes, Delete
              </button>
              <button
                className="intern-btn cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internship detail modal */}
      {detailModalData && (
        <div className="intern-modal-overlay">
          <div className="intern-modal-box">
            <button className="intern-close-btn" onClick={closeDetailModal}>
              <FaTimes />
            </button>
            <h3>{detailModalData.title}</h3>
            <p>
              <strong>Company:</strong> {detailModalData.company}
            </p>
            <p>
              <strong>Location:</strong> {detailModalData.location}
            </p>
            <p>
              <strong>Duration:</strong> {detailModalData.duration}
            </p>
            <p>
              <strong>Stipend:</strong> {detailModalData.stipend}
            </p>
            <p>
              <strong>Category:</strong> {detailModalData.category}
            </p>
            <p>
              <strong>Description:</strong> {detailModalData.description}
            </p>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
};

export default MyInternships;
