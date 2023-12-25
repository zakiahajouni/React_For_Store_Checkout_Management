import React from 'react'
import { Grid } from "@mui/material";
import ProductsPerformance from "../components/dashboard/ProductsPerformance";
import FullLayout from "../components/layouts/FullLayout";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from '../theme/theme';
import StatBar from '../components/Statistique/StatBar';
import TopProduct from '../components/Statistique/TopProduct';
import Gains from '../components/Statistique/Gains';
import BestSeller from '../components/Statistique/BestSeller';
const Stats = () => {
  return (
    <div>
  
 <ThemeProvider theme={theme}>
  <CssBaseline />
  <FullLayout>
    <StatBar />
    <Grid container spacing={0}>
      <Grid item xs={12} lg={3}>
        
      </Grid>
      <Grid item xs={12} lg={3}>
        <TopProduct />
      </Grid>
      <Grid item xs={12} lg={3}>
        <Gains />
      </Grid>
      <Grid item xs={12} lg={3}>
        <BestSeller />
      </Grid>
    </Grid>
  </FullLayout>
</ThemeProvider>


    </div>
  );
  
}

export default Stats