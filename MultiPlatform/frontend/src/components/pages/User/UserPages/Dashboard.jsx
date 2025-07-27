import React, { useState, useRef } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import html2canvas from "html2canvas";
import "./userpage.css";

// Fix Leaflet default icon path
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const baseCourseProgressData = [
  { name: "Week 1", Completed: 1, InProgress: 2 },
  { name: "Week 2", Completed: 2, InProgress: 1 },
  { name: "Week 3", Completed: 3, InProgress: 0 },
];

const baseInternshipLocations = [
  {
    id: 1,
    company: "TechNova",
    location: [37.7749, -122.4194],
    category: "Development",
    city: "San Francisco",
  },
  {
    id: 2,
    company: "BrandHive",
    location: [40.7128, -74.006],
    category: "Marketing",
    city: "New York",
  },
  {
    id: 3,
    company: "CodeWorks",
    location: [34.0522, -118.2437],
    category: "Development",
    city: "Los Angeles",
  },
  {
    id: 4,
    company: "DesignPro",
    location: [34.0522, -118.2437],
    category: "Design",
    city: "Los Angeles",
  },
  {
    id: 5,
    company: "InsightCorp",
    location: [41.8781, -87.6298],
    category: "Business",
    city: "Chicago",
  },
  {
    id: 6,
    company: "AdScope",
    location: [39.7392, -104.9903],
    category: "Marketing",
    city: "Denver",
  },
];

const userActivityData = [
  { week: "Week 1", Applications: 3, Interviews: 1, Messages: 2 },
  { week: "Week 2", Applications: 4, Interviews: 2, Messages: 3 },
  { week: "Week 3", Applications: 2, Interviews: 1, Messages: 4 },
];

const userGoals = {
  applications: 10,
  interviews: 5,
  messages: 10,
};

