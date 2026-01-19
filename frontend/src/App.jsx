import { Navigate, Route, Routes } from "react-router-dom"
import AuthComponentsLayout from "./components/authComponents/authComponentsLayout"
import Login from "./pages/authPage/login"
import Register from "./pages/authPage/register"
import AdminComponentLayout from "./components/adminComponents/adminComponentLayout"
import Dashboard from "./pages/adminPage/dashboard"
import Orders from "./pages/adminPage/orders"
import Products from "./pages/adminPage/products"
import ShoppingComponentLayout from "./components/shoppingComponents/shoppingComponentLayout"
import NotFound from "./pages/notFoundPage/notFound"
import Home from "./pages/shoppingPage/home"
import Account from "./pages/shoppingPage/account"
import ProductList from "./pages/shoppingPage/productList"
import Checkout from "./pages/shoppingPage/checkout"
import CheckAuth from "./components/common/checkAuth" // Import the CheckAuth component
import UnAuthorized from "./pages/NotAuthorizedPage/unAuthorized"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { checkAuth } from "./store/auth-slice/authSlice"
import Loader from "./components/Loader"


function App() {
  // const isAuthenticated = false // Replace with actual authentication logic
  // const user = null
  // const isLoading = true;

  //
  const {isAuthenticated, user, isLoading } = useSelector(state => state.auth );
  const dispatch = useDispatch();

  useEffect(() =>{
    // Dispatch the checkAuth action to verify user authentication status
    dispatch(checkAuth());
  }, [dispatch]);

  if(isLoading) return <Loader/>
  console.log("App jsx page", isAuthenticated, user);
  
  return (
    <>
    <div className="flex flex-col overflow-hidden bg-white">

      {/* Render the Routes */}
      <Routes>
        {/* Auth Routes */}
          <Route path="/auth" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}> 
              <AuthComponentsLayout/> 
            </CheckAuth>} >                             

              <Route path="login" element={<Login/>} />
              <Route path="register" element={<Register/>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}> 
              <AdminComponentLayout/> 
            </CheckAuth>
            }>

            {/* Future admin routes will go here */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
          </Route>

          {/* Shopping Routes */}

          <Route path="/shop" element={ 
            <CheckAuth isAuthenticated={isAuthenticated} user={user}> 
              <ShoppingComponentLayout />
            </CheckAuth>
            
            }>

            {/* Future shopping routes will go here */}
            <Route path="home" element={<Home />} />
            <Route path="account" element={<Account />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="list" element={<ProductList />} />

          </Route>

          {/* NOT FOUND PAGE ROUTE */}
          <Route path="*" element={<NotFound/>} />
          <Route path="/unauthorized" element={<UnAuthorized/>} />

      </Routes>

    </div>
     
    </>
  )
}

export default App
