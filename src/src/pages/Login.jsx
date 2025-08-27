// filepath: c:\Users\john david\Documents\BEAMS\my-app\src\pages\Login.jsx
import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import FooterLink from "../components/FooterLink";

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <LoginForm />

        {/* Left side */}
      <div className="form-left-background">
      <div className="bg-texts">
          <h1>WELCOME</h1>
          <p>BOAC EMPLOYEE <br /> AND ADMINISTRATION <br /> MANAGEMENT <br /> SYSTEM</p>
        </div>  
      </div>
      </div>
    </div>
  );
};

export default Login;