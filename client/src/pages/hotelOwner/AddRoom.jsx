import React, { useState } from 'react'
import Title from "../../components/Title.jsx";
import { assets } from "../../assets/assets.js";
import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";

const AddRoom = () => {
  
  const { axios, getToken } = useAppContext();
  const [ loading, setLoading ] = useState(false)
  
  const [ images, setImages ] = useState({ 1: null, 2: null, 3: null, 4: null });
  const [ inputs, setInputs ] = useState({
    roomType: '',
    pricePerNight: 0,
    amenities: {
      'Free Wifi': false,
      'Free Breakfast': false,
      'Room Service': false,
      'Mountain View': false,
      'Pool Access': false
    }
  })
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // check if all inputs are filled
    if (!inputs.roomType || !inputs.pricePerNight || !inputs.amenities || !Object.values(images).some(image => image)) {
      toast.error('Please fill in all the details')
      setLoading(false)
      return;
    }
    
    const formData = new FormData();
    formData.append('roomType', inputs.roomType);
    formData.append('pricePerNight', inputs.pricePerNight);
    
    // converting amenities to array and keeping only the enabled amenities
    const amenities = Object.keys(inputs.amenities).filter(key => inputs.amenities[key]);
    formData.append('amenities', JSON.stringify(amenities));
    
    // Adding images to formData
    const imagesKeys = Object.keys(images)
    for (const key of imagesKeys) {
      images[key] && formData.append('images', images[key])
    }
    console.log(formData)
    try {
      const { data: response } = await axios.post('/api/rooms/create/', formData, { headers: { Authorization: `Bearer ${await getToken()}` } })
      if (response.success) {
        toast.success(response.message || "Room added successfully")
        setInputs({
          roomType: '',
          pricePerNight: 0,
          amenities: {
            'Free Wifi': false,
            'Free Breakfast': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false
          }
        })
        setImages({ 1: null, 2: null, 3: null, 4: null })
      } else {
        toast.error(response.message || "Failed to add room")
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <Title align='left' font='outfit' title='Add Room'
             subTitle='Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience.'/>
      
      
      {/*  Upload Area for images */}
      <p className='text-gray-800 mt-10'>Images</p>
      <div className='grid grid-cols-2 sm:flex gap-4 my-2 flex-wrap'>
        {Object.keys(images).map((key, index) => (
          <label htmlFor={`roomImage${key}`} key={index}>
            <img src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea} alt={`roomImage${key}`}
                 className='max-h-13 cursor-pointer opacity-80'/>
            <input type='file' accept='image/*' id={`roomImage${key}`} hidden
                   onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })}/>
          </label>
        ))}
      </div>
      
      <div className='w-full flex max-sm:flex-col sm:gap-4 mt-4'>
        <div className='flex-1 max-w-48'>
          <p className='text-gray-800 mt-4'>Room Type</p>
          <select required value={inputs.roomType} onChange={e => setInputs({ ...inputs, roomType: e.target.value })}
                  className='border opacity-70 border-gray-300 mt-1 rounded p-2 w-full'>
            <option value=''>Select Room Type</option>
            <option value='Single Bed'>Single Bed</option>
            <option value='Double Bed'>Double Bed</option>
            <option value='Luxury Room'>Luxury Room</option>
            <option value='Family Suite'>Family Suite</option>
          
          </select>
        
        </div>
        
        <div>
          <p className='mt-4 text-gray-800'>Price <span className='text-xs'>/night</span></p>
          <input required type='number' placeholder='0' className='border border-gray-300 mt-1 rounded p-2 w-24'
                 value={inputs.pricePerNight} onChange={e => setInputs({ ...inputs, pricePerNight: +e.target.value })}/>
        </div>
      </div>
      
      <p className='text-gray-800 mt-4'>Amenities</p>
      <div className='flex flex-col flex-wrap mt-1 text-gray-400 max-w-sm'>
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index}>
            <input type='checkbox' id={`amenities${index + 1}`} checked={inputs.amenities[amenity]}
                   onChange={() => setInputs({
                     ...inputs,
                     amenities: { ...inputs.amenities, [amenity]: !inputs.amenities[amenity] }
                   })}/>
            <label htmlFor={`amenities${index + 1}`} className='ml-2'>{amenity}</label>
          </div>
        ))}
      
      </div>
      
      <button type={"submit"} disabled={loading}
              className={`bg-primary text-white px-8 py-2 rounded mt-8 cursor-pointer ${loading ? "cursor-not-allowed bg-primary/50" : ''}`}>
        {loading ? 'Adding...' : 'Add Room'}
      </button>
    </form>
  )
}
export default AddRoom
