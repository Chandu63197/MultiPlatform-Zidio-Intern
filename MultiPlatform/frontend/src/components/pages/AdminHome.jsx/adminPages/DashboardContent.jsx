import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import "./Adminpage.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [filterRole, setFilterRole] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, jobRes, internRes, appRes] = await Promise.all([
          axios.get("http://localhost:8080/api/admins/allUsers"),
          axios.get("http://localhost:8080/api/admin/jobs"),
          axios.get("http://localhost:8080/api/admin/internships"),
          axios.get("http://localhost:8080/api/admin/applications/with-jobs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(userRes.data);
        setJobs(jobRes.data);
        setInternships(internRes.data);
        setApplications(appRes.data);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    };

    fetchData();
  }, [token]);

  const totalUsers = users.length;
  const totalJobs = jobs.length;
  const totalInternships = internships.length;
  const totalApplications = applications.length;

  const userRoles = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const filteredUsers = users.filter(
    (u) => !filterRole || u.role === filterRole
  );

  const handleExport = () => {
    const csv = [
      ["Full Name", "Email", "Role"],
      ...filteredUsers.map((u) => [u.fullName, u.email, u.role]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "users.csv";
    link.click();
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-tab-buttons">
        {["overview", "users"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`admin-tab-btn ${activeTab === tab ? "active" : ""}`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div className="admin-metrics-grid">
            <div className="admin-metric-card">
              <h3>Total Users</h3>
              <p>{totalUsers}</p>
            </div>
            <div className="admin-metric-card">
              <h3>Jobs Posted</h3>
              <p>{totalJobs}</p>
            </div>
            <div className="admin-metric-card">
              <h3>Internships</h3>
              <p>{totalInternships}</p>
            </div>
            <div className="admin-metric-card">
              <h3>Applications</h3>
              <p>{totalApplications}</p>
            </div>
          </div>

          <div className="admin-chart-section">
            {/* Bar Chart */}
            <div className="admin-chart-box">
              <h4>Jobs vs Internships vs Applications</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={[
                    {
                      name: "Posted",
                      Jobs: totalJobs,
                      Internships: totalInternships,
                      Applications: totalApplications,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Jobs" fill="#8884d8" />
                  <Bar dataKey="Internships" fill="#82ca9d" />
                  <Bar dataKey="Applications" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Total Distribution Pie Chart */}
            <div className="admin-chart-box">
              <h4>Overall Data Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Users", value: totalUsers },
                      { name: "Jobs", value: totalJobs },
                      { name: "Internships", value: totalInternships },
                      { name: "Applications", value: totalApplications },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <Cell
                        key={`total-cell-${i}`}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === "users" && (
        <div className="admin-user-table-container">
          <div className="admin-user-table-header">
            <h2>User Management</h2>
            <div>
              <select
                onChange={(e) => setFilterRole(e.target.value)}
                value={filterRole}
              >
                <option value="">All Roles</option>
                <option value="student">Students</option>
                <option value="recruiter">Recruiters</option>
                <option value="admin">Admins</option>
              </select>
              <button onClick={handleExport}>Export CSV</button>
            </div>
          </div>

          <div className="admin-user-table-wrapper">
            <table className="admin-user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{`${user.firstName} ${user.middleName} ${user.lastName}`}</td>
                    <td>{user.email}</td>
                    <td className="capitalize">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <p className="admin-no-users">No users found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
