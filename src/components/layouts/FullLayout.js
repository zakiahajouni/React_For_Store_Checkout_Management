import React from 'react'
import SidebarAdmin from './sidebar/SidebarAdmin'
import Header from './header/Header'

import {
  experimentalStyled,
  useMediaQuery,
  Container,
  Box,
} from "@mui/material";
import { User } from 'feather-icons-react/build/IconComponents';
import { UserContext } from '../../context/UserContext';
import SidebarUser from './sidebar/SidebarUser';


const MainWrapper = experimentalStyled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  overflow: "hidden",
  width: "100%",
}));
const PageWrapper = experimentalStyled("div")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  overflow: "hidden",

  backgroundColor: theme.palette.background.default,
  [theme.breakpoints.up("lg")]: {
    paddingTop: "64px",
  },
  [theme.breakpoints.down("lg")]: {
    paddingTop: "64px",
  },
}));
const FullLayout = ({ children }) => {
  const user=JSON.parse(localStorage.getItem('user-info'))
  return (
    
   <MainWrapper>
    {
      user.role =='admin'?
      <SidebarAdmin/>
      :
      <SidebarUser/>
    }
    
    
    <Header/>
    <PageWrapper>
    <Container
          maxWidth={false}
          sx={{
            paddingTop: "20px",
           
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
          
        </Container>  
    </PageWrapper>
    </MainWrapper>
  )
}

export default FullLayout