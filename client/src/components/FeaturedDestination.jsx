import HotelCard from "./HotelCard";
import Title from "./Title";
import { useAppContext } from "../context/AppContext.jsx";

const FeaturedDestination = () => {
  const { navigate, rooms } = useAppContext();
  
  return rooms.length > 0 && (
    <>
      <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index}/>
        ))}
      </div>
      
      <button
        onClick={() => {
          navigate("/rooms");
          scrollTo(0, 0);
        }}
        className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
      >
        View All Destinations
      </button>
    </>
  );
};

export default FeaturedDestination;
