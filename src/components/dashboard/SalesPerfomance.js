import React from "react";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState, useEffect , useRef} from "react";
import ReactPaginate from 'react-paginate';
import { Card } from "@mui/material";
import Axios from 'axios';
import {
  Button,
 Fab,
  ButtonGroup,
} from "@mui/material";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import BaseCard from "../baseCard/BaseCard";
import { useReactToPrint } from "react-to-print";
import { TextField } from "@mui/material";


const SalesPerfomance = () => {
  const navigate = useNavigate();
  const[sales,setSales]=useState([])
  const[products,setProducts]=useState([])
  const[productsVente,setProductsVente]=useState([])
  const [currentPage ,setCurrentPage]=useState(1);
  const [postsPerPage , setPostsPerPage]=useState(4);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const user = JSON.parse(localStorage.getItem("user-info"));
  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
  };
  useEffect(()=>{
    Axios.get('http://localhost:8008/caisse/api/vente/all').then((response)=>{
      setSales(response.data)
      
      console.log(response.data);
    });
    Axios.get('http://localhost:8008/caisse/api/all').then((response)=>{
      setProducts(response.data)
      console.log(response.data);
    });


  },[]);
  const handleButtonClick =()=>{
    navigate('/AddSale');
  };
  const parseCustomDate = (dateString) => {
    if (dateString) {
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-');
      return `${year}-${month}-${day}`;
    }
    return "Invalid Date";
  };

  const [showCard, setShowCard] = useState(false);
  const [selectedProductStock, setSelectedProductStock] = useState(null);


  const handleCloseCard = () => {
    setShowCard(false);
  };

  const handlePrint = (ticket) => {
    // Handle printing logic here
    console.log("Printing ticket:", ticket);
  };

  const handleShowTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    Axios.get(`http://localhost:8008/caisse/api/vente/venteWithProduits/${ticket.idVente}`).then((response) => {
      setProductsVente(response.data);
    });
    productsVente.map((item) => (
      console.log(item[1])
    ));
    setShowCard(true);
    
    
  };

  const handleCloseTicketDetails = () => {
    setSelectedTicket(null);
    setShowCard(false);
  };

  const componentPDF = useRef();
  const generatePDF = useReactToPrint({
    content: () => componentPDF.current,
    documentTitle: "Ticket Details",
    onAfterPrint: () => handleCloseTicketDetails(),
  });

  const filteredSales = sales.filter((sale) =>
  String(sale.numTicket).toLowerCase().includes(searchTerm.toLowerCase())
);

const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentPosts = filteredSales.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <>
    <BaseCard title="Sales Perfomance">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "50px" , marginTop:"-50px"}}>
        <Button variant="contained" color="primary" onClick={handleButtonClick}>Add Sale</Button>
      </div>
      <TextField
        fullWidth
        id="numTicket-search-input"
        label="Search by Ticket Code"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ width: '100%', backgroundColor: '#f5f5f5' }}
      />
      <br/>
      <br/>
      <br/>
      <Table
        aria-label="simple table"
        sx={{
          mt: -5,
          whiteSpace: "nowrap",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography color="textSecondary" variant="h6" sx={{
                        fontWeight: "600",
                      }}>
                Ticket Code
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="h6" sx={{
                        fontWeight: "600",
                      }}>
                Assigned
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="h6" sx={{
                        fontWeight: "600",
                      }}>
                Date
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="h6" sx={{
                        fontWeight: "600",
                      }}>
                Time
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="h6" sx={{
                        fontWeight: "600",
                      }}>
                Budget
              </Typography>
            </TableCell>
            <TableCell >
              <Typography color="textSecondary" variant="h6" sx={{
                        fontWeight: "600",
                      }}>
                Print
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts.map((sale) => (
            <TableRow key={sale.code}>
              <TableCell>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  {sale.numTicket}
                </Typography>
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {sale.employe.nomEmploye}
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "600",
                      }}
                    >
                     
                    </Typography>
                    <Typography
                      color="textSecondary"
                      sx={{
                        fontSize: "13px",
                      }}
                    >
                      {sale.DateVente}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
  <Typography variant="h6" color="textSecondary">
  {parseCustomDate(sale.dateVente)}
  </Typography>
</TableCell>
<TableCell>
<Typography variant="h6" color="textSecondary">
    {sale.dateVente ? new Date(sale.dateVente).toLocaleTimeString('en-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) : 'Invalid Time'}
  </Typography>
</TableCell>
              <TableCell>
              <Typography variant="h6">{sale.total} Dinars</Typography>
              </TableCell>
              <TableCell  >
                <button  style={{ border:'0' ,background:'white' }} 
                onClick={() => handleShowTicketDetails(sale)}
                >
              < LocalPrintshopIcon style={{ color: 'blue' }}/>
              </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ReactPaginate
                  onPageChange={paginate}
                  pageCount={Math.ceil(sales.length / postsPerPage)}
                  previousLabel={'Prev'}
                  nextLabel={'Next'}
                  containerClassName={'pagination'}
                  pageLinkClassName={'page-number'}
                  previousLinkClassName={'page-number'}
                  nextLinkClassName={'page-number'}
                  activeLinkClassName={'active'}
               />
    </BaseCard>
    {showCard && selectedTicket && (
  <div className="inventory-card-container">
    <Card style={{ width: '25%' ,height:'60%' }}>
    <div ref={componentPDF} style={{width:'100%'}}>
      <div
        style={{
          
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">
        Ticket Details - {selectedTicket.numTicket}
      </Typography>
      <br/>
      <br/>

<Typography variant="h6">Date: {parseCustomDate(selectedTicket.dateVente)}</Typography>
        <Typography variant="h6">Time:     {selectedTicket.dateVente ? new Date(selectedTicket.dateVente).toLocaleTimeString('en-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) : 'Invalid Time'}</Typography>
<Typography variant="body1">-------------------------</Typography>
<Typography variant="body1">Quantity | Product |  Price</Typography>
<ul style={{ listStyle: 'none', padding: 0 }}>
  {productsVente.map((item) => (
    <li >
<div style={{ margin: '0 5px' }}>
  <Typography variant="h6">
  {item[1].libelle} &nbsp; {item[2]} * {item[1].prix} &nbsp; {item[1].prix * item[2]}
  </Typography>
</div>
    </li>
  ))}
</ul>
<Typography variant="body1">-------------------------</Typography>
        <Typography variant="h6">Total: {selectedTicket.total} </Typography>
        <br/>
        <Typography variant="h6">Thank you for your purchase!</Typography>

        <div style={{ display: "flex", marginTop: "10px" }}>
          <Button
            variant="contained"
            color="primary"
            
            style={{ marginRight: "10px" }}
            onClick={generatePDF}
          >
            Print Ticket
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseTicketDetails}
          >
            Close
          </Button>
        </div>
      </div>
      </div>
    </Card>
  </div>
)}
    </>
  );
};

export default SalesPerfomance;
