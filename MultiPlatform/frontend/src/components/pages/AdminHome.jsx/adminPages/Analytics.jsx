import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faDownload,
  faMoon,
  faSun,
  faLightbulb,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { Bar, Pie, Line, Doughnut } from "react-chartjs-2";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "./adminpage.css";
import Chart from "chart.js/auto";
import axios from "axios";
import * as XLSX from "xlsx";

const Analytics = () => {
  const [theme, setTheme] = useState("light");
  const [dateRange, setDateRange] = useState([]);
  const [userType, setUserType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState("Connecting...");
  const [showInsights, setShowInsights] = useState(false);

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

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
      setApiStatus("Connected");
    } catch (error) {
      console.error("API error:", error);
      setApiStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const toggleInsights = () => setShowInsights((prev) => !prev);

  const filterByDate = (data) => {
    if (dateRange.length === 2) {
      const [start, end] = dateRange;
      return data.filter((item) => {
        if (!item.createdAt) return false;
        const created = new Date(item.createdAt);
        return !isNaN(created) && created >= start && created <= end;
      });
    }
    return data;
  };

  const filteredUsers = filterByDate(users);
  const filteredJobs = filterByDate(jobs);
  const filteredInternships = filterByDate(internships);
  const filteredApplications = filterByDate(applications);

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Type: "Total Users", Count: users.length },
      { Type: "Jobs Posted", Count: jobs.length },
      { Type: "Internships Posted", Count: internships.length },
      { Type: "Applications Submitted", Count: applications.length },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analytics");
    XLSX.writeFile(wb, "analytics_data.xlsx");
  };

  const userCounts = {
    student: users.filter((u) => u.role === "STUDENT").length,
    employer: users.filter((u) => u.role === "EMPLOYER").length,
    admin: users.filter((u) => u.role === "ADMIN").length,
  };

  const applicationsByDate = () => {
    const map = {};
    filteredApplications.forEach((app) => {
      if (app.createdAt) {
        const createdDate = new Date(app.createdAt);
        if (!isNaN(createdDate)) {
          const date = createdDate.toISOString().slice(0, 10);
          map[date] = (map[date] || 0) + 1;
        }
      }
    });
    return map;
  };

  const growthRate = "+12%";
  const aiInsights = [
    {
      title: "User Growth Spike",
      detail: "User registrations increased by 22% in the past 30 days.",
    },
    {
      title: "Low Employer Activity",
      detail: "Employer engagement dropped 8% this month.",
    },
    {
      title: "Prediction",
      detail: `Estimated ${
        users.length + 300
      } users by next month at current growth.`,
    },
  ];

  const appsDateMap = applicationsByDate();
  const dateLabels = Object.keys(appsDateMap).sort();

  return (
    <motion.div
      className={`page-container ${theme}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className="analytics-header">
        <h1>
          <FontAwesomeIcon icon={faChartLine} /> Analytics
        </h1>
        <div className="header-actions">
          <FontAwesomeIcon
            icon={theme === "dark" ? faSun : faMoon}
            onClick={toggleTheme}
            title="Toggle Theme"
          />
          <FontAwesomeIcon
            icon={faFileExcel}
            onClick={exportExcel}
            title="Export to Excel"
          />
          <FontAwesomeIcon
            icon={faLightbulb}
            onClick={toggleInsights}
            title="Toggle AI Insights"
          />
        </div>
      </header>

      <p>Platform statistics and trends:</p>

      <div className="filters">
        <DateRangePicker
          onChange={setDateRange}
          placeholder="Select Date Range"
        />
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="all">All Users</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
        </select>
        <span className={`api-status ${apiStatus.toLowerCase()}`}>
          {apiStatus}
        </span>
      </div>

      {loading ? (
        <div className="skeleton">Loading charts...</div>
      ) : (
        <>
          <div className="metrics">
            <div className="metric">
              Total Users: {users.length}
              <span className="growth">{growthRate}</span>
            </div>
            <div className="metric">Job Posts: {jobs.length}</div>
            <div className="metric">Internships: {internships.length}</div>
            <div className="metric">Applications: {applications.length}</div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3>Jobs, Internships & Applications (Pie Chart)</h3>
              <Pie
                data={{
                  labels: ["Jobs", "Internships", "Applications"],
                  datasets: [
                    {
                      data: [
                        jobs.length,
                        internships.length,
                        applications.length,
                      ],
                      backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                    },
                  ],
                }}
              />
            </div>

            <div className="chart-card">
              <h3>Jobs, Internships & Applications (Bar Chart)</h3>
              <Bar
                data={{
                  labels: ["Jobs", "Internships", "Applications"],
                  datasets: [
                    {
                      label: "Total Count",
                      data: [
                        jobs.length,
                        internships.length,
                        applications.length,
                      ],
                      backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>

            <div className="chart-card">
              <h3>Engagement KPI</h3>
              <Doughnut
                data={{
                  labels: ["Completed", "Pending", "Dropped"],
                  datasets: [
                    {
                      data: [68, 22, 10],
                      backgroundColor: ["#00D084", "#FFA500", "#FF4D4D"],
                    },
                  ],
                }}
              />
            </div>
          </div>

          {showInsights && (
            <div className="insight-cards">
              <h3>AI Insights</h3>
              <div className="insights-grid">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="insight-card">
                    <h4>{insight.title}</h4>
                    <p>{insight.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Analytics;
