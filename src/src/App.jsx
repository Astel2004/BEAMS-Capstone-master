import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  return (
    <div className="home-page">
      <h1>WELCOME</h1>
      <h1>BOAC EMPLOYEE AND ADMINISTRATION MANAGEMENT SYSTEM</h1>
      <button onClick={() => navigate('/login')}>Go to Log In</button> {/* Navigate back to Log-In */}
    </div>
  );
}

export default App;