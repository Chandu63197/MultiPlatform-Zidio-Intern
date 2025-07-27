import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./adminpage.css";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to fetch jobs");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/api/admin/jobs/${deletingJob.id}`
      );
      toast.success("Job deleted successfully!");
      setDeletingJob(null);
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/admin/jobs/${editingJob.id}`,
        editingJob
      );
      toast.success("Job updated successfully!");
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job.");
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
      <ToastContainer position="top-right" autoClose={3000} />

      <h1>
        <FontAwesomeIcon icon={faBriefcase} /> Manage Jobs
      </h1>
      <p>All posted jobs are listed below:</p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.company}</td>
              <td>{job.status}</td>
              <td>
                <button className="editbtn" onClick={() => setEditingJob(job)}>
                  <FontAwesomeIcon icon={faEdit} />{" "}
                  {/* Optionally add text: Edit */}
                </button>
                <button
                  className="deletebtn"
                  onClick={() => setDeletingJob(job)}
                >
                  <FontAwesomeIcon icon={faTrash} />{" "}
                  {/* Optionally add text: Delete */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editingJob && (
        <div className="modal1">
          <div className="modal-content1">
            <button className="close-btn1" onClick={() => setEditingJob(null)}>
              ×
            </button>
            <h2 className="edithead">Edit Job</h2>
            <form onSubmit={handleEditSubmit}>
              <label>Title:</label>
              <input
                type="text"
                value={editingJob.title}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, title: e.target.value })
                }
              />

              <label>Company:</label>
              <input
                type="text"
                value={editingJob.company}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, company: e.target.value })
                }
              />

              <label>Location:</label>
              <input
                type="text"
                value={editingJob.location}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, location: e.target.value })
                }
              />

              <label>Deadline:</label>
              <input
                type="text"
                value={editingJob.deadline}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, deadline: e.target.value })
                }
              />

              <label>Status:</label>
              <select
                value={editingJob.status}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, status: e.target.value })
                }
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>

              <label>Description:</label>
              <textarea
                value={editingJob.description}
                onChange={(e) =>
                  setEditingJob({ ...editingJob, description: e.target.value })
                }
              />

              <div className="modal-buttons1">
                <button type="submit" className="savebtn">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="cancelbtn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingJob && (
        <div className="modal1">
          <div className="modal-content2">
            <button className="close-btn1" onClick={() => setDeletingJob(null)}>
              ×
            </button>
            <h3 className="deletehead">
              Are you sure you want to delete this job?
            </h3>
            <p>
              <strong>{deletingJob.title}</strong> at{" "}
              <strong>{deletingJob.company}</strong>
            </p>
            <div className="modal-buttons">
              <button className="savebtn1" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button
                className="cancelbtn1"
                onClick={() => setDeletingJob(null)}
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

export default ManageJobs;
