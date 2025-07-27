import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGraduate,
  faEdit,
  faTrash,
  faSearch,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "./adminpage.css";

const ITEMS_PER_PAGE = 5;

const ManageInternships = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingInternship, setEditingInternship] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/admin/internships")
      .then((res) => {
        setInternships(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load internships.");
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/admin/internships/${id}`)
      .then(() => {
        setInternships(internships.filter((i) => i.id !== id));
        setConfirmDelete(null);
      })
      .catch(() => alert("Failed to delete internship."));
  };

  const handleEdit = (internship) => {
    setEditingInternship({ ...internship });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingInternship((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios
      .put(
        `http://localhost:8080/api/admin/internships/${editingInternship.id}`,
        editingInternship
      )
      .then((res) => {
        setInternships((prev) =>
          prev.map((i) => (i.id === res.data.id ? res.data : i))
        );
        setEditingInternship(null);
      })
      .catch(() => alert("Failed to update internship."));
  };

  const toggleStatus = (id) => {
    const target = internships.find((i) => i.id === id);
    const updated = {
      ...target,
      status: target.status === "Open" ? "Closed" : "Open",
    };

    axios
      .put(`http://localhost:8080/api/admin/internships/${id}`, updated)
      .then(() => {
        setInternships((prev) => prev.map((i) => (i.id === id ? updated : i)));
      })
      .catch(() => alert("Failed to toggle status."));
  };

  const sortedFiltered = internships
    .filter((i) => {
      const title = i.title || "";
      const company = i.company || "";
      const status = i.status || "";
      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const valA = a[sortKey]?.toLowerCase?.() || "";
      const valB = b[sortKey]?.toLowerCase?.() || "";
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  const totalPages = Math.ceil(sortedFiltered.length / ITEMS_PER_PAGE);
  const currentData = sortedFiltered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSort = (key) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <motion.div className="page-container">
      <h1>
        <FontAwesomeIcon icon={faUserGraduate} /> Manage Internships
      </h1>
      <input
        className="search-bar"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort("title")}>
                  Title{" "}
                  <FontAwesomeIcon
                    icon={
                      sortKey === "title"
                        ? sortOrder === "asc"
                          ? faArrowUp
                          : faArrowDown
                        : null
                    }
                  />
                </th>
                <th onClick={() => toggleSort("company")}>
                  Company{" "}
                  <FontAwesomeIcon
                    icon={
                      sortKey === "company"
                        ? sortOrder === "asc"
                          ? faArrowUp
                          : faArrowDown
                        : null
                    }
                  />
                </th>
                <th>Duration</th>
                <th>Status</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((i) => (
                <tr key={i.id}>
                  <td>{i.title}</td>
                  <td>{i.company}</td>
                  <td>{i.duration}</td>
                  <td>
                    <button onClick={() => toggleStatus(i.id)}>
                      {i.status || "Open"}
                    </button>
                  </td>
                  <td>{i.description}</td>
                  <td>
                    <button className="ebtn" onClick={() => handleEdit(i)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="dbtn"
                      onClick={() => setConfirmDelete(i.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={currentPage === idx + 1 ? "active" : ""}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {editingInternship && (
        <div className="intern-modal">
          <div className="modal-content">
            <h3>Edit Internship</h3>
            <input
              name="title"
              placeholder="Title"
              value={editingInternship.title}
              onChange={handleEditChange}
            />
            <input
              name="company"
              placeholder="Company"
              value={editingInternship.company}
              onChange={handleEditChange}
            />
            <input
              name="duration"
              placeholder="Duration"
              value={editingInternship.duration}
              onChange={handleEditChange}
            />
            <select
              name="status"
              value={editingInternship.status || "Open"}
              onChange={handleEditChange}
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>

            <textarea
              name="description"
              placeholder="Description"
              value={editingInternship.description || ""}
              onChange={handleEditChange}
            />
            <div>
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setEditingInternship(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="intern-modal">
          <div className="intern-modal-content">
            <h4>Confirm Delete?</h4>
            <button onClick={() => handleDelete(confirmDelete)}>Yes</button>
            <button onClick={() => setConfirmDelete(null)}>No</button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ManageInternships;
