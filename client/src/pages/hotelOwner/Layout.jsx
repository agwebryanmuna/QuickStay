import React from 'react'
import Navbar from "../../components/hotelOwner/Navbar.jsx";
import Sidebar from "../../components/hotelOwner/Sidebar.jsx";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar/>
      <div className='flex h-full'>
        <Sidebar/>
        <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
          <Outlet/>
        </div>
      </div>
    </div>
  )
}
export default Layout
