import React from 'react'
import {useState,useEffect} from "react";
import Axios from 'axios';
import { useParams,  useNavigate } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from '../theme/theme';
import FullLayout from "../components/layouts/FullLayout";
import axios from 'axios';
import {
    Grid,
    Stack,
    TextField,
    Checkbox,
    FormGroup,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel,
    FormControl,
    Button,
  } from "@mui/material";
  import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
  } from "@mui/material";
  import BaseCard from '../components/baseCard/BaseCard';
const UpdateUser = () => {
  const { id } = useParams();
  const [login ,setLogin]=useState('');
  const [email , setEmail]=useState('');
  const [tel , setTel]=useState('');
  const [join_time , setJoin_Time]=useState('');
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState('');
  const history = useNavigate();
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    axios.get(`http://localhost:8008/caisse/api/employes/get/${id}`)
      .then(response => {
        const {nomEmploye,mail,tel,dateofjoin,password,role} = response.data;
        setLogin(nomEmploye);
        setEmail(mail)
        setTel(tel)
        setNewEmail(mail)
        setPassword(password)
        setJoin_Time(new Date(dateofjoin).toISOString().split('T')[0])
        setRole(role);
        console.log(response.data)
      })
      .catch(error => console.log(error));
  }, [id]);

  useEffect(() => {
    Axios.get('http://localhost:8008/caisse/api/employes/all').then((response) => {
    setUsers(response.data);
    console.log(response.data);
  });
  }, []);
const options = users.map((u) => ({
    id: u.idEmploye,
    email: u.mail,
  }));
  
  const handleNameChange =(event) => {
      setLogin(event.target.value);
  };

  const handleEmailChange =( event) =>{
      setNewEmail(event.target.value);
  };
  const handlePhoneChange =( event) =>{
      setTel(event.target.value);
  };
  const handleJoinDateChange =(event) =>{
      setJoin_Time(event.target.value);
  };
  const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };
  const handleRoleChange =(event) =>{
      setRole(event.target.value);
  };
  const handleClearForm = () => {
      history('/User')
    };
    
    function validateForm() {
      let errors = {};
      let isValid=true;
      if (!login) {
        errors.login = 'Full Name is required';
        isValid = false;
      }
    
      if (!email) {
        errors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Invalid email address';
        isValid = false;
      }
      if(!(newEmail === email)){
      if (options.find((o) => o.email.toLowerCase() === newEmail.toLowerCase())) {
        errors.email = 'Email address already exists';
        isValid = false;
      }}
      if (newPassword) {
      // if (!oldPassword) {
      //   errors.password = 'Old Password is required to update your password';
      //   isValid = false;
      // } 
       if (newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
        isValid = false;
      }
      if (!confirmPassword){
        errors.confirmPassword = 'Confirm your new Password';
        isValid = false;
      }
      else if(!(newPassword == confirmPassword)){
            errors.confirmPassword='Not the right password';
            isValid = false;
      }}
      if(oldPassword){
        if(!newPassword){
          errors.newPassword = 'new Password is required to update your password';
        isValid = false;
        }
      }
      if (!tel) {
        errors.tel = 'Phone number is required';
        isValid = false;
      }
      else{ 
       if (!/^[0-9]+$/.test(tel)) {
        errors.tel = 'Phone number must contain only digits';
        isValid = false;
      }
      if (tel.length< 8) {
        errors.tel = 'Phone number required 8 digits';
        isValid = false;
      } }

    
      if (!role) {
        errors.role = 'Role is required';
        isValid = false;
      }
    
      if (!join_time) {
        errors.join_time = 'Join date is required';
        isValid = false;
      }
      setErrors(errors);
      return isValid ;
    }
    
    const Add = event => {
      event.preventDefault();
      const data={
        nomEmploye: login,
        mail : newEmail,
        tel:tel,
        dateofjoin:join_time,
        password: newPassword,
        role:role,
          };
          console.log(data)
          if (validateForm()) {
            axios.put(`http://localhost:8008/caisse/api/employes/update/${id}`, data)
    .then(response => {
        console.log(response);
        history('/User');
    })
    .catch(error => {
        console.log(error);
        if (error.response.status === 401) {
            setOpenDialog(true);
        }
    });
    };
  }
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
  <ThemeProvider theme={theme}>
      <CssBaseline />
      <FullLayout>
  <Grid container spacing={0}>
    <Grid item xs={12} lg={12} sx={{ textAlign: 'left' }}>
      <BaseCard title="Update User Profile" >
      <form >
        <Stack spacing={1} sx={{ marginTop: '-50px', paddingTop: '10px' }} >
          
        <TextField
            id="name"
            label="Full Name "
            variant="outlined"
            value={login}
            onChange={handleNameChange}
            onFocus={() => setErrors({ ...errors, login: '' })}
            error={errors.login}
            helperText={errors.login}
            sx={{ width: '60%' }}
            
            
          />
          <TextField
            id="email"
            label="Email"
            value={newEmail}
            onFocus={() => setErrors({ ...errors, email: '' })}
            error={errors.email}
            helperText={errors.email}
            onChange={handleEmailChange}sx={{ width: '60%' }} 
            
            
          />
 {/* <div sx={{ display: 'flex', flexDirection: 'row' }}> */}
{/* <TextField
  id="password"
  label="Password"
  type="password"
  value={password}
  error={errors.password}
  onFocus={() => setErrors({ ...errors, password: '' })}
  helperText={errors.password}
  onChange={handlePasswordChange}
  sx={{ width: '40%' }}
  
/> */}
<div style={{ display: 'flex' }}>
<TextField
  id="new-password"
  label="New Password"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  type="password"
  sx={{ width: '30%' }}
  onFocus={() => setErrors({ ...errors, newPassword: '' })}
  error={errors.newPassword}
  helperText={errors.newPassword}
