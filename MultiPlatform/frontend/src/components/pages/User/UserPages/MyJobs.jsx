import React, { useEffect, useState, useRef } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./userpage.css";

Modal.setAppElement("#root");

const MyJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [touchStartX, setTouchStartX] = useState(0);
  const [swipedJobId, setSwipedJobId] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [lastDeletedJob, setLastDeletedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("title");

  const dragData = useRef({ startX: 0, draggingJobId: null });

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in. Please login again.");
      throw new Error("Missing token");
    }
    return token;
  };

  const fetchApplications = async () => {
    let token;
    try {
      token = getToken();
    } catch (err) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/student/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 403) {
        toast.error("Access denied. Please login again.");
        return;
      }

      if (!res.ok) throw new Error(`Fetch error (${res.status})`);

      const data = await res.json();

      const formatted = data
        .filter((app) => app.application && app.application.id)
        .map(({ application, job }) => ({
          id: application.id,
          status: application.status,
          title: application.jobTitle || job?.title || "Untitled Job",
          company: job?.company || "Unknown Company",
          location: job?.location || "Remote",
          salary: job?.salary || "Not disclosed",
          type: job?.type || "Job",
          posted: job?.postedDate || "Recently",
          logo: job?.logo || "/default-logo.png",
        }));

      setAppliedJobs(formatted);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications.");
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const confirmDelete = (job) => setJobToDelete(job);
  const cancelDelete = () => setJobToDelete(null);

  const proceedDelete = async () => {
    if (!jobToDelete) return;

    let token;
    try {
      token = getToken();
    } catch (err) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8080/api/student/applications/${jobToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 403) {
        toast.error("Permission denied.");
        return;
      }

      if (!res.ok) throw new Error("Failed to delete");

      setAppliedJobs((prev) => prev.filter((job) => job.id !== jobToDelete.id));
      setLastDeletedJob(jobToDelete);
      setJobToDelete(null);

      toast.success(
        <div className="toast-content">
          Application deleted.
          <button className="toast-undo-btn" onClick={handleUndo}>
            Undo
          </button>
        </div>,
        { position: "bottom-left", autoClose: 5000 }
      );
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete application.");
    }
  };

  const handleUndo = () => {
    if (!lastDeletedJob) return;
    fetchApplications();
    setLastDeletedJob(null);
    toast.dismiss();
  };

  const handleTouchStart = (e) => setTouchStartX(e.changedTouches[0].screenX);

  const handleTouchEnd = (e, job) => {
    const distance = touchStartX - e.changedTouches[0].screenX;
    if (distance > 60) {
      setSwipedJobId(job.id);
      setTimeout(() => {
        confirmDelete(job);
        setSwipedJobId(null);
      }, 300);
    } else {
      setSwipedJobId(null);
    }
  };

  const handleMouseDown = (e, job) => {
    dragData.current = { startX: e.clientX, draggingJobId: job.id };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    const { startX, draggingJobId } = dragData.current;
    if (!draggingJobId) return;

    const distance = startX - e.clientX;
    const jobCard = document.getElementById(`job-card-${draggingJobId}`);
    if (jobCard) {
      if (distance > 0 && distance < 100) {
        jobCard.style.transform = `translateX(${-distance}px)`;
        jobCard.classList.add("swiping");
      } else if (distance >= 100) {
        confirmDelete(appliedJobs.find((j) => j.id === draggingJobId));
        dragData.current.draggingJobId = null;
      } else {
        jobCard.style.transform = "translateX(0)";
        jobCard.classList.remove("swiping");
      }
    }
  };

  const handleMouseUp = () => {
    const { draggingJobId } = dragData.current;
    if (!draggingJobId) return;
    const jobCard = document.getElementById(`job-card-${draggingJobId}`);
    if (jobCard) {
      jobCard.style.transform = "translateX(0)";
      jobCard.classList.remove("swiping");
    }
    dragData.current.draggingJobId = null;
  };

  const parsePostedDate = (str) => {
    if (!str) return 0;
    const [num, unit] = str.split(" ");
    const number = parseInt(num, 10);
    if (isNaN(number)) return 0;
    const now = Date.now();
    if (unit.includes("day")) return now - number * 86400000;
    if (unit.includes("week")) return now - number * 7 * 86400000;
    return 0;
  };

  const filteredJobs = appliedJobs
    .filter((job) =>
      job.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title")
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      if (sortBy === "company")
        return sortOrder === "asc"
          ? a.company.localeCompare(b.company)
          : b.company.localeCompare(a.company);
      if (sortBy === "posted") {
        const aTime = parsePostedDate(a.posted);
        const bTime = parsePostedDate(b.posted);
        return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
      }
      return 0;
    });

  return (
    <div
      className="job-listings-container"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <h3>My Applications</h3>

      <div className="search-sort-controls">
        <input
          type="text"
          placeholder="Search jobs by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="title">Sort by Title</option>
          <option value="company">Sort by Company</option>
          <option value="posted">Sort by Date Posted</option>
        </select>
        <select
          className="sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {filteredJobs.length === 0 && <p>No applications match your search.</p>}

      {filteredJobs.map((job) => (
        <div
          key={job.id}
          id={`job-card-${job.id}`}
          className={`job-card ${swipedJobId === job.id ? "swiped" : ""} ${
            job.status === "Shortlisted"
              ? "shortlisted"
              : job.status === "Rejected"
              ? "rejected"
              : ""
          }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={(e) => handleTouchEnd(e, job)}
          onMouseDown={(e) => handleMouseDown(e, job)}
          style={{ userSelect: "none" }}
        >
          <img
            src={job.logo}
            alt={`${job.company} logo`}
            className="job-logo"
          />
          <div className="job-info">
            <h4>{job.title}</h4>
            <p>
              {job.company} • {job.location} • {job.salary} • {job.type}
            </p>
            <p className="posted-date">Posted: {job.posted}</p>
            {job.status && (
              <span
                className={`status-tag ${
                  job.status === "Shortlisted"
                    ? "green"
                    : job.status === "Rejected"
                    ? "red"
                    : ""
                }`}
              >
                {job.status}
              </span>
            )}
          </div>
          <button
            className="delete-btn"
            onClick={() => confirmDelete(job)}
            aria-label={`Delete application for ${job.title}`}
          >
            <FaTrashAlt />
          </button>
        </div>
      ))}

      <Modal
        isOpen={!!jobToDelete}
        onRequestClose={cancelDelete}
        contentLabel="Confirm Delete Application"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete the application for "
          {jobToDelete?.title}"?
        </p>
        <div className="modal-buttons">
          <button onClick={cancelDelete} className="cancel-btn">
            Cancel
          </button>
          <button onClick={proceedDelete} className="confirm-btn">
            Delete
          </button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default MyJobs;
