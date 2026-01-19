import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import AdminSidebar from './adminSidebar';
import AdminHeader from './adminHeader';

const AdminComponentLayout = () => {
     const [openSideBar, setOpenSideBar] = useState(false);
  return (
    <div className='flex min-h-screen w-full'>
        {/* Admin Sidebar */}
        <AdminSidebar open={openSideBar} setOpen={setOpenSideBar} />
        <div className='flex flex-1 flex-col'>
            {/* admin header content */}
            <AdminHeader setOpen={setOpenSideBar}/>
            <main className='flex flex-1 bg-muted/40 p-4 md:p-6'>
                <Outlet/>
            </main>

        </div>
      
    </div>
  )
}

export default AdminComponentLayout
