import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      toast.warning("⚠️ Please select a role.", {
        className: "custom-toast-warning",
        icon: "⚠️",
        style: {
          backgroundColor: "#fefcbf",
          color: "#744210",
          fontWeight: "bold",
        },
      });
      return;
    }

    let loginUrl = "";
    const payload = { email, password };

    if (role === "user") {
      loginUrl = "http://localhost:8080/api/users/loginUser";
    } else if (role === "admin") {
      loginUrl = "http://localhost:8080/api/admins/login";
    } else if (role === "recruiter") {
      loginUrl = "http://localhost:8080/api/recruiters/login";
    }

    try {
      const response = await axios.post(loginUrl, payload);

      if (role === "user") {
        const { token, user } = response.data;
        if (token && user) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          const fullName = `${user.firstName} ${user.lastName}`;
          toast.success(" Login successful!", {
            className: "custom-toast-success",
            icon: "🔐",
            style: {
              backgroundColor: "#e6fffa",
              color: "#2c7a7b",
              fontWeight: "bold",
            },
          });
          setTimeout(() => {
            navigate("/userhome", { state: { username: fullName } });
          }, 1500);
        } else {
          toast.error("Invalid login response.");
        }
      } else {
        const { token, message } = response.data;

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          toast.success(message || " Login successful!", {
            className: "custom-toast-success",
            icon: "🔓",
            style: {
              backgroundColor: "#e6fffa",
              color: "#2c7a7b",
              fontWeight: "bold",
            },
          });

          setTimeout(() => {
            if (role === "admin") {
              navigate("/adminhome");
            } else if (role === "recruiter") {
              navigate("/recruterhome");
            }
          }, 1500);
        } else {
          toast.error(" Invalid email or password.", {
            className: "custom-toast-error",
            icon: "🚫",
            style: {
              backgroundColor: "#fff5f5",
              color: "#c53030",
              fontWeight: "bold",
            },
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.", {
        className: "custom-toast-error",
        icon: "❌",
        style: {
          backgroundColor: "#fff5f5",
          color: "#c53030",
          fontWeight: "bold",
        },
      });
    }
  };

  return (
    <div className="login-container">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="select-wrapper">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className={!role ? "placeholder-option" : ""}
          >
            <option value="" disabled hidden>
              Login as a
            </option>
            <option value="user">User</option>
            <option value="recruiter">Recruiter</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit">Login</button>
      </form>

      <div className="reg">
        <Link to="/register">Don't have an account? Register here</Link>
      </div>
    </div>
  );
}

export default Login;
