import React from 'react'
import { Routes, Route} from 'react-router-dom'
import AdminLoginPage from './Pages/AdminLoginPage'
export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminLoginPage />} />
      </Routes>
    </div>
  )
}
