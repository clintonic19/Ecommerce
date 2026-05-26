import React from 'react'
import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from '../../store/auth-slice/authSlice';
import { toast } from 'sonner';

const AdminHeader = ({ setOpen }) => {
const dispatch = useDispatch();

  function handleLogout(data) {
    dispatch(logoutUser());
    console.log("Logout successful");
    toast.success(data?.payload?.message || "Logout successful", {
      variant: "success", 
      position: "top-right",
    });       
  };

  return (
    // Admin Header
    <header className="flex items-center justify-between  px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        {/* Toggle Menu */}
        <span className="sr-only ">Toggle Menu</span>

      {/* Logout Button Session */}
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center bg-red-600 rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader
