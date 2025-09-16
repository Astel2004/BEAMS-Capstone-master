import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import "../styles/MyProfile.css"; // Add specific styles for My Profile
import profileImage from "../assets/profile-user.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const MyProfileComp = () => {
  const [profile, setProfile] = useState(null); // State to store the profile details
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({}); // State to store form data
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/profile"); // Replace with your API endpoint
        const data = await response.json();
        setProfile(data); // Update state with fetched data
        setFormData(data); // Initialize form data with profile data
      } catch (error) {
        console.error("Error fetching profile details:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing tokens)
    alert("You have been logged out.");
    navigate("/login"); // Redirect to the login page
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile); // Update the profile with the saved data
        setIsEditing(false); // Exit edit mode
        console.log("Profile updated successfully!");
      } else {
        console.error("Error updating profile.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (!profile) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="icon">
            <img src={profileImage} alt="Profile" />
          </div>
          <div className="profile-icon">EMPLOYEE</div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => navigate("/employee-dashboard")}>Dashboard</li>
            <li onClick={() => navigate("/my-profile")}>My Profile</li>
            <li onClick={() => navigate("/my-documents")}>Personal Documents</li>
            <li onClick={() => navigate("/employee-increment")}>
              Step Increment Status
            </li>
            <li onClick={handleLogout}>Log out</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="my-profile-content">
        <header className="dashboard-header">
          <div className="logo">
            <h2>BEAMS</h2>
          </div>
          <div className="header-icons">
            <span className="icon">📧</span>
            <span className="icon">🔔</span>
            <div className="profile">
              <img src={profileImage} alt="Profile" />
              <span>ADMIN</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>My Profile</h2>
        </div>

        {/* Profile Content */}
        <div className="my-profile">
          <div className="profile-header">
            <div className="profile-image">
              <img src={profileImage} alt="Profile" />
            </div>
            <div className="profile-details">
              {isEditing ? (
                <>
                  <label>
                    Full Name:
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Position:
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Department:
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Status:
                    <input
                      type="text"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    />
                  </label>
                </>
              ) : (
                <>
                  <h3>Full Name: {profile.name}</h3>
                  <p>Position: {profile.position}</p>
                  <p>Department: {profile.department}</p>
                  <p>Status: {profile.status}</p>
                </>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="profile-actions">
            {isEditing ? (
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
            ) : (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyProfileComp;