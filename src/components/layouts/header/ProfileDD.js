import React from "react";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import userimg from "../../../assets/users/user2.jpg";
import {
  Box,
  Menu,
  Typography,
  Link,
  ListItemButton,
  List,
  ListItemText,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {useState,useEffect} from "react";

const ProfileDD = () => {
    const [anchorE14, setAnchorE14]=React.useState(null);
    const handleClick4 =(event) =>{
        setAnchorE14(event.currentTarget);
    };

    const handleClose4= ()=>{
        setAnchorE14(null);
    }
    const navigate = useNavigate();
    const userString = localStorage.getItem('user-info');
    const user = JSON.parse(userString);
    console.log(userString.idEmploye);
    const [id, setId]=useState(user.id)
    const   logOut= async (event) => {
        event.preventDefault();
        navigate('/login')
        
        localStorage.clear();
        window.location.reload();
    
    
    }
    console.log(user)
    // const navigate = useNavigate();
    // const  logout = () =>{
    //     localStorage.removeItem('logged');
    //     navigate('/login')
    // }
    return (
    <>
    <Button aria-label="menu" color="inherit" aria-controls="profile-menu" aria-haspopup="true" onClick={handleClick4}>
     <Box display="flex" alignItems="center">
    <Image src={userimg} alt={userimg} width="30" height="30" className="roundedCircle" />
    <Box sx={{ display:{
        xs:"none",
        sm:"flex",
    },
    alignItems:"center",
}}>
    <Typography color="textSecondary" variant="h5" fontWeight="400" sx={{ml:1}}>
        Hi,
    </Typography>
    <Typography variant="h5" fontWeight="700" sx={{ml:1,
    color:'gray'}}>{user.nomEmploye} </Typography>
    <FeatherIcon icon="chevron-down" width="20" height="20" />
    </Box>   
        </Box>   
    </Button>
    <Menu id="Profile-menu" anchorEl={anchorE14} keepMounted open={Boolean(anchorE14)} onClose={handleClose4} 
    sx={{"& .MuiMenu-paper": {
            width: "385px", },}}>
<Box>
    <Box p={2} pt={0}>
        <List component="nav" aria-label="secondary mailbox folder" onClick={handleClose4}>
            <ListItemButton>
            
                 
{/* <button onClick={()=>{ navigate(`updateSelf/${user.id}`)}}  style={{border: 'none', backgroundColor: 'white' }} >
   <ListItemText primary="Edit Profile"/>
    
</button> */}
    
            </ListItemButton>
        
             </List> 
    </Box>
    <Divider />
    <Box p={2}>
    {/* click={() => logout()}  */}
            <Button  fullWidth variant="contained" color="primary" onClick={logOut}>
                logout
            </Button>
       
    </Box>
</Box>   
            </Menu>
    </>
  )
}

export default ProfileDD