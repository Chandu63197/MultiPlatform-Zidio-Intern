import React from "react";
import {
  FaBookOpen,
  FaUserGraduate,
  FaStar,
  FaClock,
  FaChalkboardTeacher,
} from "react-icons/fa";
import "./userpage.css";

const demoCourses = [
  {
    title: "JavaScript for Beginners",
    description: "Learn JavaScript from scratch with hands-on projects.",
    category: "Programming",
    level: "Beginner",
    price: "Free",
    priceValue: 0,
    rating: 4.5,
    reviews: 120,
    duration: "6h",
    lessons: 24,
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6cR2WnN_lmPNmnvMdPowM2JvcGp67Q3rEIw&s",
    instructor: {
      name: "Alice Johnson",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl9ghCj6Y4PM4fS1xtt4mBsoBVHWhLQZu0w68CqSHT-8g9FpvhtJyeZ5T9LdiAswgIgio&usqp=CAU",
    },
  },
  {
    title: "Advanced React & Redux",
    description:
      "Deep dive into React, Redux, hooks, and performance optimization.",
    category: "Web Development",
    level: "Advanced",
    price: "$49",
    priceValue: 49,
    rating: 4.8,
    reviews: 85,
    duration: "8h",
    lessons: 30,
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9j8P106aWlqwUWufOJlL5pLeSowFZCyvZHA&s",
    instructor: {
      name: "Bob Smith",
      avatar:
        "https://img.freepik.com/free-vector/hand-drawn-essay-illustration_23-2150451569.jpg?semt=ais_hybrid&w=740",
    },
  },
];

const Enrollments = ({
  enrolledCourses = ["JavaScript for Beginners"],
  allCourses = demoCourses,
}) => {
  const enrolledCourseDetails = allCourses.filter((course) =>
    enrolledCourses.includes(course.title)
  );

  return (
    <section className="enrollments-container">
      <h2>My Enrollments</h2>
      {enrolledCourseDetails.length === 0 ? (
        <p className="no-enrollments">
          You have not enrolled in any courses yet.
        </p>
      ) : (
        <div className="course-grid">
          {enrolledCourseDetails.map((course) => (
            <div className="course-card" key={course.title}>
              <div className="thumbnail-wrapper">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="user-enroll-thumbnail"
                />
              </div>
              <h3>{course.title}</h3>
              <p>{course.description}</p>

              <div className="price-rating">
                <span
                  className={`course-price ${
                    course.price === "Free" ? "free" : "paid"
                  }`}
                >
                  <FaBookOpen /> {course.price}
                </span>
                <span className="course-rating">
                  <FaStar /> {course.rating} ({course.reviews})
                </span>
              </div>

              <p className="course-meta">
                <FaClock /> {course.duration} &bull; <FaBookOpen />{" "}
                {course.lessons} lessons &bull; <FaUserGraduate /> Level:{" "}
                {course.level}
              </p>

              {/* <div className="instructor">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="instructor-avatar"
                  />
                  <span>
                    <FaChalkboardTeacher /> {course.instructor.name}
                  </span>
                </div> */}

              <button
                className="resume-btn"
                onClick={() => alert(`Resuming ${course.title}...`)}
              >
                Resume Course
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Enrollments;
