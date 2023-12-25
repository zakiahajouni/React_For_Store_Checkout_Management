import React from 'react'
import NextLink from 'next/link';
import PropTypes from "prop-types";

import {
  Box,
  Drawer,
  useMediaQuery,
  List,
  Link,
  Button,
  Typography,
  ListItem,
  Collapse,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import LogoIcon from '../../logo/LogoIcon';
import { SidebarDataUser } from './SidebarDataUser';



const SidebarUser = () => {
  return (
    <Box p={1} className="boxa" height="110%" backgroundColor="#60359A" width="18%" position="absolute">
      <center><LogoIcon /></center>
      <center><Typography variant="h4" color="white" marginTop={3} >
          caissty
        </Typography></center>
      <Box mt={-7}>
        <ul className="SidebarList">
          {SidebarDataUser.map((val, key) => {
            return (
              <li
                className="row"
                key={key}
                onClick={() => {
                  window.location.pathname = val.link;
                }}
              >
                <div id='icon'>{" "}{val.icon}</div>{" "}
                <div id='title'>{val.title}</div>
              </li>
            );
          })}
        </ul>
      </Box>
    </Box>
  );
}

export default SidebarUser;