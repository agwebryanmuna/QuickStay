import { Route, Routes, useLocation } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("/owner");
  return (
    <div>
      {!isOwnerPath && <Navbar />}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:roomId" element={<RoomDetails />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
