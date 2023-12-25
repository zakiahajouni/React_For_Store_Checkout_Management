import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Axios from "axios";

const TopProduct = () => {
  const [topProduct, setTopProduct] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:8008/caisse/api/vente/mostSoldProduct")
      .then((response) => {
        setTopProduct(response.data.libelle);
      })
      .catch((error) => {
        console.error("Error fetching top-selling product: ", error);
      });
  }, []);

  return (
    <div style={{ margin: "0 auto", width: "100%", marginLeft: "0%"  }}>
    <Card style={{ width: "70%", height: "50%" }}>
      <Box p={3} display="flex" alignItems="center">
        <Typography variant="h4" align='cenetr'><b>Top Product </b></Typography>
        </Box>
        <CardContent>
          <Typography variant="h6">
            <center>{topProduct}</center>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopProduct;
