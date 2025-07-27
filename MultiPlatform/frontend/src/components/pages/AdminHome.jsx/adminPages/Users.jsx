import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faEdit,
  faTrash,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import Modal from "react-modal";
import "./adminpage.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/admins/allUsers"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (email) => {
    if (!window.confirm(`Are you sure you want to delete ${email}?`)) return;
    try {
      await axios.delete("http://localhost:8080/api/admins/deleteUser", {
        params: { email },
      });
      setUsers((prev) => prev.filter((u) => u.email !== email));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:8080/api/admins/updateUser",
        selectedUser
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.email === selectedUser.email ? selectedUser : user
        )
      );
      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((val) =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  const openModal = (user) => {
    setSelectedUser({ ...user });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalIsOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="admin-users-container"
    >
      <h1 className="admin-users-title">
        <FontAwesomeIcon icon={faUsers} /> Manage Users
      </h1>

      {/* Search */}
      <div className="admin-users-search-container">
        <input
          type="text"
          placeholder="Search users..."
          className="admin-users-search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} className="admin-users-search-icon" />
      </div>

      {/* Table */}
      <table className="admin-users-table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Age</th>
            <th>DOB</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={index} className="admin-users-row">
                <td>{`${user.firstName} ${user.middleName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>{user.age}</td>
                <td>{user.dob}</td>
                <td>
                  <button
                    className="admin-users-action-btn"
                    onClick={() => openModal(user)}
                    title="Edit User"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="admin-users-action-btn delete"
                    title="Delete User"
                    onClick={() => handleDelete(user.email)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="admin-users-empty">
                No users match your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="admin-users-modal"
        overlayClassName="admin-users-modal-overlay"
        ariaHideApp={false}
      >
        <h2>Edit User</h2>
        {selectedUser && (
          <div className="admin-users-modal-form">
            <label>
              First Name:
              <input
                type="text"
                value={selectedUser.firstName}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    firstName: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Middle Name:
              <input
                type="text"
                value={selectedUser.middleName}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    middleName: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                value={selectedUser.lastName}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, lastName: e.target.value })
                }
              />
            </label>
            <label>
              Email:
              <input type="email" value={selectedUser.email} disabled />
            </label>
            <label>
              Age:
              <input
                type="number"
                value={selectedUser.age}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    age: Number(e.target.value),
                  })
                }
              />
            </label>
            <label>
              DOB:
              <input
                type="date"
                value={selectedUser.dob}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, dob: e.target.value })
                }
              />
            </label>
            <div className="admin-users-modal-actions">
              <button onClick={closeModal}>Cancel</button>
              <button
                onClick={handleSave}
                disabled={!selectedUser.firstName || !selectedUser.lastName}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Users;
