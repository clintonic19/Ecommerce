import React from 'react'
import { Outlet } from 'react-router-dom'
import ShoppingHeader from './shoppingHeader'

const ShoppingComponentLayout = () => {
  return (
    <div className='flex flex-col bg-white overflow-hidden'>
        {/* common header */}
        <ShoppingHeader/>
        <main className='flex flex-col w-full'>
            {/* Outlet for nested routes */}
            <Outlet/>
        </main>
      
    </div>
  )
}

export default ShoppingComponentLayout
