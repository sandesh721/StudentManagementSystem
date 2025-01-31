import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/home.css"
const Home = () =>{
    const navigate = useNavigate(); 
    
      const handleLoginRedirect = () => {
        navigate("/login"); 
      };
      const handleRegisterRedirect = () => {
        navigate("/register"); 
      };
    return(
        <div className="home_container">
          <div className="home_content">

            <h1>Welcome to Student Management System</h1>
            <div className="btn">
                <span onClick={handleLoginRedirect}>Login</span>
                <span onClick={handleRegisterRedirect}>Register</span>
            </div>
          </div>
        </div>
    )
};
export default Home;