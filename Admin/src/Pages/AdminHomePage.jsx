import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RxDashboard } from "react-icons/rx";
import { FaUsers } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { SlCalender } from "react-icons/sl";
import { LuCalendarCheck } from "react-icons/lu";
import { GrUserAdmin } from "react-icons/gr";
import AdminDashboard from "./AdminDashboard.jsx";
const navItems = [
  { icon: <RxDashboard />, label: "Dashboard", onClick: () => {},
    component: <AdminDashboard /> },
  { icon: <FaUsers />, label: "Patients" },
  { icon: <SlCalender />, label: "Appointments" },
  { icon: <FaUserDoctor />, label: "Doctors" },
  { icon: <LuCalendarCheck />, label: "Queue" },
  { icon: <GrUserAdmin />, label: "Settings" },
];

function AdminHomePage() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Dashboard");

  const handleLogout = () => {
    localStorage.removeItem("Admin_Token");
    navigate("/");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      backgroundColor: "#d0eaec",
    }}>

      {/* Top Navbar */}
      <div style={{
        backgroundColor: "#118388",
        padding: "0 32px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        flexShrink: 0,
        zIndex: 10,
      }}>
        <h2 style={{ color: "#ffffff", margin: 0, fontSize: "20px", fontWeight: 700 }}>
          🏥 MediQueue Admin
        </h2>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "transparent",
            color: "#ffffff",
            border: "2px solid rgba(255,255,255,0.6)",
            borderRadius: "8px",
            padding: "6px 18px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "13px",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = "rgba(255,255,255,0.15)";
            e.target.style.borderColor = "#ffffff";
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.borderColor = "rgba(255,255,255,0.6)";
          }}
        >
          Logout
        </button>
      </div>

      {/* Body: Sidebar + Content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{
          width: "220px",
          backgroundColor: "#ffffff",
          boxShadow: "2px 0 10px rgba(0,0,0,0.07)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 12px",
          gap: "6px",
          flexShrink: 0,
        }}>
          {navItems.map((item) => {
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "11px 16px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: isActive ? "#e8f6f6" : "transparent",
                  color: isActive ? "#118388" : "#555",
                  fontWeight: isActive ? 700 : 500,
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.18s ease",
                  borderLeft: isActive ? "4px solid #118388" : "4px solid transparent",
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "#f0fafa";
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          padding: "36px 32px",
          overflowY: "auto",
        }}>
          {navItems.find(item => item.label === activeNav)?.component || (
            <>
              <h3 style={{ color: "#0f6b6f", marginBottom: "6px", fontSize: "22px", fontWeight: 700 }}>
                {activeNav}
              </h3>
              <p style={{ color: "#777", fontSize: "14px" }}>
                Welcome back, Admin 👋 — you're viewing the <strong>{activeNav}</strong> section.
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default AdminHomePage