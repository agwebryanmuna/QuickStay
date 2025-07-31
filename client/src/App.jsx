import { Navigate, Route, Routes, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import { Toaster } from "react-hot-toast";
import HotelReg from "./components/HotelReg.jsx";
import { useAppContext } from "./context/AppContext.jsx";
import Layout from "./pages/hotelOwner/Layout.jsx";
import Dashboard from "./pages/hotelOwner/Dashboard.jsx";
import AddRoom from "./pages/hotelOwner/AddRoom.jsx";
import ListRoom from "./pages/hotelOwner/ListRoom.jsx";
import ExperiencePage from "./pages/ExperiencePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("/owner");
  const { showHotelReg, isOwner } = useAppContext()
  return (
    <div>
      <Toaster/>
      {!isOwnerPath && <Navbar/>}
      {showHotelReg && <HotelReg/>}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/rooms" element={<AllRooms/>}/>
          <Route path="/experience" element={<ExperiencePage/>}/>
          <Route path="/about" element={<AboutPage/>}/>
          <Route path="/rooms/:roomId" element={<RoomDetails/>}/>
          <Route path="/my-bookings" element={<MyBookings/>}/>
          <Route path="/owner" element={isOwner ? <Layout/> : <Navigate to={'/'}/>}>
            <Route index element={<Dashboard/>}/>
            <Route path="add-room" element={<AddRoom/>}/>
            <Route path="list-room" element={<ListRoom/>}/>
          </Route>
        </Routes>
      </div>
      <Footer/>
    </div>
  );
};

export default App;
