import { Route, Routes, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import { Toaster } from "react-hot-toast";
import HotelReg from "./components/HotelReg.jsx";
import { useAppContext } from "./context/AppContext.jsx";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("/owner");
  const { showHotelReg } = useAppContext()
  return (
    <div>
      <Toaster/>
      {!isOwnerPath && <Navbar/>}
      {showHotelReg && <HotelReg/>}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/rooms" element={<AllRooms/>}/>
          <Route path="/rooms/:roomId" element={<RoomDetails/>}/>
          <Route path="/my-bookings" element={<MyBookings/>}/>
        </Routes>
      </div>
      <Footer/>
    </div>
  );
};

export default App;
