import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaMoon,
  FaSun,
  FaHeart,
  FaRegHeart,
  FaClock,
  FaBookOpen,
  FaStar,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaArrowLeft,
  FaArrowRight,
  FaGraduationCap,
} from "react-icons/fa";
import "./userpage.css";

// Demo courses data
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
    durationValue: 6,
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
    durationValue: 8,
    lessons: 30,
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9j8P106aWlqwUWufOJlL5pLeSowFZCyvZHA&s",
    instructor: {
      name: "Bob Smith",
      avatar:
        "https://img.freepik.com/free-vector/hand-drawn-essay-illustration_23-2150451569.jpg?semt=ais_hybrid&w=740",
    },
  },
  {
    title: "UI/UX Design Essentials",
    description:
      "Master the fundamentals of user interface and experience design.",
    category: "Design",
    level: "Intermediate",
    price: "$29",
    priceValue: 29,
    rating: 4.2,
    reviews: 67,
    duration: "5h",
    durationValue: 5,
    lessons: 20,
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf3Xnx7bJj3dLjZvl-dWr3xBXLYfg_e2EnRN5M3Z05sYJfL8XKLGRvzVwKnKx1S9CvYME&usqp=CAU",
    instructor: {
      name: "Clara Davis",
      avatar:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ-5lg2BQXVuL6ZOrcH5ngjO0378aNcuOsbTVWxu4ixSs1nUJxj4L-JBHT8Q8Ssbudnpg&usqp=CAU",
    },
  },
];

const BrowseCourses = ({
  allCourses = demoCourses,
  enrollCourse = (title) => alert(`Enroll clicked: ${title}`),
  enrolledCourses = [],
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [page, setPage] = useState(1);
  const coursesPerPage = 6;
  const courseGridRef = useRef(null);

  const filteredCourses = (allCourses || [])
    .filter((course) =>
      course.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((course) =>
      categoryFilter ? course.category === categoryFilter : true
    )
    .filter((course) => (levelFilter ? course.level === levelFilter : true))
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (sortBy === "priceAsc")
        return (a.priceValue ?? 0) - (b.priceValue ?? 0);
      if (sortBy === "priceDesc")
        return (b.priceValue ?? 0) - (a.priceValue ?? 0);
      if (sortBy === "duration")
        return (a.durationValue ?? 0) - (b.durationValue ?? 0);
      return 0;
    });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const paginatedCourses = filteredCourses.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage
  );

  useEffect(() => {
    if (courseGridRef.current) {
      courseGridRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [page]);

  const toggleWishlist = (courseTitle) => {
    setWishlist((prev) =>
      prev.includes(courseTitle)
        ? prev.filter((c) => c !== courseTitle)
        : [...prev, courseTitle]
    );
  };

  return (
    <div className={`browse-container ${darkMode ? "dark" : ""}`}>
      <div className="header">
        <h1>Explore Courses</h1>
        <button
          className="dark-mode-toggle"
          onClick={() => setDarkMode((d) => !d)}
        >
          {darkMode ? <FaMoon /> : <FaSun />} {darkMode ? "Dark" : "Light"} Mode
        </button>
      </div>

      <div className="controls">
        <div className="control-icon-input">
          <FaSearch className="control-icon" />
          <input
            type="text"
            placeholder="Search courses, instructors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search courses"
          />
        </div>

        <div className="control-icon-select">
          <FaFilter className="control-icon" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {[...new Set(allCourses.map((c) => c.category))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="control-icon-select">
          <FaGraduationCap className="control-icon" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <option value="">All Levels</option>
            {[...new Set(allCourses.map((c) => c.level))].map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="control-icon-select">
          <FaSort className="control-icon" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="priceAsc">Price (Low to High)</option>
            <option value="priceDesc">Price (High to Low)</option>
            <option value="duration">Duration (Short to Long)</option>
          </select>
        </div>
      </div>

      <div className="course-grid" ref={courseGridRef}>
        {paginatedCourses.length === 0 ? (
          <p className="no-results">No courses match your filters.</p>
        ) : (
          paginatedCourses.map((course) => (
            <div key={course.title} className="course-card">
              <img src={course.thumbnail} alt={course.title} />
              <h2>{course.title}</h2>
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
                <FaClock /> {course.duration} · <FaBookOpen /> {course.lessons}{" "}
                lessons · <FaUserGraduate /> Level: {course.level}
              </p>

              {/* <div className="instructor">
                <img
                  src={course.instructor.avatar}
                  alt={`Instructor ${course.instructor.name}`}
                  className="instructor-avatar"
                />
                <span>
                  <FaChalkboardTeacher /> {course.instructor.name}
                </span>
              </div> */}

              <div className="card-actions">
                <button
                  className={`wishlist-btn ${
                    wishlist.includes(course.title) ? "wishlisted" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(course.title);
                  }}
                  aria-label={`Toggle wishlist for ${course.title}`}
                >
                  {wishlist.includes(course.title) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
                <button
                  className="enroll-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    enrollCourse(course.title);
                  }}
                >
                  <FaUserGraduate />
                  {enrolledCourses.includes(course.title)
                    ? " Enrolled"
                    : " Enroll"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <nav className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          <FaArrowLeft /> Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        >
          Next <FaArrowRight />
        </button>
      </nav>
    </div>
  );
};

export default BrowseCourses;
