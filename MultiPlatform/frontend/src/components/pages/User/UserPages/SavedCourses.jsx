import React, { useState } from "react";
import "./userpage.css";

const demoSavedCourses = [
  {
    title: "JavaScript for Beginners",
    description: "Learn JavaScript from scratch with hands-on projects.",
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6cR2WnN_lmPNmnvMdPowM2JvcGp67Q3rEIw&s",
    instructor: "Alice Johnson",
    duration: "6h",
  },
  {
    title: "Advanced React & Redux",
    description: "Deep dive into React, Redux, hooks, and performance.",
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9j8P106aWlqwUWufOJlL5pLeSowFZCyvZHA&s",
    instructor: "Bob Smith",
    duration: "8h",
  },
];

const SavedCourses = ({ savedCourses = demoSavedCourses }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  return (
    <section className="saved-courses-section">
      <h3>Saved Courses</h3>
      {savedCourses.length === 0 ? (
        <p className="empty-msg">No saved courses yet.</p>
      ) : (
        <div className="saved-course-grid">
          {savedCourses.map((course) => (
            <div key={course.title} className="saved-course-card">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="saved-course-thumbnail"
              />
              <div className="saved-course-content">
                <h4>{course.title}</h4>
                <p className="saved-course-desc">{course.description}</p>
                <p className="saved-course-meta">
                  <strong>Instructor:</strong> {course.instructor} ·{" "}
                  <strong>Duration:</strong> {course.duration}
                </p>
                <button
                  className="view-btn"
                  onClick={() => setSelectedCourse(course)}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCourse && (
        <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedCourse(null)}
            >
              ×
            </button>
            <img
              src={selectedCourse.thumbnail}
              alt={selectedCourse.title}
              className="modal-thumbnail"
            />
            <h2>{selectedCourse.title}</h2>
            <p>{selectedCourse.description}</p>
            <p>
              <strong>Instructor:</strong> {selectedCourse.instructor}
            </p>
            <p>
              <strong>Duration:</strong> {selectedCourse.duration}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default SavedCourses;
