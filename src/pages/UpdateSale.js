import React from 'react'
import  { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import{useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Autocomplete } from '@mui/material';
import FullLayout from "../components/layouts/FullLayout";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from '../theme/theme';

import {
    Grid,
    Stack,
    TextField,
    Button,
  } from "@mui/material";
  import BaseCard from '../components/baseCard/BaseCard';
  
const UpdateSale = () => {
  const [products, setProducts] = useState([]);
 
   useEffect(() => {
     Axios.get('http://localhost:8008/caisse/api/all').then((response) => {
      setProducts(response.data);
      console.log(response.data);
     });
   }, []);

   const options = products.map((product) => ({
    id: product.idProduit,
    code: product.code,
    name: product.libelle,
    Qstock: product.quantite,
    prix: product.prix,
  }));

  const navigate = useNavigate();
  const [time, setTime] = useState(new Date().toISOString().slice(0, 10));
  const [quantity, setQuantity] = useState('');
  const [product, setProduct] = useState('');
  const [budget, setBudget] = useState(0);
  const [prix, setPrix] = useState(0);
  const [errors, setErrors] = useState({});
  const [selectedProductPrice, setSelectedProductPrice] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [venteData, setVenteData] = useState({
    idVente: null,
    numTicket: null,
    total: null,
    dateVente: null,
    produits: [],
  });



  const handleQuantityChange = (event) => {
    const qty = event.target.value;
    setQuantity(qty);
    if(qty>0){
    const selectedProduct = options.find((p) => p.id === product);
    if (selectedProduct) {
      const price = selectedProduct.prix;

    }}
    else{
      setBudget(0)
    }
  };
    
    
  const handleClearForm = () => {
    navigate('/')
  };
  
  const validateForm = () => {
        let isValid = true;
        let errors = {};
       if (!product) {
          errors.product = "Product code is required";
          isValid = false;
        }
        if (!quantity) {
           errors.quantity = " quantity is required";
           isValid = false;
        } 
         if (quantity <= 0) {
          errors.quantity = "Stock quantity must be a positive number";
          isValid = false;
       }
       
       if(product){
        const selectedProduct = options.find((p) => p.id === product);
        if(quantity > selectedProduct.Qstock){
           errors.quantity = "Stock insufficient";
           setBudget(0)
           isValid = false;
        }}
        setErrors(errors);
         return isValid;
       }



  const AddSale = (event) => {
    event.preventDefault();
    if (selectedData) {
      const data={
        numTicket:11111,
        total:parseFloat(budget),
        dateVente:time,
        produits:selectedData,
      };

    console.log(data);
    event.preventDefault();
   Axios.post("http://localhost:8008/produits/api/vente/addvente", data)
      .then((response) => {
        console.log(response);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  }};

  const addProduit = () => {
    if (validateForm()) {
      const selectedProduct = options.find((p) => p.id === product);
      if (selectedProduct) {
        const productPrice = selectedProduct.prix * quantity;
        const updatedSelectedProducts = [
          ...selectedProducts,
          {
            Id: selectedProduct.id,
            code: selectedProduct.code,
            name: selectedProduct.name,
            quantity,
            price: selectedProduct.prix,
          },
        ];
        const newProduit = new Produit(
          selectedProduct.id,
          selectedProduct.libelle,
          selectedProduct.code,
          selectedProduct.prix,
          selectedProduct.quantite,
          selectedProduct.disponibilite,
          selectedProduct.categorie
        );
        const updatedSelectedData = [
          ...selectedData,
          newProduit
        ];
        const newBudget = parseFloat(budget) + productPrice;
        setSelectedProducts(updatedSelectedProducts);
        setSelectedData(updatedSelectedData);
        setProduct('');
        setQuantity('');
        setBudget(newBudget.toFixed(3));
        console.log(selectedData);
      }
    }
  };
  
  const removeProductFromSale = (index) => {
    const removedProduct = selectedProducts[index];
    const updatedData = [...selectedData];
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    updatedData.splice(index, 1);
  
    let updatedBudget = 0;
    updatedProducts.forEach((product) => {
      updatedBudget += product.price;
    });
  
    setSelectedProducts(updatedProducts);
    setBudget(updatedBudget.toFixed(3)); // Update the budget with the new value
  };
  

    return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FullLayout>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12} sx={{ textAlign: 'left' }}>
            <BaseCard title="Add Sale">
              <form onSubmit={AddSale}>
                
                <Grid container spacing={2}>
                  <Grid item xs={4}>

                  <Autocomplete
  options={options}
  getOptionLabel={(option) => option.code}
  renderInput={(params) => (
    <TextField
      {...params}
      label="Select a Product"
      variant="outlined"
      error={errors.product}
      helperText={errors.product}
    />
  )}
  onChange={(event, newValue) => {
    setProduct(newValue ? newValue.id : ""); // Make sure this correctly sets the product state
    setSelectedProductPrice(newValue ? newValue.prix : "");

    // Log the product and errors to help with debugging
    console.log("Product:", product);
    console.log("Errors:", errors);
  }}
  sx={{ width: "100%" }}
/>

                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      id="quantity-input"
                      label="Quantity"
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      error={!!errors.quantity}
                      helperText={errors.quantity}
                      onFocus={() => setErrors({ ...errors, quantity: '' })}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      fullWidth
                      id="total-input"
                      label="Price"
                      type="number"
                      value={selectedProductPrice}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ backgroundColor: '#f5f5f5' }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                  variant="contained"
                    sx={{
                    width: '100%',
                    height: '100%',
                    
                  }} onClick={addProduit}
                >
                  Add Product
                </Button>
              </Grid>
                </Grid>
                <br/>
                <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                    <TableCell>Id</TableCell>
                      <TableCell>Product Code</TableCell>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Remove</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProducts.map((productData, index) => (
                      <TableRow key={index}>
                        <TableCell>{productData.Id}</TableCell>
                        <TableCell>{productData.code}</TableCell>
                        <TableCell>{productData.name}</TableCell>
                        <TableCell>{productData.quantity}</TableCell>
                        <TableCell>{productData.price}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => removeProductFromSale(index)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
              <br/>
                <TextField
                  fullWidth
                  id="total-input"
                  label="Total"
                  type="number"
                  value={budget}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ width: '100%', backgroundColor: '#f5f5f5' }}
                />
                <br/>
                <br/>
                <Stack
  direction="row"
  spacing={2} 
  justifyContent="flex-end" 
>
  <Button type="submit" variant="contained">
    Submit
  </Button>
  <Button variant="outlined" onClick={handleClearForm}>
    Return
  </Button>
</Stack>
               
              </form>
            </BaseCard>
          </Grid>
        </Grid>
      </FullLayout>
    </ThemeProvider>
  );
  
  
};

export default UpdateSale