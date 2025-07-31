import { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";


const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth()
  
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const navigate = useNavigate();
  
  const [ isOwner, setIsOwner ] = useState(false);
  const [ showHotelReg, setShowHotelReg ] = useState(false);
  const [ searchedCities, setSearchedCities ] = useState([]);
  const [ rooms, setRooms ] = useState([]);
  
  
  const [ isLoading, setIsLoading ] = useState(false);
  
  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const token = await getToken()
      const { data: response } = await axios.get(`/api/users`, { headers: { Authorization: `Bearer ${token}` } })
      if (response.success) {
        setIsOwner(response.data.role === 'hotelOwner');
        setSearchedCities(response.data.recentSearchedCities);
      } else {
        toast.error(response.message || "Could not fetch user data.")
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchRooms = async () => {
    try {
      const { data: response } = await axios.get('/api/rooms')
      console.log(response)
      if (response.success) {
        setRooms(response.data)
      } else {
        toast.error(response.message || "Failed to fetch rooms")
      }
    } catch (e) {
      console.log(e)
    }
  }
  
  useEffect(() => {
    console.log(user)
    if (user) {
      fetchUser()
    }
  }, [ user ]);
  
  useEffect(() => {
    fetchRooms()
  }, []);
  
  
  const value = {
    currency,
    navigate,
    getToken,
    user,
    isOwner,
    setIsOwner,
    showHotelReg,
    setShowHotelReg,
    axios,
    searchedCities,
    setSearchedCities,
    isLoading,
    rooms, setRooms,
  }
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppContextProvider");
  return context
}
