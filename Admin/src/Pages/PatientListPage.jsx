import React from 'react'

function PatientListPage() {
    const styles = {
        patient_list: {
            padding: "20px",
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
        },
        patient_list_table: {
            marginTop: "20px",
            overflowX: "auto",
        },
        table: {
            width: "100%",
            borderCollapse: "collapse",
            borderRadius: "8px",
            overflow: "hidden",
        },
        th: {
            backgroundColor: "#118388",
            color: "#fff",
            padding: "12px 16px",
            textAlign: "left",
            fontSize: "14px",
            fontWeight: 600,
        },
        td: {
            padding: "12px 16px",
            borderBottom: "1px solid #e0e0e0",
            fontSize: "14px",
            color: "#444",
        },
        trEven: {
            backgroundColor: "#ffffff",
        },
        trOdd: {
            backgroundColor: "#f9f9f9",
        },
    };

    return (
        <div style={styles.patient_list}>
            <h4 style={{ color: "#0f6b6f", fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
                Patient List
            </h4>
            <p style={{ color: "#777", fontSize: "13px" }}>
                View and manage all registered patients.
            </p>
            <div style={styles.patient_list_table}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>S.No</th>
                            <th style={styles.th}>Patient Name</th>
                            <th style={styles.th}>Patient Email</th>
                            <th style={styles.th}>Patient Phone</th>
                            <th style={styles.th}>Patient Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Data rows will go here */}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PatientListPage