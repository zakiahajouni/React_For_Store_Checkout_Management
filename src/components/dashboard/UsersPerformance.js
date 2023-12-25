import React, { useState, useEffect } from "react";
import Axios from 'axios';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Link } from 'react-router-dom';
import IconButton from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Grid, Button, ButtonGroup } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { TextField } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import BaseCard from "../baseCard/BaseCard";
import Chip from "@mui/material/Chip";

const UsersPerformance = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(4);
  const [openDialog, setOpenDialog] = useState(false);
  const [userId, setUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = user.filter((u) =>
    String(u.nomEmploye).toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await Axios.get('http://localhost:8008/caisse/api/employes/all');
      setUser(res.data);
      console.log(res.data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredUsers.slice(indexOfFirstPost, indexOfLastPost);

  const deleteUser = async (id) => {
    try {
      const response = await Axios.delete(`http://localhost:8008/caisse/api/employes/delete/${id}`);
      console.log(response.data);
      window.location.reload();
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error(error);
      setOpenDialog(false);
      toast.error("Can't delete the user");

      if (error.response && error.response.status === 500) {
        toast.error("Can't delete the user.");
      }
    } finally {
      setOpenDialog(false);
    }
  };

  const openConfirmationDialog = (id) => {
    setUserId(id);
    setOpenDialog(true);
  };

  const closeConfirmationDialog = () => {
    setOpenDialog(false);
  };

  const navigate = useNavigate();
  const handleButtonClick = () => {
    navigate('/AddUser');
  };

  const paginate = ({ selected }) => {
    setCurrentPage(selected + 1);
  };

  return (
    <BaseCard title="Users Performance">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "50px" , marginTop:"-50px"}}>
        <Button variant="contained" color="primary" onClick={handleButtonClick}>Add User</Button>
      </div>
      <div>
        <TextField
          fullWidth
          id="search-input"
          label="Search by Name"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: '100%', backgroundColor: '#f5f5f5' }}
        />
        <br/>
        <br/>
        <br/>
        <br/>
        <Table
          aria-label="simple table"
          sx={{
            mt: -7,
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
                  Email
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "600",
                  }}
                >
                  Role
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "600",
                  }}
                >
                  Phone
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "600",
                  }}
                >
                  Join Time
                </Typography>
              </TableCell>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPosts.map(user => (
              <TableRow key={user.login}>
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: "500",
                    }}
                    color="textSecondary"
                  >
                    {user.nomEmploye}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    {user.mail}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="h6">
                    {user.role}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={user.tel}
                  ></Chip>
                </TableCell>
                <TableCell>
                  <Typography variant="h6" color="textSecondary">
                    {new Date(user.dateofjoin).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Typography>
                </TableCell>
                <TableCell  >
                  <Link to={`updateUser/${user.idEmploye}`}><ModeEditIcon/></Link>
                </TableCell>
                <TableCell align="right" >
                  <button onClick={() => openConfirmationDialog(user.idEmploye)} style={{ border: 'none', background: 'none' }}>
                    <DeleteOutlineIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <ReactPaginate
          onPageChange={paginate}
          pageCount={Math.ceil(user.length / postsPerPage)}
          previousLabel={'Prev'}
          nextLabel={'Next'}
          containerClassName={'pagination'}
          pageLinkClassName={'page-number'}
          previousLinkClassName={'page-number'}
          nextLinkClassName={'page-number'}
          activeLinkClassName={'active'}
        />
        <Dialog open={openDialog} onClose={closeConfirmationDialog} maxWidth="xs" fullWidth>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography variant="body1">Are you sure you want to delete this User?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={deleteUser} variant="contained" color="secondary">
              Yes
            </Button>
            <Button onClick={closeConfirmationDialog} variant="contained">
              No
            </Button>
          </DialogActions>
        </Dialog>
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </BaseCard>
  );
};

export default UsersPerformance;
