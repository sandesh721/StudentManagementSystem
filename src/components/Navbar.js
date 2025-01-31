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
      navigate("/login"); 
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  
  const showLogoutButton = !(location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/forgotpassword");

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
