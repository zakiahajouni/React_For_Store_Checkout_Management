import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import dynamic from "next/dynamic";
import BaseCard from "../baseCard/BaseCard";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StatBar = () => {
  const [sales, setSales] = useState([]);
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];
  const getMonthName = (monthNumber) => {
    return months[monthNumber - 1];
  };
  
  useEffect(() => {
    const fetchMonthlySalesData = async () => {
      const monthlySalesData = [];
  
      for (let i = 1; i <= 12; i++) {
        const response = await fetch(`http://localhost:8008/caisse/api/vente/totalSales?year=${year}&month=${i}`);
        const data = await response.json();
        monthlySalesData.push({ month: getMonthName(i), totalSales: data });
      }
  
      setSales(monthlySalesData);
    };
  
    fetchMonthlySalesData();
  }, []);


    const optionssalesoverview = {
        grid: {
          show: true,
          borderColor: "transparent",
          strokeDashArray: 2,
          padding: {
            left: 0,
            right: 0,
            bottom: 0,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "42%",
            endingShape: "rounded",
            borderRadius: 5,
          },
        },
    
        colors: ["#fb9678", "#03c9d7"],
        fill: {
          type: "solid",
          opacity: 1,
        },
        chart: {
          offsetX: -15,
          toolbar: {
            show: false,
          },
          foreColor: "#adb0bb",
          fontFamily: "'DM Sans',sans-serif",
          sparkline: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        markers: {
          size: 0,
        },
        legend: {
          show: false,
        },
        xaxis: {
          type: "category",
          categories: months,
          tickAmount: months.length,
          labels: {
            style: {
              cssClass: "grey--text lighten-2--text fill-color",
            },
          },
        },
        yaxis: {
          show: true,
          min: 0,
          max: 600,
          tickAmount: 3,
          labels: {
            style: {
              cssClass: "grey--text lighten-2--text fill-color",
            },
          },
        },
        stroke: {
          show: true,
          width: 5,
          lineCap: "butt",
          colors: ["transparent"],
        },
        tooltip: {
          theme: "dark",
        },
      };
      const seriessalesoverview = [
        {
          name: "Total Sales",
          data: sales.map((month) => month.totalSales),
        },
      ];
      return (
        
  
<div style={{ margin: "0 auto", width: "80%", textAlign: "right" ,marginLeft:"18%" }}>
      <Card style={{ width: "100%", height: "30%" }}>
        <Box p={4} display="flex" alignItems="center">
          <Typography variant="h4">Sales Overview</Typography>
        </Box>
        <CardContent><Chart
    options={optionssalesoverview}
    series={seriessalesoverview}
    type="bar"
    height="150px"
  /></CardContent>
      </Card>
    </div>
      );
}

export default StatBar
