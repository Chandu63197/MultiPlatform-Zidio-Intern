import React, { useEffect, useState, useRef } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./userpage.css";

Modal.setAppElement("#root");

// Parses "3 days ago" to a timestamp
const parsePostedDate = (postedStr) => {
  if (!postedStr) return 0;
  const [num, unit] = postedStr.split(" ");
  const number = parseInt(num);
  if (isNaN(number)) return 0;
  const now = new Date();

  switch (unit) {
    case "day":
    case "days":
      return now.getTime() - number * 24 * 60 * 60 * 1000;
    case "week":
    case "weeks":
      return now.getTime() - number * 7 * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
};

// Gets user info and JWT token from localStorage
const getCurrentUser = () => {
  const token = localStorage.getItem("token"); // JWT token
  const email = localStorage.getItem("email"); // Optional
  return { token, email };
};

const SavedJobs = () => {
  const { token } = getCurrentUser();

  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [touchStartX, setTouchStartX] = useState(0);
  const [swipedJobId, setSwipedJobId] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [lastDeletedJob, setLastDeletedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("title");

  const dragData = useRef({ startX: 0, draggingJobId: null });

  // Fetch saved jobs
  useEffect(() => {
    fetch("http://localhost:8080/api/student/saved-jobs", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch saved jobs");
        return res.json();
      })
      .then((data) => setSavedJobs(data))
      .catch(() => setSavedJobs([]));
  }, [token]);

  // Fetch applied jobs
  useEffect(() => {
    fetch("http://localhost:8080/api/student/applications", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch applied jobs");
        return res.json();
      })
      .then((data) => {
        const jobs = data.map((app) => app.job).filter(Boolean);
        setAppliedJobs(jobs);
      })
      .catch(() => setAppliedJobs([]));
  }, [token]);

  const confirmDelete = (job) => setJobToDelete(job);
  const cancelDelete = () => setJobToDelete(null);

  const proceedDelete = () => {
    if (!jobToDelete) return;
    fetch(`http://localhost:8080/api/student/saved-jobs/${jobToDelete.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to remove saved job");
        setSavedJobs((prev) => prev.filter((job) => job.id !== jobToDelete.id));
        setLastDeletedJob(jobToDelete);
        setJobToDelete(null);

        toast.success(
          <div className="toast-content">
            Job removed.{" "}
            <button
              className="toast-undo-btn"
              onClick={() => handleUndo(jobToDelete)}
            >
              Undo
            </button>
          </div>,
          { position: "bottom-left", autoClose: 5000 }
        );
      })
      .catch(() => toast.error("Failed to remove saved job."));
  };

  const handleUndo = (job) => {
    if (!job) return;
    fetch(`http://localhost:8080/api/student/saved-jobs/${job.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to restore job");
        setSavedJobs((prev) => [...prev, job]);
        setLastDeletedJob(null);
        toast.dismiss();
      })
      .catch(() => toast.error("Failed to restore saved job."));
  };

  const handleTouchStart = (e) => setTouchStartX(e.changedTouches[0].screenX);
  const handleTouchEnd = (e, job) => {
    const touchEndX = e.changedTouches[0].screenX;
    const distance = touchStartX - touchEndX;
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
  };

  const handleMouseMove = (e) => {
    const { draggingJobId, startX } = dragData.current;
    if (!draggingJobId) return;

    const distance = startX - e.clientX;
    const jobCard = document.getElementById(`saved-job-card-${draggingJobId}`);
    if (!jobCard) return;

    if (distance > 0 && distance < 100) {
      jobCard.style.transform = `translateX(${-distance}px)`;
      jobCard.classList.add("swiping");
    } else if (distance >= 100) {
      confirmDelete(savedJobs.find((j) => j.id === draggingJobId));
      dragData.current.draggingJobId = null;
    } else {
      jobCard.style.transform = "translateX(0)";
      jobCard.classList.remove("swiping");
    }
  };

  const handleMouseUp = () => {
    const { draggingJobId } = dragData.current;
    if (!draggingJobId) return;

    const jobCard = document.getElementById(`saved-job-card-${draggingJobId}`);
    if (jobCard) {
      jobCard.style.transform = "translateX(0)";
      jobCard.classList.remove("swiping");
    }
    dragData.current.draggingJobId = null;
  };

  const handleApply = (job) => {
    const alreadyApplied = appliedJobs.some((j) => j.id === job.id);
    if (alreadyApplied) {
      toast.info("You've already applied for this job.");
      return;
    }

    fetch("http://localhost:8080/api/student/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ jobId: job.id }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to apply");
        }
        setAppliedJobs((prev) => [...prev, job]);
        toast.success("Applied successfully!");
      })
      .catch((err) => toast.error(err.message));
  };

  const filteredJobs = savedJobs
    .filter((job) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      if (sortBy === "company") {
        return sortOrder === "asc"
          ? a.company.localeCompare(b.company)
          : b.company.localeCompare(a.company);
      }
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
      <h3>Saved Jobs</h3>

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

      {filteredJobs.length === 0 ? (
        <p>You haven't saved any jobs yet.</p>
      ) : (
        <div className="job-list">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobs.some((j) => j.id === job.id);
            return (
              <div
                id={`saved-job-card-${job.id}`}
                key={job.id}
                className={`job-card swipeable ${
                  swipedJobId === job.id ? "swiping" : ""
                }`}
                onTouchStart={handleTouchStart}
                onTouchEnd={(e) => handleTouchEnd(e, job)}
                onMouseDown={(e) => handleMouseDown(e, job)}
                style={{ touchAction: "pan-y" }}
              >
                <div
                  className={`swipe-delete-bg ${
                    swipedJobId === job.id ? "slide-in" : ""
                  }`}
                >
                  <FaTrashAlt />
                </div>

                <img src={job.logo} alt={`${job.company} logo`} />
                <div className="job-info">
                  <div className="job-header">
                    <h4>{job.title}</h4>
                    <FaTrashAlt
                      className="delete-icon"
                      onClick={() => confirmDelete(job)}
                      title="Remove Saved Job"
                    />
                  </div>
                  <p>
                    <strong>{job.company}</strong> — {job.location}
                  </p>
                  <p>
                    {job.salary} · {job.type}
                  </p>
                  <small>{job.posted}</small>
                  <button
                    className={`apply-btn ${isApplied ? "disabled" : ""}`}
                    disabled={isApplied}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(job);
                    }}
                  >
                    {isApplied ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!jobToDelete}
        onRequestClose={cancelDelete}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Remove</h2>
        <p>
          Are you sure you want to remove <strong>{jobToDelete?.title}</strong>{" "}
          from saved jobs?
        </p>
        <div className="modal-actions">
          <button className="btn cancel-btn" onClick={cancelDelete}>
            Cancel
          </button>
          <button className="btn delete-btn" onClick={proceedDelete}>
            Remove
          </button>
          {lastDeletedJob && (
            <button
              className="btn undo-btn animated-undo-btn"
              onClick={() => handleUndo(lastDeletedJob)}
            >
              Undo
            </button>
          )}
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default SavedJobs;
