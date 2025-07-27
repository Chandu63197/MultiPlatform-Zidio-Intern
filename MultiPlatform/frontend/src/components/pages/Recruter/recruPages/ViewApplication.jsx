import React, { useEffect, useState } from "react";
import axios from "axios";
import "./recruterpage.css";

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    if (!token) {
      console.error("Token not found in localStorage.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8080/api/recruiter/applications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (Array.isArray(res.data)) {
          setApplications(res.data);
        } else {
          console.error("Unexpected response format:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = (applicationId, newStatus) => {
    if (!applicationId) return;

    axios
      .put(
        `http://localhost:8080/api/recruiter/applications/${applicationId}/status?status=${newStatus}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setApplications((prevApps) =>
          prevApps.map((app) =>
            app.applicationId === applicationId
              ? { ...app, status: newStatus }
              : app
          )
        );
      })
      .catch((err) => {
        console.error("Status update failed", err);
        alert("Failed to update status. Try again.");
      });
  };

  if (loading) return <p>Loading applications...</p>;

  return (
    <div className="view-applications-container">
      <div className="view-applications-card">
        <main className="view-applications-content" style={{ width: "100%" }}>
          <h2>All Applications</h2>
          {applications.length === 0 ? (
            <p>No applications found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Student Email</th>
                  <th>Job Title</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Resume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => {
                  const isFinalStatus =
                    app.status === "Shortlisted" || app.status === "Rejected";

                  return (
                    <tr key={app.applicationId || `fallback-${index}`}>
                      <td>{app.studentName || "N/A"}</td>
                      <td>{app.studentEmail || "N/A"}</td>
                      <td>{app.jobTitle || "N/A"}</td>
                      <td>{app.opportunityType || app.type || "N/A"}</td>
                      <td>{app.status || "Pending"}</td>
                      <td>
                        <button
                          className="applicationbutton"
                          onClick={() =>
                            updateStatus(app.applicationId, "Shortlisted")
                          }
                          disabled={!app.applicationId || isFinalStatus}
                        >
                          Shortlist
                        </button>
                        <button
                          className="applicationbutton"
                          onClick={() =>
                            updateStatus(app.applicationId, "Rejected")
                          }
                          disabled={!app.applicationId || isFinalStatus}
                        >
                          Reject
                        </button>
                      </td>
                      <td>
                        <button
                          className="applicationbutton"
                          onClick={() => viewResume(app.resumeContent)}
                          disabled={!app.resumeContent}
                        >
                          View Resume
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </div>
  );
};

export default ViewApplications;
