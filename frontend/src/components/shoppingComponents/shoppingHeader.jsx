import { House, LogOut, Menu, ShoppingCart, User  } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { menuItemsHeaders } from '../../config/config';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { logoutUser } from '../../store/auth-slice/authSlice'
import { toast } from 'sonner'


// Menu items component for Desktop Navigation or Large Devices
const MenuItems = () => {
  return(
    <>
          <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
          {menuItemsHeaders?.map((menu) => (
            <Link
              // onClick={() => (MenuItems)}
              className="text-sm font-medium cursor-pointer"
              key={menu?.id}
              to={menu?.path}
            >
              {menu?.label}
            </Link>
          ))}
        </nav>
    </>
  )
};
 
// Header component for shopping page
const HeaderRightContent = () =>{
  const{ user } = useSelector(state=>state.auth);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  // LOGOUT FUNCTION
   const handleLogout = (data)=> {
    dispatch(logoutUser());
    console.log("Logout successful");
    toast.success(data?.payload?.message || "Logout successful", {
      variant: "success", 
      position: "top-right",
    });       
  };

  return(
    <>
      <div className="flex lg:items-center lg:flex-row flex-col gap-6">
        <Button variant="outline" size="icon" >
          <ShoppingCart className='w-6 h-6'/>
          <span className="sr-only"> User Cart </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-black">
              <AvatarFallback className="bg-black text-white font-extrabold">
                {user?.firstName ? user.lastName.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger> 
            <DropdownMenuContent side="right" className="w-50">
              <DropdownMenuLabel>Logged in as {user?.firstName }</DropdownMenuLabel>
                <DropdownMenuSeparator/>

                {/* User Info */}
                <DropdownMenuItem onClick={()=>navigate('/shop/account')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator/>
                
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>

              </DropdownMenuContent>           
        </DropdownMenu>
      </div>
    </>
  )
}

const ShoppingHeader = () => {
  const{isAuthenticated, user } = useSelector(state=>state.auth);
  console.log("User Auth::: shop header", user);
  
  return (
  <>
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
            <House className="h-6 w-6"/>
            <span className="font-bold">Jolio Shopping</span>
        </Link>

        {/* Small or Mobile Phone device Session*/}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden" >
                <Menu className='h-6 w-6'/>
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>

          {/* Content session for small devices  */}
          <SheetContent side="left" className='w-full max-w-xs'>
              <MenuItems/> 
              <HeaderRightContent/>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation or Large Devices */}
        <div className="hidden lg:block">
          <MenuItems/>           
        </div>

        {/* Check auth user to display info */}
        {
          isAuthenticated ? <div className="hidden lg:block">
            <HeaderRightContent/>
          </div> : null
        }
        {/* <div className="hidden lg:block">
            <HeaderRightContent/>
        </div> */}

      </div>
    </header>

{/* /Footer session */}
        <footer>
          
        </footer>
  </>
  )
}

export default ShoppingHeader
