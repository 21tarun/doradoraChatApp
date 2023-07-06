import React from 'react'
import "./Signup.css"
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";


function Signup() {
    const  navigate =useNavigate()
    const [userName,setUserName]= React.useState("")
    const [email,setEmail]=React.useState("")
    const [password,setPassword]= React.useState("")

    const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };

    const validateForm = () => {
      
      if (userName === "") {
        toast.error("userName is required.", toastOptions);
        return false;
      } else if (email === "") {
        toast.error("email is required.", toastOptions);
        return false;
      }else if(password===""){
        toast.error("password is required.", toastOptions);
        return false
      }
      return true;
    };


    const handleSubmit = async (event) => {
      event.preventDefault();
      if (validateForm()) {
        
        const { data } = await axios.post("http://localhost:4000"+"/signup", {
          userName,
          email,
          password,
        });
        console.log(data)
        if (data.status == false) {
          toast.error(data.message, toastOptions);
        }
        if (data.status == true) {

          toast.info(data.message, toastOptions);
          setTimeout(() => {
            navigate("/")
          }, 2000);
  
          
        }
      }
    };

  return (
    <section className="login-section">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card">
              <div className="row g-0">
                <div className="col-md-6 col-lg-5 d-none d-md-block">
                  <img
                    src="https://i.pinimg.com/736x/ea/4c/7e/ea4c7e71fbcdc7d776e7163f337ec4fe--dora-the-explorer-cartoon-characters.jpg"
                    alt="login form"
                    className="card-img"
                  />
                </div>
                <div className="col-md-6 col-lg-7 d-flex align-items-center">
                  <div className="card-body p-4 p-lg-5 text-black">
                    <div>
                      <div className="logo-container">
                        <i className="fas fa-cubes fa-2x logo-icon"></i>
                        <span className="h1 fw-bold mb-0 logo-text">Dora Dora</span>
                      </div>

                      <h5 className="fw-normal mb-3 pb-3 form-title">Register your account</h5>

                      <div className="form-outline mb-4 form-input">
                        <input type="text" id="form2Example17" placeholder='User Name' className="form-control form-control-lg" onChange={(e)=>setUserName(e.target.value)}/>
                        
                      </div>

                      <div className="form-outline mb-4 form-input">
                        <input type="email" id="form2Example17" placeholder='Email Id' className="form-control form-control-lg" onChange={(e)=>setEmail(e.target.value)} />
                        
                      </div>

                      <div className="form-outline mb-4 form-input">
                        <input type="password" id="form2Example27" className="form-control form-control-lg" placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>

                      </div>

                      <div className="pt-1 mb-4 login-button">
                        <button className="btn btn-dark btn-lg btn-block" type="button" onClick={(e)=>handleSubmit(e)}>Register</button>
                      </div>

                     
                      <p className="mb-5 pb-lg-2 text-muted">
                        Already have an account? <a onClick={()=>navigate('/')} style={{cursor:"pointer",color:"#669900"}} className="register-link">Login here</a>
                      </p>
  
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  )
}

export default Signup