import { Navigate, Outlet, useLocation } from 'react-router-dom';

const CheckAuth = ({ isAuthenticated, user, children }) => {

    const location = useLocation();

    console.log("CheckAuth component", isAuthenticated, user, location.pathname);

    // Check if user is not authenticated and trying to access protected routes
    if(!isAuthenticated && !(location.pathname.includes('/login') || location.pathname.includes('/register'))) {
        // If the user is not authenticated, redirect to login page
        return <Navigate to="/auth/login" />
    };

    // Check if user is authenticated and trying to access auth pages
     if(isAuthenticated && (location.pathname.includes('/login') || location.pathname.includes('/register'))) {
        // If the user is authenticated, redirect to appropriate dashboard based on role  
        if(user?.role === 'admin' ){
            return <Navigate to="/admin/dashboard" />
        }else{
            return <Navigate to="/shop/home" />
        };
    };

    // Check if user is authenticated and trying to access admin routes without admin role
    if(isAuthenticated && user?.role !== 'admin' && location.pathname.includes('admin')){
        return <Navigate to="/unauthorized" />
    };

    // Check if user is authenticated and trying to access shop routes with admin role
      if(isAuthenticated && user?.role === 'admin' && location.pathname.includes('shop')){
        return <Navigate to="/admin/dashboard" />
    };

    return <>{children}</>
}

export default CheckAuth;
