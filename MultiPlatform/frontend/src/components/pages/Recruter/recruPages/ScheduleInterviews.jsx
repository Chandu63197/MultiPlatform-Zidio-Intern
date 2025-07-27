import React, { useState } from "react";
import "./recruterpage.css";

const ScheduleInterviews = () => {
  const [formData, setFormData] = useState({
    candidateName: "",
    email: "",
    interviewDate: "",
    interviewTime: "",
    interviewer: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        "http://localhost:8080/api/recruiter/scheduleInterview",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to schedule interview.");
      }

      alert("✅ Interview scheduled successfully!");

      setFormData({
        candidateName: "",
        email: "",
        interviewDate: "",
        interviewTime: "",
        interviewer: "",
        location: "",
      });
    } catch (error) {
      console.error("❌ Error scheduling interview:", error);
      alert("Failed to schedule interview. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-container">
      <h1 className="title">Recruiter Panel - Schedule Interviews</h1>
      <form className="schedule-form" onSubmit={handleSubmit}>
        <label>
          Candidate Name:
          <input
            type="text"
            name="candidateName"
            value={formData.candidateName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Candidate Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Interview Date:
          <input
            type="date"
            name="interviewDate"
            value={formData.interviewDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Interview Time:
          <input
            type="time"
            name="interviewTime"
            value={formData.interviewTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Interviewer Name:
          <input
            type="text"
            name="interviewer"
            value={formData.interviewer}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Location / Meeting Link:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Scheduling..." : "Schedule Interview"}
        </button>
      </form>
    </div>
  );
};

export default ScheduleInterviews;
