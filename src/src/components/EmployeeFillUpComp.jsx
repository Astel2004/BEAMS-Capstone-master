import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/EmployeeFillUp.css"; // Add specific styles for the fill-up form

const EmployeeFillUpComp = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    position: "Accountant",
    department: "Finance",
    step: "Step 1",
    status: "Active",
    dateJoined: "",
  });

  const navigate = useNavigate(); // Initialize useNavigate

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Employee added successfully!");
        setFormData({
          id: "",
          name: "",
          email: "",
          password: "",
          position: "Accountant",
          department: "Finance",
          step: "Step 1",
          status: "Active",
          dateJoined: "",
        });
        navigate("/login"); // Redirect to the login form
      } else {
        alert("Failed to add employee. Please try again.");
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="fill-up-container">
      {/* Fill-Up Form */}
      <form className="employee-form" onSubmit={handleSubmit}>
        <h2>Employee Fill-Up Form</h2>
        <label>
          Employee ID:
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Full Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Position:
          <select
            name="position"
            value={formData.position}
            onChange={handleInputChange}
          >
            <option value="Accountant">Accountant</option>
            <option value="HR Staff">HR Staff</option>
            <option value="IT Technician">IT Technician</option>
            <option value="Staff">Staff</option>
          </select>
        </label>
        <label>
          Department:
          <select
            name="department"
            value={formData.department}
            onChange={handleInputChange}
          >
            <option value="Finance">Finance</option>
            <option value="HR Dept">HR Dept</option>
            <option value="IT Dept">IT Dept</option>
          </select>
        </label>
        <label>
          Step:
          <select
            name="step"
            value={formData.step}
            onChange={handleInputChange}
          >
            <option value="Step 1">Step 1</option>
            <option value="Step 2">Step 2</option>
            <option value="Step 3">Step 3</option>
            <option value="Step 4">Step 4</option>
            <option value="Step 5">Step 5</option>
          </select>
        </label>
        <label>
          Status:
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <label>
          Date Joined:
          <input
            type="date"
            name="dateJoined"
            value={formData.dateJoined}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default EmployeeFillUpComp;