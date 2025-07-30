// GET /api/user/

export const getUserData = (req, res) => {
  
  const role = req.user.role;
  const recentSearchedCities = req.user.recentSearchedCities;
  
  res.status(200).json({ success: true, data: { role, recentSearchedCities } });
  
}

// store user recently searched cities
export const storeRecentSearchedCities = async (req, res) => {
  
  const { recentSearchedCities } = req.body;
  const user = req.user;
  
  if (user.recentSearchedCities.length < 3) {
    user.recentSearchedCities.push(recentSearchedCities);
  } else {
    user.recentSearchedCities.shift();
    user.recentSearchedCities.push(recentSearchedCities);
  }
  
  await user.save();
  
  res.status(200).json({ success: true, message: 'City added!' });
  
}
