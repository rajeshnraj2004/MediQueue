import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLoginPage from './Pages/AdminLoginPage'
import AdminHomePage from './Pages/AdminHomePage'

// Redirects to login if no token is found
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("Admin_Token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
        <Route
          path="/AdminHomePage"
          element={
            <ProtectedRoute>
              <AdminHomePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}
