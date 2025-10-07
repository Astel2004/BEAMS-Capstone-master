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
        console.log("Login response:", data);

        // Save important info in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("beamsId", data.beamsId);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Set userType and employeeId for notification system
        if (data.role === "Employee") {
          localStorage.setItem("userType", "employee");
          localStorage.setItem("employeeId", data.user._id); // MongoDB ObjectId
          navigate("/employee-dashboard");
        } else if (data.role === "HR Officer" || data.role === "HR") {
          localStorage.setItem("userType", "hr");
          localStorage.setItem("hrId", data.user._id); // Optional for HR
          navigate("/hr-dashboard");
        } else {
          localStorage.setItem("userType", "guest");
          navigate("/");
        }

        alert("Login successful!");
      } else {
        const errorData = await response.json();
        alert("Login failed: " + (errorData.message || errorData.error));
      }
    } catch (error) {
      console.error("Login error:", error);
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
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="login-button">
              LOG IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
