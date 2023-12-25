import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Link } from 'react-router-dom';
import IconButton from "@mui/material";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import pimg from '../../assets/img/860814.png';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField } from "@mui/material";
import './pag.css';
import {
  Grid,
  Button,
  Stack,
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
} from "@mui/material";
import BaseCard from "../baseCard/BaseCard";
import axios from "axios";
import CustomPag from "../pagination/CustomPag";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const CategoryPerformance = () => {
  const [Category, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user-info'));

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8008/caisse/api/categorie/all');
        setCategories(res.data);
        setCategoryId(res.data);
        console.log(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = () => {
    Axios.delete(`http://localhost:8008/caisse/api/categorie/delcat/${categoryId}`)
      .then(response => {
        console.log(response.data);
        window.location.reload();
        toast.success("Category deleted successfully!");
      })
      .catch(error => {
        console.error(error);
        setOpenDialog(false);
        setErrorMessage("Category is Used. Please try again later.");
        setOpenErrorDialog(true);

        if (error.response && error.response.status === 500) {
          toast.error("Category is Used. Please try again later.");
        }
      })
      .finally(() => {
        setOpenDialog(false);
      });
  };

  const openConfirmationDialog = (id) => {
    setCategoryId(id);
    setOpenDialog(true);
  };

  const closeConfirmationDialog = () => {
    setOpenDialog(false);
  };

  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/AddCategory');
  };

  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const filteredCat = Category.filter((cat) =>
    String(cat.libelleCat).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(cat.description).toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredCat.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div>
      <BaseCard title="Category Performance">
        {user.role === 'admin' ?
          <>
            <Button variant="contained" style={{ marginTop: '-60px', marginBottom: '30px' }} color="primary" onClick={handleButtonClick}>Add Category</Button>
            <br />
          </>
          : <></>
        }

        <TextField
          fullWidth
          id="search-input"
          label="Search by Category Name"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '100%', backgroundColor: '#f5f5f5' }}
        />
        <br />
        <br />
        <br />
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
                  }}>
                  Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6" sx={{
                  fontWeight: "600",
                }}>
                  Description
                </Typography>
              </TableCell>
              {
                user.role === 'admin' ?
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
                    <TableCell align="right">
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "600",
                        }}
                      >
                        Delete
                      </Typography>
                    </TableCell>
                  </>
                  :
                  <></>}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPosts.map((cat) => (
              <TableRow key={cat.libelleCat}>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                  >
                    {cat.libelleCat}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    {cat.description}
                  </Typography>
                </TableCell>
                {
                  user.role === 'admin' ?
                    <>
                      <TableCell  >
                        <Link to={`updateCategory/${cat.idCategorie}`}><ModeEditIcon /></Link>
                      </TableCell>
                      <TableCell align="right" >
                        <>
                          <button onClick={() => openConfirmationDialog(cat.idCategorie)} style={{ border: 'none', background: 'none' }}>
                            <DeleteOutlineIcon />
                          </button>

                          <Dialog open={openDialog} onClose={closeConfirmationDialog} maxWidth="xs" fullWidth>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogContent>
                              <Typography variant="body1">Are you sure you want to delete this category?</Typography>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleDelete} variant="contained" color="secondary">
                                Yes
                              </Button>
                              <Button onClick={closeConfirmationDialog} variant="contained">
                                No
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </>
                      </TableCell>
                    </>
                    :
                    <>
                    </>
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ReactPaginate
          onPageChange={paginate}
          pageCount={Math.ceil(Category.length / postsPerPage)}
          previousLabel={'Prev'}
          nextLabel={'Next'}
          containerClassName={'pagination'}
          pageLinkClassName={'page-number'}
          previousLinkClassName={'page-number'}
          nextLinkClassName={'page-number'}
          activeLinkClassName={'active'}
        />
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </BaseCard>
    </div>
  );
};

export default CategoryPerformance;
