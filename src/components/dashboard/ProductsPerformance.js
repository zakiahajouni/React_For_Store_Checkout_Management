import React, { useState, useEffect , useRef} from "react";
import Axios from "axios";
import { useReactToPrint } from "react-to-print";
import './pag.css';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import axios from "axios";
import {
  Card
  
} from "@mui/material";
import {
  Button,
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
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { TextField } from "@mui/material";

const ProductsPerformance = () => {
  const [products, setProducts] = useState([]);
  const [libelle, setLibelle] = useState();
  const [code, setCode] = useState();
  const [prix, setPrix] = useState();
  const [quantite, setQuantite] = useState();
  const [cat, setCat] = useState();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(3);
  const [openDialog, setOpenDialog] = useState(false);
  const [productId, setProductId] = useState("");
  const user = JSON.parse(localStorage.getItem("user-info"));
  const [openStateDialog, setOpenStateDialog] = useState(false);
  const componentPDF= useRef();
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);

  const filteredProduct = products.filter((product) =>
  String(product.libelle).toLowerCase().includes(searchTerm.toLowerCase()) ||
  String(product.code).toLowerCase().includes(searchTerm.toLowerCase())
);
const filteredProductsForUserRole = user.role === "admin"
    ? filteredProduct
    : filteredProduct.filter((product) => product.disponibilite === "available");



  const openStateConfirmationDialog = (id) => {
    setProductId(id);
    setOpenStateDialog(true);
  };

  const closeStateConfirmationDialog = () => {
    setOpenStateDialog(false);
  };
  const handleState = (id) => {
    
    axios
      .get(`http://localhost:8008/caisse/api/prod/getbyid/${productId}`)
      .then((response) => {
        const {
          idProduit,
          libelle,
          code,
          prix,
          quantite,
          categorie,
        } = response.data;
        
        setLibelle(libelle);
        setCode(code);
        setPrix(prix);
        setQuantite(quantite);
        setCat(categorie);

        const data = {
          libelle: libelle,
          code: code,
          prix: prix,
          quantite: quantite,
          disponibilite: "available",
          categorie: categorie,
        };
        axios
          .put(
            `http://localhost:8008/caisse/api/prod/updateproduit/${productId}`,
            data
          )
          .then((response) => {
            console.log(response);
            window.location.reload();
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const openConfirmationDialog = (id) => {
    setProductId(id);
    setOpenDialog(true);
  };

  const closeConfirmationDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    Axios.get("http://localhost:8008/caisse/api/prod/all").then((response) => {
      setProducts(response.data);
      setAllProducts(response.data);
      console.log(response.data);
    });
    Axios.get("http://localhost:8008/caisse/api/categorie/all").then(
      (response) => {
        setCategories(response.data);
        console.log(response.data);
      }
    );
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredProductsForUserRole.slice(indexOfFirstPost, indexOfLastPost);

  const deleteProduct = (id) => {
    axios
      .get(`http://localhost:8008/caisse/api/prod/getbyid/${productId}`)
      .then((response) => {
        const {
          idProduit,
          libelle,
          code,
          prix,
          quantite,
          categorie,
        } = response.data;
        setLibelle(libelle);
        setCode(code);
        setPrix(prix);
        setQuantite(quantite);
        setCat(categorie);

        const data = {
          libelle: libelle,
          code: code,
          prix: prix,
          quantite: quantite,
          disponibilite: "unavailable",
          categorie: categorie,
        };

        console.log(data);

        axios
          .put(
            `http://localhost:8008/caisse/api/prod/updateproduit/${productId}`,
            data
          )
          .then((response) => {
            console.log(response);
            window.location.reload();
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  };

  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate("/addproduct");
  };

  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const [showCard, setShowCard] = useState(false);
  const [selectedProductStock, setSelectedProductStock] = useState(null);
  const handleShowCard = () => {
    setSelectedProductStock(allProducts);
    setShowCard(true);
  };

  const handleCloseCard = () => {
    setShowCard(false);
  };

  const generatePDF=useReactToPrint({
    content: ()=>componentPDF.current,
    documentTitle:" List of Products",
    onAfterPrint:()=>handleCloseCard()
  })



  return (
    <BaseCard title="Products Perfomance">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "50px",
          marginTop: "-50px",
        }}
      >
        {user.role === "admin" ? (
      <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleShowCard}
        style={{ marginRight: "10px" }}
      >
        Inventory
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleButtonClick}
        
      >
        Add Product
      </Button>

    </div>
        ) : (
          <></>
        )}
      </div>
      <TextField
        fullWidth
        id="search-input"
        label="Search by Product Name or Code"
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
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "600",
                }}
              >
                Code
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "600",
                }}
              >
                Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "600",
                }}
              >
                Category
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "600",
                }}
              >
                Price
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "600",
                }}
              >
                Stock Quantity
              </Typography>
            </TableCell>
            {user.role === "admin" ? (
              <>
            <TableCell>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "600",
                }}
              >
                State
              </Typography>
            </TableCell>   
            </>         
            ) : (
              <></>
            )}
            {user.role === "admin" ? (
              <>
                <TableCell >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "600",
                    }}
                  >
                    Update
                  </Typography>
                </TableCell>
                {/* <TableCell align="right">
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "600",
                    }}
                  >
                    Delete
                  </Typography>
                </TableCell> */}
              </>
            ) : (
              <></>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts.map((product) => (
            <TableRow key={product.libelle}>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  {product.code}
                </Typography>
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "600",
                      }}
                    >
                      {product.libelle}
                    </Typography>
                    <Typography color="textSecondary" variant="h6">
                      {categories.find(
                        (cat) => cat.idCategorie === product.categorie
                      )?.libelleCat}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  {product.categorie.libelleCat}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" color="textSecondary">
                  {product.prix} Dinars{" "}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="h6"
                  textAlign="center"
                  color="textSecondary"
                >
                  {product.quantite}
                </Typography>
              </TableCell>
              {user.role === "admin" ? (
              <>
              <TableCell>
              {product.disponibilite === 'Out of Stock' ? (
                <Chip
                  sx={{
                    pl: "4px",
                    pr: "4px",
                    backgroundColor: "orange",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                  label={product.disponibilite}
                />
              ) : (
                <div>
                <Chip
                  sx={
                    user.role === "admin" &&
                    product.disponibilite === "available"
                      ? {
                          pl: "4px",
                          pr: "4px",
                          backgroundColor: "green",
                          color: "#fff",
                          cursor: "pointer",
                        }
                      : {
                          pl: "4px",
                          pr: "4px",
                          backgroundColor: "#E46A76",
                          color: "#fff",
                          cursor: "pointer",
                        }
                  }
                  label={product.disponibilite}
                  onClick={() => {
                    if (product.disponibilite === "unavailable") {
                      openStateConfirmationDialog(product.idProduit);}

                    if (product.disponibilite === "available") {
                        openConfirmationDialog(product.idProduit);
                    }
                  }}
                />
                <Dialog
        open={openStateDialog}
        onClose={closeStateConfirmationDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Update State</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to update the state of this product?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleState} variant="contained" color="primary">
            Yes
          </Button>
          <Button onClick={closeStateConfirmationDialog} variant="contained">
            No
          </Button>
        </DialogActions>
      </Dialog>
      
      <Dialog
                      open={openDialog}
                      onClose={closeConfirmationDialog}
                      maxWidth="xs"
                      fullWidth
                    >
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogContent>
                        <Typography variant="body1">
                          Are you sure you want to make this product
                          unavailable?{" "}
                        </Typography>
                      </DialogContent>
                      <DialogActions>
                        <Button
                          onClick={deleteProduct}
                          variant="contained"
                          color="secondary"
                        >
                          Yes
                        </Button>
                        <Button
                          onClick={closeConfirmationDialog}
                          variant="contained"
                        >
                          No
                        </Button>
                      </DialogActions>
                    </Dialog>
      </div>
              )}
            </TableCell>
            </>
                        ) : (
                          <></>
                        )}
              <TableCell >
{user.role === "admin" && (
  <TableCell>
    <Link to={`updateProduct/${product.idProduit}`}>
      <ModeEditIcon  />
    </Link>
  </TableCell>
)}
              </TableCell>
              
            </TableRow>
          ))}
                  </TableBody>
      </Table>
      
  {showCard && selectedProductStock && (
      <div className="inventory-card-container">
      <div style={{ margin: "0 auto", width: "80%", textAlign: "right" ,marginLeft:"18%", marginTop:"40px" }}>
      <Card style={{ width: "100%", height: "90%" ,maxHeight:'600px',overflowY: 'auto' }}>
        <Box p={4} display="flex" alignItems="center">
          <Typography variant="h4">Products Inventory</Typography>
          </Box>
          <div
            style={{
              justifyContent: "flex-end",
              marginBottom: "200px",
              marginTop: "-30px",
            }}
          >
          <div ref={componentPDF} style={{width:'100%'}}>
            <Table
              aria-label="simple table"
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              <TableHead>
                <TableRow>
          <TableCell>
              <Typography color="textSecondary" variant="h6" sx={{
                        fontWeight: "600",
                      }}>
                Code
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="h6" sx={{
                        fontWeight: "600",
                      }}>
                Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="h6" sx={{
                        fontWeight: "600",
                      }}>
                Category
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="h6" sx={{
                        fontWeight: "600",
                      }}>
                Price
              </Typography>
            </TableCell>
            <TableCell>
              <Typography color="textSecondary" variant="h6" sx={{
                        fontWeight: "600",
                      }}>
                Stock Quantity
              </Typography>
            </TableCell>
            <TableCell >
              <Typography color="textSecondary" marginRight={'30px'} variant="h6" sx={{
                        fontWeight: "600",
                      }}>
                State
              </Typography>
            </TableCell>
            </TableRow>
              </TableHead>
              <TableBody>
          {allProducts.map((product) => (
            <TableRow key={product.libelle}>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "15px",
                    fontWeight: "500",
                  }}
                >
                  {product.code}
                </Typography>
              </TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "600",
                      }}
                    >
                      {product.libelle}
                    </Typography>
                    <Typography color="textSecondary" variant="h6">
                      {categories.find(
                        (cat) => cat.idCategorie === product.categorie
                      )?.libelleCat}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Typography color="textSecondary" variant="h6">
                  {product.categorie.libelleCat}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" color="textSecondary">
                  {product.prix} Dinars{" "}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="h6"
                  textAlign="center"
                  color="textSecondary"
                >
                  {product.quantite}
                </Typography>
              </TableCell>
              <TableCell>
  {product.quantite === 0 ? (
    <Chip
      sx={{
        pl: "4px",
        pr: "4px",
        backgroundColor: "orange",
        color: "#fff",
        cursor: "pointer",
      }}
      label={product.disponibilite}
    />
  ) : (
    <div>
      <Chip
      
        sx={
          user.role === "admin" &&
          product.disponibilite === "available"
            ? {
                pl: "4px",
                pr: "4px",
                backgroundColor: "green",
                color: "#fff",
                cursor: "pointer",
              }
            : {
                pl: "4px",
                pr: "4px",
                backgroundColor: "#E46A76",
                color: "#fff",
                cursor: "default", 
              }
        }
        label={product.disponibilite}
        onClick={() => {
          console.log(user.role);
          if (user.role === "admin") {
            if (product.disponibilite === "unavailable") {
              openStateConfirmationDialog(product.idProduit);
            }
        
            if (product.disponibilite === "available") {
              openConfirmationDialog(product.idProduit);
            }
          } else {
            console.log(user.role);
          }
        }}
      />
    </div>
  )}
</TableCell>

            </TableRow>
          ))}
                  </TableBody>
            </Table>
            </div>
          <div style={{ marginLeft: '20px' , marginTop: '20px'}}>
          <Button
            variant="contained"
            color="primary"
            onClick={generatePDF}
            
          >
            Print Inventory
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseCard}
            style={{ marginLeft: '10px' }}
          >
            Close 
          </Button>
          
        </div>
          </div>
        </Card>
        </div>
      </div>
    )}
      <ReactPaginate
        onPageChange={paginate}
        pageCount={Math.ceil(products.length / postsPerPage)}
        previousLabel={"Prev"}
        nextLabel={"Next"}
        containerClassName={"pagination"}
        pageLinkClassName={"page-number"}
        previousLinkClassName={"page-number"}
        nextLinkClassName={"page-number"}
        activeLinkClassName={"active"}
      />
    </BaseCard>
  );
};

export default ProductsPerformance;
