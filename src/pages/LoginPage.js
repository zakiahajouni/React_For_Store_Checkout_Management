import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Card, Container, Row, Col } from 'react-bootstrap';
import Tables from "./SaleTable";
import { useNavigate } from 'react-router-dom';
import {
  
  TextField,
  
} from "@mui/material";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
}
from 'mdb-react-ui-kit';

import {
  Grid,
  
  Box,
  Stack,
  IconButton,
  Fab,
  ButtonGroup,
} from "@mui/material";
import "./Login.css";
import FeatherIcon from "feather-icons-react";
import { useRef ,  useEffect ,useContext} from "react";
import AuthContext from '../context/AuthProvider';
import {

    
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
  } from "@mui/material";
  import login from "../../src/assets/img/login.png";

function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  function validate(data) {
    let errors = {};
    // if (!data.email) {
    //   errors.email = "Email is required";
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    //   errors.email = "Invalid email address";
    // }
    if (!data.password) {
      errors.password = "Password is required";
    }
    return errors;
  }
  
  const handleRegister =()=>{
    navigate('/Register');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validate(data);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    let result=await fetch("http://localhost:8008/caisse/api/employes/login",{
      method:'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        mail: email,
        password: password,
      }),
    });

    // result=await result.json()
    // // 
    // console.log(JSON.stringify(result))
    // if(JSON.stringify(result) =="error"){
    //   alert(" Check your password")
    // }
    // else{
    // navigate('/')
    // localStorage.setItem("user-info",JSON.stringify(result))}

    if (result.ok) {
      let response = await result.text(); // <-- Fix here
      if (response.error) {
        alert(response.message);
      } else {
        navigate('/');
        window.location.reload();
        localStorage.setItem("user-info", response);
      }
    } else {
      setOpenDialog(true);
    }
    
  };

  const data={
    mail : email,
    password: password,

};

const showInvalidPasswordDialog = () => {
      return (
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Invalid Password</DialogTitle>
          <DialogContent>
            <Typography variant="body1">The password you entered is invalid. Please try again.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Close</Button>
            {/* You can add additional actions if needed */}
          </DialogActions>
        </Dialog>
      );
    };
    const handleDialogClose = () => {
      setOpenDialog(false);
    };
  
    const handleDialogConfirm = () => {
      setOpenDialog(false);
      
    };
  return (
    <>

<MDBContainer fluid className="p-3 my-5">

<MDBRow>

<MDBCol col='10' md='6'>
          <img src={login} alt={login} class="img-fluid" style={{marginTop:"-50px"}} />
        </MDBCol>
  <MDBCol col='4' md='6'>
  <div style={{marginTop:"10%"}} >  
  <center style={{marginBottom:"10%"}}>
  <Fab color="secondary" disabled aria-label="add">
            <FeatherIcon icon="user" width="60" height="60" />
            </Fab>
            </center>
            
            <Form >
                <Form.Group size="lg" controlId="email">
                  
                  
                  <TextField
                    fullWidth
                    label="Mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                    onFocus={() => setFormErrors('')}
                  />
                  {formErrors.email && (
                  <div style={{ color: "red" }}>{formErrors.email}</div>
                )}
                </Form.Group>
                
                  
                  <TextField
        fullWidth
        
        label="password"
        type="password"
                    value={password}
                    
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFormErrors('')}
        sx={{ mb: 2 }}
      />
        {formErrors.password && (
                <div style={{ color: "red" }}>{formErrors.password}</div>
                
                )}
                <center>
                <Button variant="contained" color="primary" type="submit" onClick={handleSubmit} >
             Login
            </Button>
            {/* <Button variant="contained" color="primary" type="submit" onClick={handleRegister} >
             Add User
            </Button> */}
            </center>
              </Form>
              {showInvalidPasswordDialog()}
              </div>
</MDBCol>

      </MDBRow>

    </MDBContainer>
    </>
  );
}

export default LoginPage;
