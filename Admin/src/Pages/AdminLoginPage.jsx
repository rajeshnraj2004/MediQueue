import React, { useState, useEffect } from 'react'
import adminImg from '../assets/Images/admin.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

function AdminLoginPage() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, skip the login page
  useEffect(() => {
    if (localStorage.getItem("Admin_Token")) {
      navigate("/AdminHomePage");
    }
  }, [navigate]);

  const adminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        email: adminEmail,
        password: adminPassword,
      });
      localStorage.setItem("Admin_Token", response.data.token);
      navigate("/AdminHomePage");
    } catch (error) {
      console.log("Error while logging in", error);
      const msg = error.response?.data?.message || "Invalid credentials. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  }
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div style={{
      backgroundColor: "#d0eaecff",
      minHeight: "100vh",
      width: "100%",
      margin: 0,
      padding: "20px",
      boxSizing: "border-box"
    }}>

    

      { /* Login Container */ }
      <div className="login-container"
      style={{
        width:"850px",
        height:"500px",
        backgroundColor:"#ffffff",
        borderRadius:"10px",
        boxSizing:"border-box",
        margin:"50px auto 50px auto",
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        flexDirection:"row",
        padding:"20px",
        boxShadow:"0 10px 20px rgba(0,0,0,0.2)",
      }}  
      > 
      
      
        <div className="hero">
          <img src={adminImg} alt="Admin" srcSet=""
            style={{
              width:400,
              height:250,
            }}
          />
        </div>

        <div className="login-right" style={{
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          flexDirection:"column",
          boxShadow:"0 10px 20px rgba(0,0,0,0.2)",
          width:250,
          height:300,
          borderRadius:"10px",
          marginRight:"10px"
        }}>
          <h3 style={{
            marginBottom:"20px",
            color:"#118388ff",
          }}>Admin Login</h3>

          <form onSubmit={adminLogin}>
            <div className="input-group" style={{
              marginBottom:"10px"
            }}>
              <input type="text" placeholder="Username"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                style={{
                  width:"200px",
                  height:"40px",
                  borderRadius:"10px",
                  padding:"10px",
                }}/>
            </div>

            <div className="input-group" style={{
              marginBottom:"10px"
            }}>
              <input type="password" placeholder="Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                style={{
                  width:"200px",
                  height:"40px",
                  borderRadius:"10px",
                  padding:"10px",
                }}/>
            </div>

            <button type="submit" disabled={loading}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                width:"200px",
                height:"40px",
                borderRadius:"10px",
                padding:"10px",
                backgroundColor: isHovered ? "#ffffff" : "#118388",
                color: isHovered ? "#118388" : "#ffffff",
                border:"2px solid #118388",
                cursor:"pointer",
                transform: isHovered ? "scale(1.04)" : "scale(1)",
                transition:"all 0.25s ease",
                boxShadow: isHovered ? "0 4px 12px rgba(17,131,136,0.35)" : "none",
              }}>
              {loading ? "Logging in..." : "Login"}
            </button>

            {errorMsg && (
              <p style={{
                color: "#d9534f",
                fontSize: "12px",
                marginTop: "10px",
                textAlign: "center",
                maxWidth: "200px",
              }}>{errorMsg}</p>
            )}
          </form>
          
        </div> 

      </div>

    </div>
  )
}

export default AdminLoginPage