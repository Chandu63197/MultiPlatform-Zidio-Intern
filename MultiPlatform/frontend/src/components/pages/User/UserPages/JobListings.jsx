import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./userpage.css";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [resumeLink, setResumeLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Decode token and fetch student profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      try {
        const payload = JSON.parse(window.atob(base64));
        if (payload?.email) {
          setStudentEmail(payload.email);
          axios
            .get("http://localhost:8080/api/student/me", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              setStudentName(res.data.name);
              setResumeLink(res.data.resumeLink);
            })
            .catch((err) => {
              console.warn("Failed to fetch user profile", err);
            });
        }
      } catch (err) {
        console.warn("Invalid token format", err);
      }
    }
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/student/jobs")
      .then((res) => {
        setJobs(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch jobs.");
        setLoading(false);
      });
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      (locationFilter === "" || job.location === locationFilter) &&
      (typeFilter === "" || job.type === typeFilter)
  );

  const handleApply = (job) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to apply.");
      return;
    }

    axios
      .post(
        "http://localhost:8080/api/student/apply",
        {
          jobId: job.id,
          jobType: "job",
          studentName: studentName || studentEmail.split("@")[0],
          studentEmail: studentEmail,
          resumeLink: resumeLink || "https://default-resume-link.com",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => toast.success("Applied successfully!"))
      .catch((err) => {
        if (err.response && err.response.data) {
          toast.info(err.response.data);
        } else {
          toast.error("Application failed.");
        }
      });
  };

  const handleSave = (job) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to save jobs.");
      return;
    }

    axios
      .post(`http://localhost:8080/api/student/saved-jobs/${job.id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Job saved successfully!");
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          toast.info("Job already saved.");
        } else {
          toast.error("Failed to save job.");
        }
      });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    const token = localStorage.getItem("token");
    if (!file || !token) return;

    const formData = new FormData();
    formData.append("resume", file);

    axios
      .post("http://localhost:8080/api/student/uploadResume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setResumeLink(res.data.resumeLink);
        toast.success("Resume uploaded successfully");
      })
      .catch(() => toast.error("Failed to upload resume"));
  };

  return (
    <div className="job-listings-container">
      <h3>Job Listings</h3>

      <div className="filters">
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="">All Locations</option>
          {[...new Set(jobs.map((j) => j.location || "Unknown"))].map(
            (loc, idx) => (
              <option key={`${loc}-${idx}`} value={loc}>
                {loc}
              </option>
            )
          )}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="">All Types</option>
          {[...new Set(jobs.map((j) => j.type || "Unknown"))].map(
            (type, idx) => (
              <option key={`${type}-${idx}`} value={type}>
                {type}
              </option>
            )
          )}
        </select>
      </div>

      {loading ? (
        <p>Loading jobs...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredJobs.length === 0 ? (
        <p>No jobs match your filters.</p>
      ) : (
        <div className="job-list">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="job-card"
              onClick={() => setSelectedJob(job)}
            >
              <img
                src={job.logo || "/default-logo.png"}
                alt={`${job.company} logo`}
              />
              <div className="job-info">
                <h4>{job.title}</h4>
                <p>
                  <strong>{job.company}</strong> — {job.location}
                </p>
                <p>
                  {job.salary} · {job.type}
                </p>
                <small>{job.postedDate || "Date not available"}</small>
                <p className="job-desc">{job.description}</p>
                <button
                  className="apply-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(job);
                  }}
                >
                  Apply
                </button>
                <button
                  className="save-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave(job);
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedJob && (
        <div className="modal-backdrop" onClick={() => setSelectedJob(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedJob.title}</h2>
            <p>
              <strong>{selectedJob.company}</strong> — {selectedJob.location}
            </p>
            <p>
              {selectedJob.salary} · {selectedJob.type}
            </p>
            <p>
              <strong>Posted:</strong> {selectedJob.postedDate || "N/A"}
            </p>
            <p>{selectedJob.description}</p>
            <button onClick={() => setSelectedJob(null)}>Close</button>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default JobListings;
