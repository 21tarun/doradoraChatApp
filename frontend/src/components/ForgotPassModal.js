import React, { useState } from 'react'
import {Modal, ModalBody, ModalHeader, Row, Col} from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.css'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

function ForgotPassModal() {
    const [modal,setModal]=useState(true)
    const [email,setEmail]=useState("")


    const  navigate =useNavigate()

    const toastOptions = {
      position: "bottom-right",
      autoClose: 8000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    };

    const validateForm = () => {
      

      if (email === "") {
        toast.error("email is required.", toastOptions);
        return false;
      }
      return true;
    };


    const handleSubmit = async (event) => {
      event.preventDefault();
      if (validateForm()) {
        
        const { data } = await axios.post("http://localhost:4000"+"/forgotPassword", {
          email
        });
        if (data.status == false) {
          toast.error(data.message, toastOptions);
        }
        if (data.status == true) {
          // localStorage.setItem(
          //   process.env.REACT_APP_LOCALHOST_KEY,
          //   JSON.stringify(data.user)
          // );
          toast.info(data.message, toastOptions);
          setTimeout(() => {
            navigate("/")
          }, 2000);
  
          
        }
      }
    }
  return (
    <div>
        <Modal size='1g' isOpen={modal} toggle={()=>setModal(!modal)}>
            <ModalHeader toggle={()=>setModal(!modal)}>
                
                Enter your Registered Email
            </ModalHeader>
            <ModalBody>
                <Row>
                    <Col lg={12}>
                        <label htmlFor='email'>Email</label>
                        <input type='email' className='form-control' placeholder='Email' onChange={(e)=>setEmail(e.target.value)}/>
                        <button className='btn mt-3' style={{backgroundColor:"#0b3629",color:"white"}} onClick={(e)=>handleSubmit(e)}>Submit</button>
                    </Col>
                </Row>
            </ModalBody>
            
        </Modal>
    </div>
  )
}

export default ForgotPassModal