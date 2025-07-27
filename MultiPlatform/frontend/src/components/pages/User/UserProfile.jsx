import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./userprofile.css";

const ProfilePage = () => {
  const profileRef = useRef(null);

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [basicInfo, setBasicInfo] = useState({
    fullName: "",
    email: "",
    mobile: "",
    location: "",
    relocate: false,
    dob: "",
    gender: "",
  });

  const [education, setEducation] = useState({
    tenth: "",
    twelfth: "",
    degree: "",
    degreeCollege: "",
    degreeSpecialization: "",
    degreeYear: "",
    degreeCGPA: "",
  });

  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [internships, setInternships] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const [onlineProfiles, setOnlineProfiles] = useState({
    github: "",
    linkedin: "",
    leetcode: "",
    portfolio: "",
  });

  const [careerObjective, setCareerObjective] = useState("");
  const [resume, setResume] = useState(null);

  const [newProject, setNewProject] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newInternship, setNewInternship] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newAchievement, setNewAchievement] = useState("");
  const [editMode, setEditMode] = useState(true);

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:8080/api/profile/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setBasicInfo({
          fullName: data.fullName || "",
          email: data.email || "",
          mobile: data.mobile || "",
          location: data.location || "",
          relocate: data.relocate || false,
          dob: data.dob || "",
          gender: data.gender || "",
        });

        setEducation({
          tenth: data.tenth || "",
          twelfth: data.twelfth || "",
          degree: data.degree || "",
          degreeCollege: data.degreeCollege || "",
          degreeSpecialization: data.degreeSpecialization || "",
          degreeYear: data.degreeYear || "",
          degreeCGPA: data.degreeCGPA || "",
        });
        setProjects(data.projects || []);
        setSkills(data.skills || []);
        setInternships(data.internships || []);
        setCertifications(data.certifications || []);
        setAchievements(data.achievements || []);
        setOnlineProfiles({
          github: data.github || "",
          linkedin: data.linkedin || "",
          leetcode: data.leetcode || "",
          portfolio: data.portfolio || "",
        });
        setCareerObjective(data.careerObjective || "");
        if (data.resumeName) {
          setResume({ name: data.resumeName });
        }
      })

      .catch(() => console.warn("❌ Failed to fetch profile from server"));
  }, [token]);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;
    if (!editMode) return;

    switch (section) {
      case "basicInfo":
        setBasicInfo((prev) => ({ ...prev, [name]: value }));
        break;
      case "education":
        setEducation((prev) => ({ ...prev, [name]: value }));
        break;
      case "onlineProfiles":
        setOnlineProfiles((prev) => ({ ...prev, [name]: value }));
        break;
      case "careerObjective":
        setCareerObjective(value);
        break;
      default:
        break;
    }
  };

  const handleAddItem = (item, section) => {
    if (!item.trim() || !editMode) return;
    const trimmed = item.trim();
    switch (section) {
      case "projects":
        setProjects((prev) => [...prev, trimmed]);
        setNewProject("");
        break;
      case "skills":
        setSkills((prev) => [...prev, trimmed]);
        setNewSkill("");
        break;
      case "internships":
        setInternships((prev) => [...prev, trimmed]);
        setNewInternship("");
        break;
      case "certifications":
        setCertifications((prev) => [...prev, trimmed]);
        setNewCertification("");
        break;
      case "achievements":
        setAchievements((prev) => [...prev, trimmed]);
        setNewAchievement("");
        break;
      default:
        break;
    }
  };

  const handleResumeUpload = (e) => {
    if (!editMode) return;
    if (e.target.files.length > 0) {
      setResume(e.target.files[0]);
    }
  };

  const isFormValid = () => {
    if (!basicInfo.fullName || !basicInfo.email || !basicInfo.mobile) {
      toast.error("❌ Please fill in required basic info fields.");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!isFormValid()) return;
    if (!token) {
      toast.error("❌ Missing authentication token.");
      return;
    }

    const profileData = {
      ...basicInfo,
      ...education,
      projects,
      skills,
      internships,
      certifications,
      achievements,
      ...onlineProfiles,
      careerObjective,
      resumeName: resume?.name || "",
    };

    fetch("http://localhost:8080/api/profile", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })
      .then((res) => {
        if (res.status === 409) throw new Error("Profile already exists.");
        if (!res.ok) throw new Error("Failed to save profile.");
        return res.json();
      })
      .then(() => {
        if (resume) {
          const formData = new FormData();
          formData.append("file", resume);
          return fetch("http://localhost:8080/api/profile/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });
        }
      })
      .then((res) => {
        if (res && !res.ok) throw new Error("Resume upload failed");

        return res.text();
      })
      .then((fileName) => {
        setResume({ name: fileName || "resume.pdf" });
        toast.success("✅ Profile saved successfully!");
      });
  };

  const handlePrint = () => window.print();

  return (
    <div className="profile-wrapper">
      <ToastContainer position="top-center" />
      <div className="profile-controls">
        <button
          className="lockbtn"
          onClick={() => setEditMode((prev) => !prev)}
        >
          {editMode ? "🔒 Lock Editing" : "🔓 Unlock Editing"}
        </button>
      </div>
      <div className="profile-wrapper">
        <div className="profile-card" ref={profileRef}>
          <div className="profile-header">
            <h2>👤 My Profile</h2>
            <p className="profile-subtitle">
              Manage your personal and academic info
            </p>
          </div>

          {/* Basic Info */}
          <details className="profile-section" open>
            <summary>📇 Basic Info</summary>
            <div className="profile-section-content">
              <input
                name="fullName"
                placeholder="Full Name"
                value={basicInfo.fullName}
                onChange={(e) => handleInputChange(e, "basicInfo")}
                required
              />
              <input
                name="email"
                placeholder="Email"
                value={basicInfo.email}
                onChange={(e) => handleInputChange(e, "basicInfo")}
                required
              />
              <input
                name="mobile"
                placeholder="Mobile Number"
                value={basicInfo.mobile}
                onChange={(e) => handleInputChange(e, "basicInfo")}
                required
              />
              <input
                name="location"
                placeholder="Location"
                value={basicInfo.location}
                onChange={(e) => handleInputChange(e, "basicInfo")}
                required
              />

              <input
                name="dob"
                placeholder="Date of Birth"
                value={basicInfo.dob}
                onChange={(e) => handleInputChange(e, "basicInfo")}
                required
              />
              <input
                name="gender"
                placeholder="Gender"
                value={basicInfo.gender}
                onChange={(e) => handleInputChange(e, "basicInfo")}
                required
              />
            </div>
          </details>

          {/* Education Details */}
          <details className="profile-section" open>
            <summary>🎓 Education Details</summary>
            <div className="profile-section-content">
              <input
                name="tenth"
                placeholder="10th Grade Marks (%)"
                value={education.tenth}
                onChange={(e) => handleInputChange(e, "education")}
                required
              />
              <input
                name="twelfth"
                placeholder="12th Grade Marks (%)"
                value={education.twelfth}
                onChange={(e) => handleInputChange(e, "education")}
                required
              />

              <input
                name="degreeCollege"
                placeholder="College/University Name"
                value={education.degreeCollege}
                onChange={(e) => handleInputChange(e, "education")}
                required
              />
              <input
                name="degreeSpecialization"
                placeholder="Degree Specialization"
                value={education.degreeSpecialization}
                onChange={(e) => handleInputChange(e, "education")}
                required
              />
              <input
                name="degreeYear"
                placeholder="Year of Passing"
                value={education.degreeYear}
                onChange={(e) => handleInputChange(e, "education")}
                required
              />
              <input
                name="degreeCGPA"
                placeholder="Degree CGPA"
                value={education.degreeCGPA}
                onChange={(e) => handleInputChange(e, "education")}
                required
              />
            </div>
          </details>

          {/* Projects */}
          <details className="profile-section" open>
            <summary>💻 Projects</summary>
            <div className="profile-section-content">
              <div className="project-input-wrapper">
                <input
                  placeholder="Project title..."
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  required
                />

                <input
                  placeholder="Tech stack (e.g. React, Node.js)"
                  // value={projectTech}
                  onChange={(e) => setProjectTech(e.target.value)}
                />
                <input
                  placeholder="Website URL"
                  // value={projectDemo}
                  onChange={(e) => setProjectDemo(e.target.value)}
                />
                <input
                  placeholder="GitHub URL"
                  // value={projectGit}
                  onChange={(e) => setProjectGit(e.target.value)}
                />
                <textarea
                  placeholder="Description..."
                  // value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                />
                <button onClick={() => handleAddItem(newProject, "projects")}>
                  ➕ Add
                </button>
              </div>
              <ul className="project-list">
                {projects.map((proj, i) => (
                  <li key={i}>
                    🚀 {proj}
                    <button
                      className="remove-btn"
                      onClick={() =>
                        setProjects((prev) =>
                          prev.filter((_, index) => index !== i)
                        )
                      }
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          {/* Skills */}
          <details className="profile-section" open>
            <summary>💻 Technical Skills</summary>
            <div className="profile-section-content">
              <div className="skill-input-wrapper">
                <input
                  placeholder="Skill (e.g., JavaScript)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  required
                />
                <button onClick={() => handleAddItem(newSkill, "skills")}>
                  ➕ Add
                </button>
              </div>
              <ul className="skill-list">
                {skills.map((skill, i) => (
                  <li key={i}>
                    ⚙️ {skill}
                    <button
                      className="remove-btn"
                      onClick={() =>
                        setSkills((prev) =>
                          prev.filter((_, index) => index !== i)
                        )
                      }
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          {/* Internships */}
          <details className="profile-section" open>
            <summary>💼 Internships</summary>
            <div className="profile-section-content">
              <div className="internship-input-wrapper">
                <input
                  placeholder="Internship title..."
                  value={newInternship}
                  onChange={(e) => setNewInternship(e.target.value)}
                  required
                />
                <button
                  onClick={() => handleAddItem(newInternship, "internships")}
                >
                  ➕ Add
                </button>
              </div>
              <ul className="internship-list">
                {internships.map((intern, i) => (
                  <li key={i}>
                    🏢 {intern}
                    <button
                      className="remove-btn"
                      onClick={() =>
                        setInternships((prev) =>
                          prev.filter((_, index) => index !== i)
                        )
                      }
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          {/* Certifications */}
          <details className="profile-section" open>
            <summary>🏆 Certifications</summary>
            <div className="profile-section-content">
              <div className="certification-input-wrapper">
                <input
                  placeholder="Certification name..."
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  required
                />
                <button
                  onClick={() =>
                    handleAddItem(newCertification, "certifications")
                  }
                >
                  ➕ Add
                </button>
              </div>
              <ul className="certification-list">
                {certifications.map((cert, i) => (
                  <li key={i}>
                    🎓 {cert}
                    <button
                      className="remove-btn"
                      onClick={() =>
                        setCertifications((prev) =>
                          prev.filter((_, index) => index !== i)
                        )
                      }
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          {/* Achievements */}
          <details className="profile-section" open>
            <summary>🧠 Achievements</summary>
            <div className="profile-section-content">
              <div className="achievement-input-wrapper">
                <input
                  placeholder="Achievement..."
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  required
                />
                <button
                  onClick={() => handleAddItem(newAchievement, "achievements")}
                >
                  ➕ Add
                </button>
              </div>
              <ul className="achievement-list">
                {achievements.map((achievement, i) => (
                  <li key={i}>
                    🏆 {achievement}
                    <button
                      className="remove-btn"
                      onClick={() =>
                        setAchievements((prev) =>
                          prev.filter((_, index) => index !== i)
                        )
                      }
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </details>

          {/* Online Profiles */}
          <details className="profile-section" open>
            <summary>🌐 Online Profiles</summary>
            <div className="profile-section-content">
              <input
                name="github"
                placeholder="GitHub Profile"
                value={onlineProfiles.github}
                onChange={(e) => handleInputChange(e, "onlineProfiles")}
                required
              />
              <input
                name="linkedin"
                placeholder="LinkedIn Profile"
                value={onlineProfiles.linkedin}
                onChange={(e) => handleInputChange(e, "onlineProfiles")}
                required
              />
              <input
                name="leetcode"
                placeholder="LeetCode Profile"
                value={onlineProfiles.leetcode}
                onChange={(e) => handleInputChange(e, "onlineProfiles")}
                required
              />
              <input
                name="portfolio"
                placeholder="Portfolio URL"
                value={onlineProfiles.portfolio}
                onChange={(e) => handleInputChange(e, "onlineProfiles")}
                required
              />
            </div>
          </details>

          {/* Career Objective */}
          <details className="profile-section" open>
            <summary>🚀 Career Objective</summary>
            <div className="profile-section-content">
              <textarea
                value={careerObjective}
                onChange={(e) => handleInputChange(e, "careerObjective")}
                placeholder="Write your career objective"
                required
              />
            </div>
          </details>

          <div className="resume-section">
            <input
              type="file"
              onChange={handleResumeUpload}
              accept=".pdf,.doc,.docx"
              disabled={!editMode}
            />

            {resume && (
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() =>
                    window.open(
                      "http://localhost:8080/api/profile/view",
                      "_blank"
                    )
                  }
                  className="viewbtn"
                >
                  👁️ View Resume
                </button>

                <button
                  onClick={() => {
                    fetch("http://localhost:8080/api/profile/download", {
                      method: "GET",
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    })
                      .then((res) => res.blob())
                      .then((blob) => {
                        const url = window.URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute(
                          "download",
                          resume.name || "resume.pdf"
                        );
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                      })
                      .catch(() => toast.error("❌ Failed to download resume"));
                  }}
                  className="downloadbtn"
                >
                  ⬇️ Download Resume
                </button>
              </div>
            )}
          </div>

          <div className="profile-actions">
            <button onClick={handleSave} className="save-btn">
              💾 Save Profile
            </button>
            <button onClick={handlePrint} className="print-btn">
              🖨️ Print Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