/>

<TextField
id="confirm-password"
label="Confirm New Password"
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
type="password"
sx={{ width: '30%', marginLeft:'0.3%' }}
error={errors.confirmPassword}
helperText={errors.confirmPassword}
onFocus={() => setErrors({ ...errors, confirmPassword: '' })}
/>
</div>
{/* <TextField
id="old-password"
label="Old Password"
value={oldPassword}
onChange={(e) => setOldPassword(e.target.value)}
type="password"
sx={{ width: '60%' }}
error={errors.password}
helperText={errors.password}
onFocus={() => setErrors({ ...errors, password: '' })}
/> */}



<TextField
  id="phone"
  label="Phone Number"
  value={tel}
  onChange={handlePhoneChange}
  onFocus={() => setErrors({ ...errors, tel: '' })}
  error={errors.tel}
  helperText={errors.tel}
  sx={{ width: '60%',  marginLeft: '10px'  ,marginRight:'330px'}}
/>
{/* </div> */}
<FormControl error={errors.role}>
  <FormLabel id="role" sx={{ marginRight: "1150px" }}>
    Role
  </FormLabel>
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    name="radio-buttons-group"
    value={role}
    onChange={handleRoleChange}
    row
  >
                <FormControlLabel
                  value="admin"
                  control={<Radio />}
                  label="Admin"
                  error={errors.role}
                  helperText={errors.role}
                  
                />
                <FormControlLabel
                  value="employee"
                  control={<Radio />}
                  label="Employee"
                  error={errors.role}
                  helperText={errors.role}
                
                />
              
              </RadioGroup>
            </FormControl>

      
      {/* <TextField
        id="date"
        label="Join Date"
        type="date"
        value={join_time}
        onChange={handleJoinDateChange}
        onFocus={() => setErrors({ ...errors, join_time: '' })}
        error={errors.join_time}
        helperText={errors.join_time}
        InputLabelProps={{
          shrink: true,
        }}
      /> */}
      <TextField
                  id="date"
                  label="Join Date"
                  type="date"
                  value={join_time}
                  onChange={handleJoinDateChange}
                  onFocus={() => setErrors({...errors, join_time: ''})}
                  error={errors.join_time}
                  helperText={errors.join_time}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />


        </Stack>
        <br />
        <Button type='submit' variant="contained" mt={0} onClick={Add}>
          Submit
        </Button>
        <Button variant="outlined" sx={{ ml: '10px' }} onClick={handleClearForm}>
Return
</Button></form>
{showInvalidPasswordDialog()}
      </BaseCard>
    </Grid>
    </Grid>
    </FullLayout>
    </ThemeProvider>
)
}

export default UpdateUser