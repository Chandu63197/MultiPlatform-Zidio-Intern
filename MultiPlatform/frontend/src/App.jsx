import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/pages/PreHome";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import UserHomePage from "./components/pages/User/UserHomePage";
import AdminHome from "./components/pages/AdminHome.jsx/AdminHome";
import RecruterHome from "./components/pages/Recruter/RecruterHome";
import ProfilePage from "./components/pages/User/UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userhome" element={<UserHomePage />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/recruterhome/*" element={<RecruterHome />} />
      </Routes>
    </Router>
  );
}

export default App;
