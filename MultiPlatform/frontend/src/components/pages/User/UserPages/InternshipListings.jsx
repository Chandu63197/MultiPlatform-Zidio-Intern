import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import {
  FaCode,
  FaBullhorn,
  FaPaintBrush,
  FaBriefcase,
  FaStar,
  FaRegStar,
  FaTimes,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./userpage.css";

const InternshipListings = () => {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalData, setModalData] = useState(null);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false); // ✅ NEW

  const token = localStorage.getItem("token");
  const ITEMS_PER_PAGE = 5;

  const categoryIcons = {
    Development: <FaCode />,
    Marketing: <FaBullhorn />,
    Design: <FaPaintBrush />,
    Business: <FaBriefcase />,
  };

  const fetchInternships = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/student/internships",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInternships(res.data);
    } catch (err) {
      console.error("Failed to fetch internships:", err);
      toast.error("Failed to fetch internships.");
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/student/internship-applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
      toast.error("Failed to fetch applications.");
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/student/favorites",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // ✅ store only internship IDs
      const favIds = res.data.map((i) => i.id);
      setFavorites(favIds);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      toast.error("Failed to load favorites.");
    }
  };

  const fetchData = async () => {
    await Promise.all([fetchInternships(), fetchApplications()]);
  };

  useEffect(() => {
    fetchData();
    fetchFavorites();
  }, []);

  const isApplied = (jobId) =>
    applications.some((app) => app.internship && app.internship.id === jobId);

  const getStatus = (jobId) =>
    applications.find((app) => app.internship && app.internship.id === jobId)
      ?.application?.status;

  const handleApply = async (jobId) => {
    try {
      await axios.post(
        "http://localhost:8080/api/student/apply-internship",
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Application submitted!");
      closeModal();
      fetchApplications();
    } catch (err) {
      console.error("Apply error:", err.response?.data || err.message);
      toast.error(err.response?.data || "Failed to apply.");
    }
  };

  const toggleFavorite = async (id) => {
    try {
      if (favorites.includes(id)) {
        await axios.delete(
          `http://localhost:8080/api/student/favorites/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.info("Removed from favorites");
        setFavorites(favorites.filter((fid) => fid !== id));
      } else {
        await axios.post(
          `http://localhost:8080/api/student/favorites/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        toast.success("Added to favorites");
        setFavorites([...favorites, id]);
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
      toast.error("Failed to update favorites.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="status-badge pending">Pending</span>;
      case "accepted":
        return <span className="status-badge accepted">Accepted</span>;
      case "rejected":
        return <span className="status-badge rejected">Rejected</span>;
      default:
        return null;
    }
  };

  const filteredInternships = internships.filter(
    (i) =>
      (i.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.location?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedLocation === "All" || i.location === selectedLocation) &&
      (selectedCategory === "All" || i.category === selectedCategory) &&
      (!showOnlyFavorites || favorites.includes(i.id)) // ✅ NEW condition
  );

  const uniqueLocations = [
    "All",
    ...new Set(internships.map((i) => i.location).filter(Boolean)),
  ];
  const uniqueCategories = [
    "All",
    ...new Set(internships.map((i) => i.category).filter(Boolean)),
  ];

  const totalPages = Math.ceil(filteredInternships.length / ITEMS_PER_PAGE);
  const displayedInternships = filteredInternships.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openModal = (intern) => setModalData(intern);
  const closeModal = () => setModalData(null);

  return (
    <div className="intern-container">
      <h3>Internship Listings</h3>

      {/* ✅ Filter bar */}
      <div className="intern-filter-bar">
        <input
          type="text"
          placeholder="Search internships..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          value={selectedLocation}
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            setCurrentPage(1);
          }}
        >
          {uniqueLocations.map((loc) => (
            <option key={`loc-${loc}`} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          {uniqueCategories.map((cat) => (
            <option key={`cat-${cat}`} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <label className="intern-checkbox">
          <input
            type="checkbox"
            checked={showOnlyFavorites}
            onChange={() => setShowOnlyFavorites((prev) => !prev)}
          />
          Show Only Favorites
        </label>
      </div>

      {displayedInternships.map((intern) => {
        const applied = isApplied(intern.id);
        const status = getStatus(intern.id);
        return (
          <div
            key={intern.id}
            className={`intern-card ${applied ? "applied-card" : ""}`}
          >
            <img src={intern.logo} alt={`${intern.company} logo`} />
            <div
              className="intern-info"
              onClick={() => openModal(intern)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openModal(intern)}
            >
              <h4>
                {intern.title}{" "}
                {applied && (
                  <>
                    <span className="applied-badge">Applied</span>{" "}
                    {getStatusBadge(status)}
                  </>
                )}
              </h4>
              <p>
                <strong>{intern.company}</strong> — {intern.location}
              </p>
              <p>
                Duration: {intern.duration} | Stipend: {intern.stipend}
              </p>
              <small>
                {intern.posted} | {categoryIcons[intern.category]}{" "}
                {intern.category}
              </small>
            </div>
            <div className="intern-actions">
              <button onClick={() => toggleFavorite(intern.id)}>
                {favorites.includes(intern.id) ? (
                  <FaStar color="gold" />
                ) : (
                  <FaRegStar />
                )}
              </button>
              <button
                className="intern-apply-btn"
                onClick={() => openModal(intern)}
                disabled={applied}
              >
                {applied ? "Applied" : "Apply"}
              </button>
            </div>
          </div>
        );
      })}

      {/* ✅ Pagination */}
      <div className="intern-pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          &lt; Prev
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next &gt;
        </button>
      </div>

      {/* ✅ Modal */}
      {modalData && (
        <div className="intern-modal">
          <div className="intern-modal-content">
            <button className="intern-close-modal" onClick={closeModal}>
              <FaTimes />
            </button>
            <h2>{modalData.title}</h2>
            <p>
              <strong>{modalData.company}</strong>
            </p>
            <p>
              <strong>Location:</strong> {modalData.location}
            </p>
            <p>
              <strong>Duration:</strong> {modalData.duration}
            </p>
            <p>
              <strong>Stipend:</strong> {modalData.stipend}
            </p>
            <p>
              <strong>Category:</strong> {modalData.category}
            </p>
            <p>
              <strong>Description:</strong> {modalData.description}
            </p>
            <button
              onClick={() => handleApply(modalData.id)}
              disabled={isApplied(modalData.id)}
            >
              {isApplied(modalData.id) ? "Already Applied" : "Apply Now"}
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default InternshipListings;
