import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase"; 
import "../CSS/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
const handleHome = () =>{
    navigate("/");
}
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  // Conditionally render logout button based on current route
  const showLogoutButton = !(location.pathname === "/login" || location.pathname === "/register");

  return (
    <nav className="navbar">
      <h2 className="navbar-title" onClick={handleHome}>Student Management System</h2>
      {showLogoutButton && (
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
};

export default Navbar;
