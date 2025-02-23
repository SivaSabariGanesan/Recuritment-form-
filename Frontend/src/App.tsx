import React, { useEffect, useState } from "react";
import axios from "axios";
import { Routes, Route, Link, useNavigate, useSearchParams } from "react-router-dom";
import FormPage from "./pages/Form";
import Dashboard from "./pages/dashboard";
import ConfirmationPage from "./pages/confirm";
import AdminPortal from "./pages/admin";
import "./App.css"; 

interface User {
  name: string;
  email: string;
  profilePic: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.email.endsWith("@rajalakshmi.edu.in")) {
          setUser(res.data);
        } else {
          setUser(null);
          navigate("/login");
        }
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    axios.get("http://localhost:5000/auth/logout", { withCredentials: true }) // Ensure this endpoint logs out the user
      .then(() => {
        setUser(null); // Clear user state
        navigate("/"); // Redirect to home
      })
      .catch((err) => console.error("Logout failed", err));
  };
  

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="nav-logo">Recruitment Portal</Link>
        </div>
        <div className="nav-right">
          {!user ? (
            <a href="http://localhost:5000/auth/google" className="nav-link">Login with Google</a>
          ) : (
            <>
              <img src={user.profilePic} alt="Profile" className="profile-pic" />
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          )}
        </div>
      </nav>

      {/* Error Message for Unauthorized Access */}
      {error === "unauthorized" && <p className="error-message">Access restricted to @rajalakshmi.edu.in emails</p>}

      {/* Page Content */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/form" element={user ? <FormPage /> : <h2 className="center-content">Please Login</h2>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Routes>
    </div>
  );
};

const HomePage: React.FC = () => (
  <div className="center-content">
    <h1>Welcome to the Recruitment Portal</h1>
    <p>
      This portal helps students apply for recruitment opportunities, track application status, and get important updates.
    </p>
    <div className="instructions">
      <h2>How to Use?</h2>
      <ul>
        <li>✅ <strong>Login</strong> using your **@rajalakshmi.edu.in** email.</li>
        <li>✅ <strong>Fill the form</strong> with your details and submit.</li>
        <li>✅ <strong>Check your application status</strong> in the Dashboard.</li>
        <li>✅ Admins can manage applications in the <strong>Admin Portal</strong>.</li>
      </ul>
    </div>
  </div>
);

const LoginPage: React.FC = () => (
  <div className="login-container">
    <h2>Login Required</h2>
    <p>Please log in using your <strong>@rajalakshmi.edu.in</strong> email to proceed.</p>
    <a href="http://localhost:5000/auth/google">
      <button className="login-btn">Login with Google</button>
    </a>
  </div>
);

export default App;
