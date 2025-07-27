import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./adminpage.css";

const Settings = () => {
  const [platformSettings, setPlatformSettings] = useState({
    siteName: "My Platform",
    enableEmailNotifications: true,
    defaultUserRole: "user",
  });

  const [adminEmail, setAdminEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleSettingsChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPlatformSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const confirmAction = (action) => {
    setPendingAction(() => action);
    setShowConfirmModal(true);
  };

  const executePendingAction = () => {
    if (pendingAction) pendingAction();
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const cancelModal = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  const handlePasswordChange = async () => {
    if (!adminEmail || !oldPassword || !newPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to change your password.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/admins/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: adminEmail,
            oldPassword,
            newPassword,
          }),
        }
      );

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text }; // fallback if not valid JSON
      }

      if (response.ok) {
        toast.success(data.message || "Password updated successfully.");
        setAdminEmail("");
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(data.message || "Password update failed.");
      }
    } catch (error) {
      console.error("Password Change Error:", error);
      toast.error("Error connecting to server.");
    }
  };

  const savePlatformSettings = async () => {
    // Optionally send platformSettings to backend here
    toast.success("Platform settings saved!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="page-container"
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <h1>
        <FontAwesomeIcon icon={faCogs} /> Settings
      </h1>
      <p>Adjust your admin preferences below:</p>

      {/* Admin Account Settings */}
      <div className="settings-form">
        <label>
          Admin Email:
          <input
            type="email"
            value={adminEmail}
            placeholder="admin@example.com"
            onChange={(e) => setAdminEmail(e.target.value)}
          />
        </label>

        <label>
          Old Password:
          <input
            type="password"
            value={oldPassword}
            placeholder="••••••••"
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </label>

        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            placeholder="••••••••"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>

        <button
          type="button"
          onClick={() => confirmAction(handlePasswordChange)}
        >
          Change Password
        </button>
      </div>

      {/* Platform Settings */}
      <section className="platform-settings">
        <h2>Platform Settings</h2>

        <div className="settings-form">
          <label>
            Site Name:
            <input
              type="text"
              name="siteName"
              value={platformSettings.siteName}
              onChange={handleSettingsChange}
            />
          </label>

          <label>
            Enable Email Notifications:
            <input
              type="checkbox"
              name="enableEmailNotifications"
              checked={platformSettings.enableEmailNotifications}
              onChange={handleSettingsChange}
            />
          </label>

          <label>
            Default User Role:
            <select
              name="defaultUserRole"
              value={platformSettings.defaultUserRole}
              onChange={handleSettingsChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <button
            type="button"
            onClick={() => confirmAction(savePlatformSettings)}
          >
            Save Platform Settings
          </button>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Action</h3>
            <p>Are you sure you want to proceed with this change?</p>
            <div className="modal-buttons">
              <button onClick={executePendingAction}>Yes, Confirm</button>
              <button onClick={cancelModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Settings;
