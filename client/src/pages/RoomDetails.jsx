import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  assets,
  facilityIcons, roomCommonData,
} from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const { roomId } = useParams();
  const { rooms, getToken, axios, navigate } = useAppContext()
  const [ room, setRoom ] = useState(null);
  const [ mainImage, setMainImage ] = useState(null);
  const [ checkInDate, setCheckInDate ] = useState(null);
  const [ checkOutDate, setCheckOutDate ] = useState(null);
  const [ guests, setGuests ] = useState(1);
  const [ isAvailable, setIsAvailable ] = useState(false);
  const [ loading, setLoading ] = useState(false)
  
  const checkAvailability = async () => {
    try {
      // check if checkIn date is greater than checkOut date
      if (checkInDate >= checkOutDate) {
        toast.error('Check-In Date should be less than Check-Out Date')
        return;
      }
      
      const { data: response } = await axios.post('/api/bookings/check-availability', {
        room: roomId,
        checkInDate,
        checkOutDate,
      }, { headers: { Authorization: `Bearer ${await getToken()}` } })
      
      if (response.success) {
        if (response.data) {
          setIsAvailable(true);
          toast.success('Room is available')
        } else {
          setIsAvailable(false);
          toast.error('Room is not available')
        }
      } else {
        toast.error(response.message || 'Failed to check room availability.')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      if (!isAvailable) {
        return checkAvailability()
      }
      const { data: response } = await axios.post('/api/bookings/book', {
        room: roomId,
        checkInDate,
        checkOutDate,
        guests, paymentMethod: 'Pay At Hotel',
      }, { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (response.success) {
        toast.success('Room booked successfully')
        navigate('/my-bookings')
        scrollTo(0, 0)
      } else {
        toast.error(response.message || 'Failed to book room.')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    const room = rooms.find((item) => item._id === roomId);
    if (room) {
      setRoom(room);
      setMainImage(room.images[0]);
    }
  }, [ rooms ]);
  
  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Room details */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name}{" "}
            <span className="font-inter text-sm">({room.roomType})</span>
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>
        
        {/* Room rating */}
        <div className="flex items-center gap-1 mt-2">
          <StarRating/>
          <p className="ml-2">200_ reviews</p>
        </div>
        
        {/* room address */}
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt=""/>
          <span>{room.hotel.address}</span>
        </div>
        
        {/* room images */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              className="w-full rounded-xl shadow-lg object-cover"
              alt="room image"
              loading="lazy"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  src={image}
                  key={index}
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                    mainImage === image && "outline-3 outline-orange-500"
                  }`}
                  alt=""
                />
              ))}
          </div>
        </div>
        
        {/* Room highlights */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                >
                  <img src={facilityIcons[item]} className="size-5" alt=""/>
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* room price */}
          <p className="text-2xl font-medium">${room.pricePerNight} /night</p>
        </div>
        
        {/* CheckIn checkout form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl">
          <div
            className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>
              <input
                type="date"
                id="checkInDate"
                placeholder="Check-In"
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div className="flex flex-col">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>
              <input
                type="date"
                id="checkOutDate"
                placeholder="Check-Out"
                min={checkInDate}
                disabled={!checkInDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>
              <input
                type="number"
                id="guests"
                placeholder="1"
                value={guests}
                onChange={(e) => setGuests(+e.target.value)}
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base ${loading ? 'bg-primary/80 cursor-not-allowed' : ''}`}>
            {isAvailable ? 'Book Now' : 'Check Availability'}
          </button>
        </form>
        
        {/* Common specifications */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img src={spec.icon} className="w-6.5" alt=""/>
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>
            Guests will be allocated on the ground floor according to
            availability. You get a comfortable Two bedroom apartment has a true
            city feeling. The price quoted is for two guests, at the guest slot
            please mark the number of guests to get the excact price for groups.
            The guests will be allocated ground floor according to availability.
            You get the comfortable two bedroom apartment that has a true city
            felling.
          </p>
        </div>
        
        {/* Hosted by */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-4">
            <img
              src={room.hotel.owner.image}
              className="size-14 md:size-18 rounded-full"
              alt=""
            />
            <div>
              <p className="text-lg md:text-xl">Hosted by {room.hotel.name}</p>
              <div className="flex items-center mt-1">
                <StarRating/>
                <p className="ml-2">200+ reviews</p>
              </div>
            </div>
          </div>
          
          <button
            className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary/90 transition-all cursor-pointer">
            Contact Now
          </button>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
