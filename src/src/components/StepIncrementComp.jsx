import React, { useState, useEffect, useRef } from "react"; 
import "../styles/Dashboard.css";
import "../styles/StepIncrement.css";
import profileImage from "../assets/profile-user.png";
import Image from "../assets/user.png";
import { useNavigate } from "react-router-dom";
import NotificationPopup from "./NotificationPopUp";

const StepIncrementComp = () => {
  const [eligibleEmployees, setEligibleEmployees] = useState([]);
  const [sortBy, setSortBy] = useState("lastname");
  const [userAccounts, setUserAccounts] = useState([]);
  const [showNoAccountModal, setShowNoAccountModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEligibleListModal, setShowEligibleListModal] = useState(false);
  const [loadingEligibleList, setLoadingEligibleList] = useState(false);
  const [eligibleListData, setEligibleListData] = useState([]);

  const navigate = useNavigate();

  // ✅ Added refs for synchronized scrolling
  const thYearListRef = useRef(null);
  const tdYearListRef = useRef(null);

  // ✅ Added useEffect to sync scroll positions between head and body
  useEffect(() => {
    const head = thYearListRef.current;
    const body = tdYearListRef.current;

    if (!head || !body) return;

    const handleHeadScroll = () => {
      body.scrollLeft = head.scrollLeft;
    };

    const handleBodyScroll = () => {
      head.scrollLeft = body.scrollLeft;
    };

    head.addEventListener("scroll", handleHeadScroll);
    body.addEventListener("scroll", handleBodyScroll);

    return () => {
      head.removeEventListener("scroll", handleHeadScroll);
      body.removeEventListener("scroll", handleBodyScroll);
    };
  }, []); // runs once after mount

  useEffect(() => {
    const fetchEligibleEmployees = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/employees");
        const data = await response.json();
        const eligible = data.filter((employee) => {
          const currentStep = parseInt(employee.step.replace("Step ", ""));
          return currentStep < 5;
        });
        const sorted = eligible.sort((a, b) => {
          const aName = a.surname || a.name || "";
          const bName = b.surname || b.name || "";
          return aName.localeCompare(bName);
        });
        setEligibleEmployees(sorted);
      } catch (error) {
        console.error("Error fetching eligible employees:", error);
      }
    };
    fetchEligibleEmployees();
  }, []);

  useEffect(() => {
    const fetchUserAccounts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/list");
        const data = await response.json();
        setUserAccounts(data);
      } catch (error) {
        console.error("Error fetching user accounts:", error);
      }
    };
    fetchUserAccounts();
  }, []);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    if (value === "lastname") {
      setEligibleEmployees((prev) =>
        [...prev].sort((a, b) => {
          const aName = a.surname || a.name || "";
          const bName = b.surname || b.name || "";
          return aName.localeCompare(bName);
        })
      );
    }
  };

  const handleLogout = () => {
    alert("You have been logged out.");
    navigate("/login");
  };

  const handleSendNotification = (employeeId) => {
    const hasAccount = userAccounts.some(
      (user) => user.employeeId === employeeId
    );
    if (!hasAccount) {
      setShowNoAccountModal(true);
      return;
    }
    alert("Notification sent!");
  };

  const calculateStep = (dateJoined) => {
    if (!dateJoined) return 1;
    const joinDate = new Date(dateJoined);
    const now = new Date();
    const diffMonths = Math.floor(
      (now - joinDate) / (1000 * 60 * 60 * 24 * 30.44)
    );
    return Math.floor(diffMonths / 3) + 1;
  };

  const handleGenerateEligibleList = () => {
    setLoadingEligibleList(true);
    setShowEligibleListModal(true);
    setTimeout(() => {
      setEligibleListData([
        {
          id: "EMP001",
          name: "John Doe",
          salaryGrade: "SG 11",
          currentStep: "Step 2",
          nextStep: "Step 3",
          dueDate: "2025-12-01",
        },
        {
          id: "EMP002",
          name: "Jane Smith",
          salaryGrade: "SG 12",
          currentStep: "Step 3",
          nextStep: "Step 4",
          dueDate: "2025-11-15",
        },
        {
          id: "EMP003",
          name: "Mark Lee",
          salaryGrade: "SG 10",
          currentStep: "Step 1",
          nextStep: "Step 2",
          dueDate: "2025-10-20",
        },
      ]);
      setLoadingEligibleList(false);
    }, 3000);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="icon">
            <img src={profileImage} alt="Profile" />
          </div>
          <div className="profile-icon">HR OFFICER</div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li onClick={() => navigate("/hr-dashboard")}>Dashboard</li>
            <li onClick={() => navigate("/employee-records")}>
              Employee Records
            </li>
            <li onClick={() => navigate("/step-increment")}>
              Step Increment Tracker
            </li>
            <li onClick={() => navigate("/reports")}>Reports & Analytics</li>
            <li onClick={() => navigate("/users")}>User Management</li>
            <li onClick={handleLogout}>Log out</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <div className="logo">
            <h2>BEAMS</h2>
          </div>
          <div className="header-icons">
            <span className="icon">📧</span>
            <span
              className="icon"
              style={{ cursor: "pointer" }}
              onClick={() => setShowNotifications(true)}
            >
              🔔
            </span>
            <div className="profile">
              <img src={Image} alt="Profile" />
              <span>HR OFFICER</span>
            </div>
          </div>
        </header>

        <div className="dashboard-title">
          <h2>Step Increment Tracker</h2>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <button
            className="generate-list-btn"
            style={{
              padding: "10px 22px",
              background: "#1976d2",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={handleGenerateEligibleList}
          >
            Generate List of Eligible Employees
          </button>
        </div>

        {/* ✅ Step Increment Table with synced scrollbars */}
        <div className="step-increment-table">
          <div className="table-head">
            <div className="th th-name">
              Name of Position and<br /> Name of Incumbent
            </div>
            <div className="th th-sg">SG</div>
            <div className="th th-appointment-date">
              Date of<br /> Appointment
            </div>
            <div className="th th-year">
              <div className="th-year-label">Year</div>
              {/* ✅ Added ref to header year list */}
              <div className="th-year-list" ref={thYearListRef}>
                {Array.from({ length: 25 }, (_, i) => {
                  const year = 2006 + i;
                  return (
                    <p key={year} className={`year th-year-${year}`}>
                      {year}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="table-body">
            <div className="td td-name">
              <span className="position-label">Municipal Mayor</span>
              <br />
              <span className="name">Armi Dela Cruz Carrion</span>
            </div>
            <div className="td td-sg">27</div>
            <div className="td td-appointment-date">July-19, 2019</div>
            <div className="td td-year">
              {/* ✅ Added ref to body year list */}
              <div className="td-year-list" ref={tdYearListRef}>
                {Array.from({ length: 25 }, (_, i) => {
                  const year = 2006 + i;
                  let step = "";
                  if (year === 2019) step = "Step 1";
                  if (year === 2022) step = "Step 2";
                  if (year === 2025) step = "Step 3";
                  return (
                    <p key={year} className={`year td-year-${year}`}>
                      {step}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showNoAccountModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>This employee has no BEAMS account yet.</p>
              <div className="modal-actions">
                <button
                  className="modal-btn"
                  onClick={() => setShowNoAccountModal(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {showEligibleListModal && (
          <div className="modal-overlay">
            <div
              className="modal-content"
              style={{ minWidth: "420px", maxWidth: "90vw" }}
            >
              <h3>Eligible Employees</h3>
              {loadingEligibleList ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <span style={{ fontSize: "1.2em", color: "#1976d2" }}>
                    Loading...
                  </span>
                </div>
              ) : (
                <table
                  style={{
                    width: "100%",
                    marginTop: "12px",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr>
                      <th>Employee Id</th>
                      <th>Full Name</th>
                      <th>Salary Grade</th>
                      <th>Current Step</th>
                      <th>Next Step</th>
                      <th>Due Date Next Step</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eligibleListData.length > 0 ? (
                      eligibleListData.map((emp) => (
                        <tr key={emp.id}>
                          <td>{emp.id}</td>
                          <td>{emp.name}</td>
                          <td>{emp.salaryGrade}</td>
                          <td>{emp.currentStep}</td>
                          <td>{emp.nextStep}</td>
                          <td>{emp.dueDate}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                          No eligible employees found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
              <div className="modal-actions" style={{ marginTop: "18px" }}>
                <button
                  className="modal-btn"
                  onClick={() => setShowEligibleListModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <NotificationPopup
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
          userType="hr"
        />
      </main>
    </div>
  );
};

export default StepIncrementComp;
