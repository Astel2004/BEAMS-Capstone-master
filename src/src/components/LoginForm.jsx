import React, { useState } from "react";
import "../styles/Form.css";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Debug: See what role is returned
        alert("Login successful!");

        if (data.role === "HR") {
          navigate("/hr-dashboard");
        } else if (data.role === "Employee") {
          navigate("/employee-dashboard");
        } else {
          navigate("/");
        }
      } else {
        const errorData = await response.json();
        alert("Login failed: " + (errorData.message || errorData.error));
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <div className="form-wrapper">
        <div className="form-right">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="login-button">LOG IN</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;