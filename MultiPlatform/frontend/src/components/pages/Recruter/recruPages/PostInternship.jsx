import React, { useState } from "react";
import "./recruterpage.css";

const PostInternship = () => {
  const [internship, setInternship] = useState({
    title: "",
    company: "",
    location: "",
    duration: "",
    description: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInternship((prev) => ({ ...prev, [name]: value }));
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
        "http://localhost:8080/api/recruiter/postInternship",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(internship),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to post internship.");
      }

      alert("✅ Internship posted successfully!");

      // Clear form
      setInternship({
        title: "",
        company: "",
        location: "",
        duration: "",
        description: "",
        deadline: "",
      });
    } catch (err) {
      console.error("❌ Error posting internship:", err);
      alert("Failed to post internship. Please check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="internship-form-container">
      <h2>Post an Internship</h2>
      <form className="internship-form" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Internship Title"
          value={internship.title}
          onChange={handleChange}
          required
        />
        <input
          name="company"
          placeholder="Company Name"
          value={internship.company}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={internship.location}
          onChange={handleChange}
          required
        />
        <input
          name="duration"
          placeholder="Internship Duration"
          value={internship.duration}
          onChange={handleChange}
          required
        />
        <input
          name="deadline"
          type="date"
          placeholder="Application Deadline"
          value={internship.deadline}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Internship Description"
          value={internship.description}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post Internship"}
        </button>
      </form>
    </div>
  );
};

export default PostInternship;
