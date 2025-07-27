import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "./recruterpage.css";

const Dashboard = () => {
  const [filters, setFilters] = useState({
    dateRange: "Last 30 Days",
    jobType: "All",
  });

  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem("token");
  // Fetch data on mount
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        const [jobsRes, internshipsRes, interviewsRes, applicationsRes] =
          await Promise.all([
            fetch("http://localhost:8080/api/recruiter/jobs", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://localhost:8080/api/recruiter/internships", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://localhost:8080/api/recruiter/interviews", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://localhost:8080/api/recruiter/applications", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        if (
          !applicationsRes.ok ||
          !jobsRes.ok ||
          !internshipsRes.ok ||
          !interviewsRes.ok
        ) {
          throw new Error("Failed to fetch dashboard data");
        }

        setJobs(await jobsRes.json());
        setInternships(await internshipsRes.json());
        setInterviews(await interviewsRes.json());
        setApplications(await applicationsRes.json());
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Delete handler
  const handleDelete = async (id, type) => {
    let endpoint = "";
    if (type === "Jobs Posted") endpoint = `jobs/${id}`;
    else if (type === "Internships Posted") endpoint = `internships/${id}`;
    else if (type === "Interviews Scheduled") endpoint = `interviews/${id}`;

    try {
      const res = await fetch(
        `http://localhost:8080/api/recruiter/${endpoint}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Delete failed");

      if (type === "Jobs Posted")
        setJobs((prev) => prev.filter((j) => j.id !== id));
      else if (type === "Internships Posted")
        setInternships((prev) => prev.filter((i) => i.id !== id));
      else if (type === "Interviews Scheduled")
        setInterviews((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      alert(error.message || "Delete failed");
    }
  };

  // Open details modal
  const handleCardClick = (statTitle) => {
    setSelectedStat(statTitle);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStat(null);
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditItem(item);
    setEditForm(item);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditItem(null);
    setEditForm({});
  };

  // Handle form input changes for edit modal
  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Submit updated data
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    let endpoint = "";
    if (selectedStat === "Jobs Posted") endpoint = `jobs/${editItem.id}`;
    else if (selectedStat === "Internships Posted")
      endpoint = `internships/${editItem.id}`;
    else if (selectedStat === "Interviews Scheduled")
      endpoint = `interviews/${editItem.id}`;

    try {
      const res = await fetch(
        `http://localhost:8080/api/recruiter/${endpoint}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editForm),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      const updatedItem = await res.json();

      if (selectedStat === "Jobs Posted") {
        setJobs((prev) =>
          prev.map((j) => (j.id === updatedItem.id ? updatedItem : j))
        );
      } else if (selectedStat === "Internships Posted") {
        setInternships((prev) =>
          prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
        );
      } else if (selectedStat === "Interviews Scheduled") {
        setInterviews((prev) =>
          prev.map((i) => (i.id === updatedItem.id ? updatedItem : i))
        );
      }

      closeEditModal();
    } catch (error) {
      alert(error.message || "Update failed");
    }
  };

  // Get list data for modal table
  const getListData = () => {
    if (selectedStat === "Jobs Posted") return jobs;
    if (selectedStat === "Internships Posted") return internships;
    if (selectedStat === "Interviews Scheduled") return interviews;
    if (selectedStat === "Applications Received") return applications;
    return [];
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>Error loading dashboard: {error}</p>;

  // Resume

  const viewResume = (resumeBytes) => {
    if (!resumeBytes) {
      alert("No resume available for this applicant.");
      return;
    }

    const byteCharacters = atob(resumeBytes);
    const byteNumbers = new Array(byteCharacters.length)
      .fill()
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to Your Dashboard</h1>

      <div className="filters">
        <select
          name="dateRange"
          value={filters.dateRange}
          onChange={(e) =>
            setFilters({ ...filters, dateRange: e.target.value })
          }
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
        <select
          name="jobType"
          value={filters.jobType}
          onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
        >
          <option>All</option>
          <option>Jobs</option>
          <option>Internships</option>
        </select>
      </div>

      <div className="stats-grid">
        {[
          { title: "Jobs Posted", value: jobs.length, icon: "📄" },
          {
            title: "Internships Posted",
            value: internships.length,
            icon: "🎓",
          },
          {
            title: "Applications Received",
            value: applications.length,
            icon: "📥",
          },

          {
            title: "Interviews Scheduled",
            value: interviews.length,
            icon: "📅",
          },
          { title: "Messages", value: 6, icon: "✉️" },
        ].map((stat, index) => (
          <div
            className="stat-card"
            key={index}
            onClick={() => handleCardClick(stat.title)}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-row">
        <div className="chart-container half-chart">
          <h2>Post Trends (Weekly)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                {
                  name: "Week 1",
                  Jobs: jobs.length / 4,
                  Internships: internships.length / 4,
                },
                {
                  name: "Week 2",
                  Jobs: jobs.length / 4,
                  Internships: internships.length / 4,
                },
                {
                  name: "Week 3",
                  Jobs: jobs.length / 4,
                  Internships: internships.length / 4,
                },
                {
                  name: "Week 4",
                  Jobs: jobs.length / 4,
                  Internships: internships.length / 4,
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Jobs" fill="#8884d8" />
              <Bar dataKey="Internships" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container half-chart">
          <h2>Posts Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Jobs", value: jobs.length },
                  { name: "Internships", value: internships.length },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                <Cell fill="#0088FE" />
                <Cell fill="#00C49F" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Details Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={handleCloseModal}>
              X
            </button>
            <h2>{selectedStat}</h2>
            <table>
              <thead>
                <tr>
                  {selectedStat === "Jobs Posted" && (
                    <>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </>
                  )}
                  {selectedStat === "Internships Posted" && (
                    <>
                      <th>Title</th>
                      <th>Duration</th>
                      <th>deadline</th>
                      <th>Actions</th>
                    </>
                  )}
                  {selectedStat === "Applications Received" && (
                    <>
                      <th>Applicant Name</th>
                      <th>Email</th>
                      <th>Job Title</th>
                      <th>Type</th>
                      <th>Resume</th>
                    </>
                  )}

                  {selectedStat === "Interviews Scheduled" && (
                    <>
                      <th>Candidate</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {getListData().map((item) => (
                  <tr key={item.id}>
                    {selectedStat === "Jobs Posted" && (
                      <>
                        <td>{item.title}</td>
                        <td>{item.status}</td>
                        <td>{item.description}</td>

                        <td>
                          <button
                            onClick={() => openEditModal(item)}
                            className="upbtn"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, selectedStat)}
                            className="delbtn"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                    {selectedStat === "Internships Posted" && (
                      <>
                        <td>{item.title}</td>
                        <td>{item.duration}</td>
                        <td>{item.deadline}</td>
                        <td>
                          <button
                            onClick={() => openEditModal(item)}
                            className="upbtn"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, selectedStat)}
                            className="delbtn"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}

                    {selectedStat === "Applications Received" && (
                      <>
                        <td>{item.studentName}</td>
                        <td>{item.studentEmail}</td>
                        <td>{item.jobTitle}</td>
                        <td>{item.opportunityType}</td>
                        <td>
                          <a
                            href={item.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => viewResume(item.resumeContent)}
                          >
                            View Resume
                          </a>
                        </td>
                      </>
                    )}

                    {selectedStat === "Interviews Scheduled" && (
                      <>
                        <td>{item.candidateName}</td>
                        <td>{item.email}</td>
                        <td>{item.interviewDate}</td>
                        <td>{item.interviewTime}</td>
                        <td>
                          <button
                            onClick={() => openEditModal(item)}
                            className="upbtn"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, selectedStat)}
                            className="delbtn"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content1" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeEditModal}>
              X
            </button>
            <h2>Edit {selectedStat}</h2>
            <form onSubmit={handleEditSubmit}>
              {selectedStat === "Jobs Posted" && (
                <>
                  <label>Title</label>
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) => handleEditChange("title", e.target.value)}
                    required
                  />

                  <label>Company</label>
                  <input
                    type="text"
                    value={editForm.company || ""}
                    onChange={(e) =>
                      handleEditChange("company", e.target.value)
                    }
                    required
                  />
                  <label>Location</label>
                  <input
                    type="text"
                    value={editForm.location || ""}
                    onChange={(e) =>
                      handleEditChange("location", e.target.value)
                    }
                    required
                  />
                  <label>Deadline</label>
                  <input
                    type="date"
                    value={editForm.deadline || ""}
                    onChange={(e) =>
                      handleEditChange("deadline", e.target.value)
                    }
                    required
                  />
                  <label>Status</label>
                  <select
                    name="status"
                    value={editForm.status || "Open"}
                    onChange={(e) => handleEditChange("status", e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <label>Description</label>
                  <textarea
                    value={editForm.description || ""}
                    onChange={(e) =>
                      handleEditChange("description", e.target.value)
                    }
                    required
                  />
                </>
              )}
              {selectedStat === "Internships Posted" && (
                <>
                  <label>Title</label>
                  <input
                    type="text"
                    value={editForm.title || ""}
                    onChange={(e) => handleEditChange("title", e.target.value)}
                    required
                  />
                  <label>deadline</label>
                  <input
                    type="text"
                    value={editForm.deadline || ""}
                    onChange={(e) =>
                      handleEditChange("deadline", e.target.value)
                    }
                    required
                  />
                  <label>Company</label>
                  <input
                    type="text"
                    value={editForm.company || ""}
                    onChange={(e) =>
                      handleEditChange("company", e.target.value)
                    }
                    required
                  />
                  <label>Duration</label> {/* Add this block */}
                  <input
                    type="text"
                    value={editForm.duration || ""}
                    onChange={(e) =>
                      handleEditChange("duration", e.target.value)
                    }
                    required
                  />
                  <label>Location</label>
                  <input
                    type="text"
                    value={editForm.location || ""}
                    onChange={(e) =>
                      handleEditChange("location", e.target.value)
                    }
                    required
                  />
                </>
              )}
              {selectedStat === "Interviews Scheduled" && (
                <>
                  <label>Candidate Name</label>
                  <input
                    type="text"
                    value={editForm.candidateName || ""}
                    onChange={(e) =>
                      handleEditChange("candidateName", e.target.value)
                    }
                    required
                  />
                  <label>Email</label>
                  <input
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) => handleEditChange("email", e.target.value)}
                    required
                  />
                  <label>Interview Date</label>
                  <input
                    type="date"
                    value={editForm.interviewDate || ""}
                    onChange={(e) =>
                      handleEditChange("interviewDate", e.target.value)
                    }
                    required
                  />
                  <label>Interview Time</label>
                  <input
                    type="time"
                    value={editForm.interviewTime || ""}
                    onChange={(e) =>
                      handleEditChange("interviewTime", e.target.value)
                    }
                    required
                  />
                  <label>Interviewer</label>
                  <input
                    type="text"
                    value={editForm.interviewer || ""}
                    onChange={(e) =>
                      handleEditChange("interviewer", e.target.value)
                    }
                    required
                  />
                  <label>Location</label>
                  <input
                    type="text"
                    value={editForm.location || ""}
                    onChange={(e) =>
                      handleEditChange("location", e.target.value)
                    }
                    required
                  />
                </>
              )}
              <button type="submit" className="submit-btn">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
