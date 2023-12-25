import './App.css';
import UserTable from './UserTable';
import ProductTable from './ProductTable';
import CategoryTable from './CategoryTable';
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom';
import Tables from './SaleTable';
import AddCategory from './AddCategory';
import AddProduct from './AddProduct';
import UpdateProduct from './UpdateProduct';
import UpdateCategory from './UpdateCategory';
import AddUser from './AddUser';
import AddSale from './AddSale';
import LoginPage from './LoginPage';
import UpdateUser from './UpdateUser';
import Stats from './Stats';
import Register from './Register';



export default function MyApp() {
  const user=JSON.parse(localStorage.getItem('user-info')) 
  return (

    <Router>
      {
        localStorage.getItem('user-info')?
          user.role=='admin'?
        <Routes>
        <Route path='/' element={<Tables/>}/>
      <Route path='/User' element={<UserTable/>}/>
      <Route path='/Product' element={<ProductTable/>}/>
      <Route path='/Categories' element={<CategoryTable/>}/>
      <Route path='/AddCategory' element={<AddCategory/>}/>
      <Route path='/AddProduct' element={<AddProduct/>}/>
      <Route path='/AddUser' element={<AddUser/>}/>
      <Route path='/AddSale' element={<AddSale/>}/>
      <Route path='/Product/updateProduct/:id' element={<UpdateProduct/>}/>
      <Route path='/Categories/updateCategory/:id' element={<UpdateCategory/>}/>
      <Route path='/User/updateUser/:id' element={<UpdateUser/>}/>
      <Route path='/login' element={<LoginPage/>}/>
       <Route path='/Manage' element={<Stats/>}/> 
         </Routes>
         :
         <Routes>
      <Route path='/' element={<Tables/>}/>
      <Route path='/Product' element={<ProductTable/>}/>
      <Route path='/Categories' element={<CategoryTable/>}/>
      <Route path='/AddSale' element={<AddSale/>}/>
      <Route path='/login' element={<LoginPage/>}/>
       <Route path='/Manage' element={<Stats/>}/> 
         </Routes>
      :
      <Routes>
        <Route path='/Register' element={<Register/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        </Routes>
      }

    </Router>
  );
}