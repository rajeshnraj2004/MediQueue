import React from 'react'
import adminImg from '../assets/Images/admin.png'

function AdminLoginPage() {
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

          <form action="" >
            <div className="input-group" style={{
              marginBottom:"10px"
            }}>
              <input type="text" placeholder="Username" 
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
                style={{
                  width:"200px",
                  height:"40px",
                  borderRadius:"10px",
                  padding:"10px",
                }}/>
            </div>

            <button type="submit" 
              style={{
                width:"200px",
                height:"40px",
                borderRadius:"10px",
                padding:"10px",
                backgroundColor:"#118388ff",
                color:"#ffffff",
                border:"none",
                cursor:"pointer",
              }}>
              Login
            </button>
          </form>
          
        </div> 

      </div>

    </div>
  )
}

export default AdminLoginPage