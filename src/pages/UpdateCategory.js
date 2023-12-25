import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams,  useNavigate } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from '../theme/theme';
import FullLayout from "../components/layouts/FullLayout";
import Axios from 'axios';
import {
    Grid,
    Stack,
    TextField,
    Button,
  } from "@mui/material";
import BaseCard from '../components/baseCard/BaseCard';

const UpdateCategory = () => {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');
  const [description, setDescription] = useState('');
  const history = useNavigate();
  const [errors, setErrors] = useState({});
  const [Category, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8008/caisse/api/categorie/getbyid/${id}`)
      .then(response => {
        const {idCategorie,libelleCat, description } = response.data;
        setName(libelleCat);
        setNewName(libelleCat)
        setDescription(description);
        console.log(libelleCat)
      })
      .catch(error => console.log(error));
  }, [id]);
  

  useEffect(() => {
    Axios.get('http://localhost:8008/caisse/api/categorie/all')
    .then((response) => {
      setCategories(response.data);
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);


  const options = Category.map((category) => ({
    id: category.idCategorie,
    name: category.libelleCat,
  }));
  const validateForm = () => {
    let isValid = true;
    let errors = {};
    if(!(name ==newName)) {
    if (options.find((p) => p.name.toLowerCase() === newName.toLowerCase())) {
      errors.name = "Category name already exists";
      console.log(errors.name);
      isValid = false;
    }}
    if (!newName) {
      errors.name = "Category name is required";
      isValid = false;
    }
   
    if (!description) {
      errors.description = "Category description is required";
      isValid = false;
    }
    
    setErrors(errors);
    return isValid;
  };


  const handleNameChange = event => {
    setNewName(event.target.value);
  };

  const handleDescriptionChange = event => {
    setDescription(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if(validateForm()){
    axios.put(`http://localhost:8008/caisse/api/categorie/updatecat/${id}`, data)
      .then(response => {
        console.log(response);
        history('/categories');
      })
      .catch(error => console.log(error));
  };
};


  const handleClearForm = () => {
    history('/Categories')
  };

  const data={
    libelleCat: newName,
    description : description,
};
  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <FullLayout>
    <Grid container spacing={0}>
      <Grid item xs={12} lg={12} sx={{ textAlign: 'left' }}>
        <BaseCard title="Update Categorie" >
        <form onSubmit={handleSubmit} >
        <Stack spacing={1} sx={{ marginTop: '-50px', paddingTop: '10px' }} >
            <TextField
              id="name"
              label="Category Name"
              variant="outlined"
              value={newName}
              onChange={handleNameChange}
              error={!!errors.name}
               helperText={errors.name}
               onFocus={() => setErrors({ ...errors, name: '' })}

            />
            
            <TextField
              id="description"
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              error={!!errors.description}
              helperText={errors.description}
              onFocus={() => setErrors({ ...errors, description: '' })}
            />
          </Stack>
          <br />
          <Button type="submit" variant="contained">
            Update Category
          </Button>
          <Button variant="outlined" sx={{ ml: '10px' }} onClick={handleClearForm}>
  Return
</Button>
        </form>
        </BaseCard>
      </Grid>
    </Grid>
      </FullLayout>
      </ThemeProvider>
  );
};

export default UpdateCategory;