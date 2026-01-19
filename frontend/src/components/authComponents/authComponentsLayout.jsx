import React from 'react'
import { Outlet } from 'react-router-dom'

function AuthComponentsLayout() {
  return (
  <>
      <div className='flex min-h-screen w-full'>
            <div className=' hidden lg:flex items-center justify-center bg-black w-1/2 px-12'>
                <div className='max-w-md space-y-6 text-center primary-text'>
                    <h1 className='text-4xl font-extrabold tracking-tight text-white'>Join the Future of eCommerce</h1>
                    <span className=' mt-4 text-lg text-white'>
                        Grow Faster with a Community That Cares.
                        Network with sellers, buyers, and innovators. 
                        Explore opportunities, share ideas, and build your eCommerce success story.
                    </span>
                </div>
            </div>

            {/* Right Side - Auth Form Render Common Components */}

            <div className='flex flex-1 items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8'>
                <Outlet/>
            </div>

        </div>

       
  </>
  )
}

export default AuthComponentsLayout;
