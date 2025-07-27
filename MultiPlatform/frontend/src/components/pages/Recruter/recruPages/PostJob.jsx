import React, { useState } from "react";
import "./recruterpage.css";

const PostJob = () => {
  const [job, setJob] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    deadline: "",
    status: "Open",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/recruiter/postJob",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(job),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to post job.");
      }

      alert("✅ Job posted successfully!");

      setJob({
        title: "",
        description: "",
        company: "",
        location: "",
        deadline: "",
        status: "Open",
      });
    } catch (err) {
      console.error("❌ Error posting job:", err);
      alert("Failed to post job. Please check the console for more details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="job-form-container">
      <h2>Post a Job</h2>
      <form className="job-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Job Title"
          value={job.title}
          onChange={handleChange}
          required
        />
        <input
          name="company"
          placeholder="Company Name"
          value={job.company}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={job.location}
          onChange={handleChange}
          required
        />
        <input
          name="deadline"
          type="date"
          placeholder="Application Deadline"
          value={job.deadline}
          onChange={handleChange}
          required
        />
        <select
          name="status"
          value={job.status}
          onChange={handleChange}
          className="opt"
          required
        >
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        <textarea
          name="description"
          placeholder="Job Description"
          value={job.description}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
