import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Card, CardContent, Typography, Box } from "@mui/material";
const Gains = () => {
  const [total, setTotal] = useState("");
  useEffect(() => {
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    // Make the API call
    Axios.get(`http://localhost:8008/caisse/api/vente/totalSales?year=${year}&month=${month}`)
      .then((response) => {
        setTotal(response.data);
      })
      .catch((error) => {
        console.error("Error fetching total : ", error);
      });
  }, []);


  return (
    <div style={{ margin: "0 auto", width: "100%", marginLeft: "0%"  }}>
    <Card style={{ width: "70%", height: "50%" }}>
    <Box p={3} display="flex" alignItems="center">
        <Typography variant="h4" align='cenetr'><b>Total Sales </b></Typography>
      </Box>
      <CardContent> 
      <Typography variant="h4" ><center>{total} Dinars</center></Typography>
      </CardContent>
    </Card>
  </div>
  )
}

export default Gains
