import React, { useEffect, useState } from 'react'
import Title from "../../components/Title.jsx";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";
import Loader from "../../components/Loader.jsx";

const ListRoom = () => {
  
  const [ rooms, setRooms ] = useState([])
  
  const { currency, axios, getToken, user } = useAppContext()
  
  const [ loading, setLoading ] = useState(false);
  
  
  // Fetch Rooms for the hotel owner
  const fetchRooms = async () => {
    setLoading(true)
    try {
      const { data: response } = await axios.get('/api/rooms/owner/', { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (response.success) {
        setRooms(response.data)
      } else {
        toast.error(response.message || "Failed to fetch rooms")
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
  
  // toggle availability of the room
  const toggleAvailability = async (roomId) => {
    try {
      const { data: response } = await axios.post('/api/rooms/toggle-availability/', { roomId }, { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (response.success) {
        toast.success(response.message || "Room availability toggled successfully")
        await fetchRooms()
      } else {
        toast.error(response.message || "Failed to toggle room availability")
      }
    } catch (e) {
      console.log(e)
    }
    
  }
  
  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [ user ])
  return (
    <div>
      <Title align="left" font={'outfit'} title={'Room Listings'}
             subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."/>
      <p className="text-gray-500 mt-8">All Rooms</p>
      
      {loading ? <div className="mt-4"><Loader/></div> :
        <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll mt-3">
          <table className="w-full">
            <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">Facility</th>
              <th className="py-3 px-4 text-gray-800 font-medium">Price / Night</th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">Action</th>
            </tr>
            </thead>
            
            <tbody className="text-sm">
            {rooms.map((room, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300">{room.roomType}</td>
                <td
                  className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden">{room.amenities.join(', ')}</td>
                <td
                  className="py-3 px-4 text-gray-700 border-t border-gray-300">{currency} {room.pricePerNight}</td>
                <td className="py-3 px-4 border-t border-gray-300 text-sm text-red-500 text-center">
                  <label
                    className={`relative inline-flex items-center cursor-pointer text-gray-900 gap-3`}>
                    <input type="checkbox" onChange={() => toggleAvailability(room._id)}
                           className="sr-only peer"
                           checked={room.isAvailable}/>
                    <div
                      className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"/>
                    <span
                      className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"/>
                  </label>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        
        </div>}
    </div>
  )
}
export default ListRoom