const calculateCategoryDistribution = (internships) => {
  const counts = {};
  internships.forEach(({ category }) => {
    counts[category] = (counts[category] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const userActivityChartRef = useRef(null);
  const mapRef = useRef(null);

  const filteredInternships = baseInternshipLocations.filter((intern) => {
    const categoryMatch =
      selectedCategory === "All" || intern.category === selectedCategory;
    const locationMatch =
      selectedLocation === "All" || intern.city === selectedLocation;
    const searchMatch =
      intern.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      intern.category.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && locationMatch && searchMatch;
  });

  const filteredCategoryDistribution =
    calculateCategoryDistribution(filteredInternships);

  let filteredCourseProgressData = baseCourseProgressData;
  if (selectedCategory !== "All") {
    filteredCourseProgressData = baseCourseProgressData.map((week) => ({
      ...week,
      Completed: week.Completed + (selectedCategory === "Development" ? 1 : 0),
      InProgress:
        week.InProgress - (selectedCategory === "Development" ? 1 : 0),
    }));
  }

  const uniqueCities = Array.from(
    new Set(baseInternshipLocations.map((i) => i.city))
  );

  const exportAsImage = (ref, name) => {
    if (!ref.current) return;
    html2canvas(ref.current, { backgroundColor: null }).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${name}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };
  const exportMarkersCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Company,Category,City,Latitude,Longitude\n";
    filteredInternships.forEach(({ company, category, city, location }) => {
      csvContent += `${company},${category},${city},${location[0]},${location[1]}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "filtered_internship_locations.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportChartCSV = (data, columns, filename) => {
    let csvContent = "data:text/csv;charset=utf-8," + columns.join(",") + "\n";
    data.forEach((row) => {
      const line = columns.map((col) => row[col]).join(",");
      csvContent += line + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentTotals = userActivityData.reduce(
    (acc, cur) => {
      acc.applications += cur.Applications;
      acc.interviews += cur.Interviews;
      acc.messages += cur.Messages;
      return acc;
    },
    { applications: 0, interviews: 0, messages: 0 }
  );

  return (
    <section id="dashboard" className="dashboard-container">
      <h3 className="dashboard-title">Dashboard</h3>
      <p>Courses in progress: 2</p>
      <p>Courses completed: 1</p>
      <button className="dashboard-button">Resume Last Course</button>

      <div className="filters">
        <label>
          Filter by Category:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            {["Development", "Marketing", "Design", "Business"].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label>
          Filter by Location:
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Remote">Remote</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <label>
          Search by Company or Title:
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      <div className="dashboard-charts">
        {/* Line Chart */}
        <div className="chart-box" ref={lineChartRef}>
          <h4>Course Progress (Line Chart)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filteredCourseProgressData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Completed" stroke="#8884d8" />
              <Line type="monotone" dataKey="InProgress" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
          <button onClick={() => exportAsImage(lineChartRef, "line_chart")}>
            Export Line Chart (PNG)
          </button>
          <button
            onClick={() =>
              exportChartCSV(
                filteredCourseProgressData,
                ["name", "Completed", "InProgress"],
                "line_chart_data.csv"
              )
            }
          >
            Export Line Chart Data (CSV)
          </button>
        </div>

        {/* Bar Chart */}
        <div className="chart-box" ref={barChartRef}>
          <h4>Progress Summary (Bar Chart)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={filteredCourseProgressData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Completed" fill="#8884d8" />
              <Bar dataKey="InProgress" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <button onClick={() => exportAsImage(barChartRef, "bar_chart")}>
            Export Bar Chart (PNG)
          </button>
          <button
            onClick={() =>
              exportChartCSV(
                filteredCourseProgressData,
                ["name", "Completed", "InProgress"],
                "bar_chart_data.csv"
              )
            }
          >
            Export Bar Chart Data (CSV)
          </button>
        </div>

        {/* Pie Chart */}
        <div className="chart-box" ref={pieChartRef}>
          <h4>Category Distribution (Pie Chart)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={filteredCategoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {filteredCategoryDistribution.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <button onClick={() => exportAsImage(pieChartRef, "pie_chart")}>
            Export Pie Chart (PNG)
          </button>
          <button
            onClick={() =>
              exportChartCSV(
                filteredCategoryDistribution,
                ["name", "value"],
                "pie_chart_data.csv"
              )
            }
          >
            Export Pie Chart Data (CSV)
          </button>
        </div>

        {/* User Activity Bar Chart */}
        <div className="chart-box" ref={userActivityChartRef}>
          <h4>User Activity & Engagement</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={userActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Applications" fill="#8884d8" />
              <Bar dataKey="Interviews" fill="#ffc658" />
              <Bar dataKey="Messages" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
          <button
            onClick={() =>
              exportAsImage(userActivityChartRef, "activity_chart")
            }
          >
            Export Activity Chart (PNG)
          </button>
          <button
            onClick={() =>
              exportChartCSV(
                userActivityData,
                ["week", "Applications", "Interviews", "Messages"],
                "activity_chart_data.csv"
              )
            }
          >
            Export Activity Chart Data (CSV)
          </button>
        </div>

        {/* Goals & Achievements */}
        <div className="chart-box">
          <h4>Goals & Achievements</h4>
          <ul>
            <li>
              Applications: {currentTotals.applications} /{" "}
              {userGoals.applications}
            </li>
            <li>
              Interviews: {currentTotals.interviews} / {userGoals.interviews}
            </li>
            <li>
              Messages Sent: {currentTotals.messages} / {userGoals.messages}
            </li>
          </ul>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-container" ref={mapRef}>
        <h4>Internship Locations</h4>
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredInternships.map(
            ({ id, company, location, category, city }) => (
              <Marker key={id} position={location}>
                <Popup>
                  <strong>{company}</strong>
                  <br />
                  Category: {category}
                  <br />
                  City: {city}
                </Popup>
              </Marker>
            )
          )}
        </MapContainer>
        <button onClick={exportMarkersCSV} className="export-csv-btn">
          Export Markers Data (CSV)
        </button>
      </div>
    </section>
  );
};

export default Dashboard;
