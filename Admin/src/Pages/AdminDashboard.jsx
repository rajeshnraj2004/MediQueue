import React from 'react'

function AdminDashboard() {
    const styles = {
        dashboard_container:{
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        },
        stats_cards: {
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginTop: "20px",
        },
        stats_card: {
            padding: "20px",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        },
    };
    return (
        <div style={styles.dashboard_container}>
            <h3 style={{ color: "#0f6b6f", marginBottom: "6px", fontSize: "22px", fontWeight: 700 }}>
                Dashboard
            </h3>
            <p style={{ color: "#777", fontSize: "14px" }}>
                Welcome back, Admin 👋 — here's your dashboard overview.
            </p>
            <div style={styles.stats_cards}>
                <div style={styles.stats_card}>
                    <h4>Total Doctors</h4>
                    <p></p>
                </div>
                <div style={styles.stats_card}>
                    <h4>Total Patients</h4>
                    <p></p>
                </div>
                <div style={styles.stats_card}>
                    <h4>Total Appointments</h4>
                    <p></p>
                </div>
                <div style={styles.stats_card}>
                    <h4>Total Queues</h4>
                    <p></p>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard