import React from "react";
import { Link } from "react-router-dom";
import {
  FaUserGraduate,
  FaBriefcase,
  FaUserShield,
  FaReact,
  FaCode,
  FaDatabase,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import "./Home.css";

import heroDemo from "../../assets/videos/hero-demo.mp4";
import studentGif from "../../assets/gifs/student.gif";
import recruiterGif from "../../assets/gifs/recruiter.gif";
import adminGif from "../../assets/gifs/admin.gif";

const roles = [
  {
    icon: <FaUserGraduate size={35} color="#667eea" />,
    title: "Students",
    gif: studentGif,
    description:
      "Manage profiles, upload resumes, apply for jobs & track progress.",
  },
  {
    icon: <FaBriefcase size={32} color="#48bb78" />,
    title: "Recruiters",
    gif: recruiterGif,
    description: "Post roles, review applications, and shortlist candidates.",
  },
  {
    icon: <FaUserShield size={32} color="#f6ad55" />,
    title: "Admins",
    gif: adminGif,
    description: "Monitor users, moderate content, and view analytics.",
  },
];

const features = [
  {
    icon: "🔐",
    title: "Secure Login",
    description: "Role-based login for students, recruiters & admins.",
  },
  {
    icon: "📄",
    title: "Resume Upload",
    description: "Upload via Cloudinary with preview & format checks.",
  },
  {
    icon: "📬",
    title: "Instant Alerts",
    description: "Get notified when applications are viewed/updated.",
  },
  {
    icon: "📊",
    title: "Admin Analytics",
    description: "Dashboards for usage & performance tracking.",
  },
  {
    icon: "🗂️",
    title: "Filters & Bookmarks",
    description: "Search jobs, save favorites and apply easily.",
  },
];

const techStack = [
  { icon: <FaReact size={32} />, label: "React.js / JSP" },
  { icon: <FaCode size={32} />, label: "Java + Spring Boot" },
  { icon: <FaDatabase size={32} />, label: "MySQL DB" },
];

const workflow = [
  "Requirement Gathering",
  "ER Diagram & Design",
  "Backend API",
  "UI/UX Integration",
  "Testing",
  "Deployment",
];

function Home() {
  return (
    <div className="home-wrapper" id="home">
      <Particles
        id="tsparticles"
        options={{
          fullScreen: { enable: true, zIndex: -1 },
          detectRetina: true,
          particles: {
            number: { value: 80 },
            color: { value: "#48bb78" },
            size: { value: 3 },
            move: { speed: 1.2, outModes: "bounce" },
            opacity: { value: 0.4 },
            links: { enable: true, color: "#667eea", distance: 120 },
          },
        }}
      />

      <motion.nav
        className="home-navbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="logo">MultiConnect</h1>
        <div className="home-nav-links">
          <Link to="/">Home</Link>
          <a href="#roles">Roles</a>
          <a href="#features">Features</a>
          <Link to="/register" className="nav-cta">
            Get Started
          </Link>
        </div>
      </motion.nav>

      <motion.section
        className="home-hero glass-bg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <h2>Connecting Talent with Opportunity</h2>
        <p>
          MultiConnect is the complete portal for internships and jobs – built
          for students, recruiters, and admins.
        </p>
        <video
          src={heroDemo}
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
        />
      </motion.section>

      <section id="roles" className="home-roles">
        <h3>Who Is It For?</h3>
        <motion.div
          className="home-feature-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {roles.map((role) => (
            <motion.div
              key={role.title}
              className="feature-card glass-bg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {role.icon}
              <h4>{role.title}</h4>
              <img
                src={role.gif}
                alt={`${role.title} demo`}
                className="role-gif"
              />
              <p>{role.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section id="features" className="home-features">
        <h3>Platform Features</h3>
        <div className="home-feature-grid">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-card glass-bg"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="feature-icon">{f.icon}</span>
              <h4>{f.title}</h4>
              <p>{f.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <div className="getstart">
        <motion.section
          id="get-started"
          className="home-cta-section glass-bg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3>Ready to Begin?</h3>
          <p>
            Students build careers. Recruiters find talent. Admins manage it
            all.
          </p>
          <Link to="/register" className="home-cta-button">
            Join MultiConnect
          </Link>
        </motion.section>
      </div>
      <footer className="home-footer">
        <p>&copy; 2025 MultiConnect. All rights reserved.</p>
        <div className="footer-links">
          <a href="#roles">About</a>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;
