import axios from "axios";
import hospitals from "../DB/hospitals.data.js"; 

const findNearestHospital = (lat, lng) => {
  let nearest = { distance: Infinity };
  
  hospitals.forEach(hospital => {
    const distance = calculateDistance(lat, lng, hospital.lati, hospital.logi);
    if (distance < nearest.distance) {
      nearest = { hospital, distance };
    }
  });
  
  return nearest;
};


  // Implement your Haversine formula
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c; // in meters
  }
  

export const sendEmergencyAlert = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const { hospital, distance } = findNearestHospital(latitude, longitude);

    // Twilio integration
    const message = `EMERGENCY ALERT! Patient at: https://www.google.com/maps?q=${latitude},${longitude}`;
    
    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      new URLSearchParams({
        To: hospital.phone,
        From: "+12062224885",
        Body: message
      }),
      {
        auth: {
          username: 'MG55c9d5d9db7ae7b73046c23f1851a036',
          password: '06ddf777b7aa315e00acf74646b77952'
        }
      }
    );

    res.status(200).json({ 
      success: true,
      hospital: hospital.name,
      distance: distance.toFixed(2)
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Emergency alert failed'
    });
  }
};