// Hospital data for Delhi, India
const hospitals = [
    {
      name: "All India Institute of Medical Sciences (AIIMS)",
      address: "Ansari Nagar East, New Delhi, Delhi 110029",
      phone: "+911126588500",
      logi: 77.2090,
      lati: 28.5672
    },
    {
      name: "Safdarjung Hospital",
      address: "Ansari Nagar West, New Delhi, Delhi 110029",
      phone: "+911126707000",
      logi: 77.2038,
      lati: 28.5693
    },
    {
      name: "Lok Nayak Hospital",
      address: "Jawahar Lal Nehru Marg, New Delhi, Delhi 110002",
      phone: "+911123232400",
      logi: 77.2311,
      lati: 28.6394
    },
    {
      name: "Ram Manohar Lohia Hospital",
      address: "Baba Kharak Singh Marg, New Delhi, Delhi 110001",
      phone: "+911123404446",
      logi: 77.2062,
      lati: 28.6273
    },
    {
      name: "Guru Teg Bahadur Hospital",
      address: "Tahirpur Road, Dilshad Garden, Delhi 110095",
      phone: "+911122586262",
      logi: 77.3142,
      lati: 28.6824
    },
    {
      name: "Moolchand Hospital",
      address: "Lala Lajpat Rai Marg, New Delhi, Delhi 110024",
      phone: "+911142000000",
      logi: 77.2372,
      lati: 28.5714
    },
    {
      name: "Max Super Speciality Hospital, Saket",
      address: "2, Press Enclave Road, Saket, New Delhi, Delhi 110017",
      phone: "+911126515050",
      logi: 77.2107,
      lati: 28.5280
    },
    {
      name: "Fortis Hospital, Vasant Kunj",
      address: "Sector B, Pocket 10, Aruna Asaf Ali Marg, Vasant Kunj, Delhi 110070",
      phone: "+911142776222",
      logi: 77.1579,
      lati: 28.5223
    },
    {
      name: "Indraprastha Apollo Hospitals",
      address: "Sarita Vihar, Delhi Mathura Road, New Delhi, Delhi 110076",
      phone: "+911171791090",
      logi: 77.2938,
      lati: 28.5421
    },
    {
      name: "Sir Ganga Ram Hospital",
      address: "Rajinder Nagar, New Delhi, Delhi 110060",
      phone: "+911125750000",
      logi: 77.1901,
      lati: 28.6387
    },
    {
      name: "Batra Hospital",
      address: "1, Tughlakabad Institutional Area, Mehrauli Badarpur Road, New Delhi, Delhi 110062",
      phone: "+911129958747",
      logi: 77.2502,
      lati: 28.5129
    },
    {
      name: "Holy Family Hospital",
      address: "Okhla Road, Jamia Nagar, New Delhi, Delhi 110025",
      phone: "+911126845900",
      logi: 77.2908,
      lati: 28.5623
    },
    {
      name: "Deen Dayal Upadhyay Hospital",
      address: "Hari Nagar, New Delhi, Delhi 110064",
      phone: "+911125494402",
      logi: 77.1304,
      lati: 28.6320
    },
    {
      name: "Rajiv Gandhi Super Speciality Hospital",
      address: "Tahirpur Road, Dilshad Garden, Delhi 110095",
      phone: "+911122890600",
      logi: 77.3162,
      lati: 28.6862
    },
    {
      name: "BLK Super Speciality Hospital",
      address: "Pusa Road, New Delhi, Delhi 110005",
      phone: "+911130403040",
      logi: 77.1789,
      lati: 28.6440
    }
  ];
  

  const accountSid = 'MG55c9d5d9db7ae7b73046c23f1851a036';
const authToken = '06ddf777b7aa315e00acf74646b77952';
const twilioPhone = '+12062224885';
const client = require('twilio')(accountSid, authToken);



// User's current location (hardcoded)
const userLocation = {
  lat: 28.6304,  // Fixed property name
  lng: 77.2177   // Fixed property name
};

// Improved distance calculation
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

// Find nearest hospital
function findNearestHospital(userLat, userLng) {
  return hospitals.reduce((nearest, hospital) => {
    const distance = calculateDistance(userLat, userLng, hospital.lati, hospital.logi);
    return distance < nearest.distance ? 
      { hospital, distance } : nearest;
  }, { hospital: null, distance: Infinity });
}

// Send SMS using Twilio
async function sendEmergencySMS(hospital, userLocation, message) {
  try {
    const googleMapsLink = `https://www.google.com/maps?q=${userLocation.lat},${userLocation.lng}`;
    
    const smsBody = `🚨 EMERGENCY ALERT 🚨
Patient Location: ${googleMapsLink}
Coordinates: ${userLocation.lat}, ${userLocation.lng}
Message: ${message}
Require immediate medical assistance!`;

    const response = await client.messages.create({
      body: smsBody,
      from: twilioPhone,
      to: hospital.phone // Ensure numbers are in E.164 format
    });

    return {
      success: true,
      sid: response.sid,
      hospital: hospital.name,
      distance: hospital.distance
    };
  } catch (error) {
    console.error('SMS Error:', error);
    return { success: false, error: error.message };
  }
}

// Main execution
(async () => {
  try {
    const { hospital, distance } = findNearestHospital(userLocation.lat, userLocation.lng);
    
    if (!hospital) {
      console.log('No hospitals found');
      return;
    }

    console.log(`Nearest hospital: ${hospital.name} (${(distance/1000).toFixed(2)} km)`);

    const sosMessage = "Cardiac emergency! Patient unconscious, needs immediate attention.";
    const result = await sendEmergencySMS(hospital, userLocation, sosMessage);

    console.log(result.success ? 
      `SMS sent to ${hospital.name} successfully!` : 
      'Failed to send SMS');
      
    console.log('Response:', result);

  } catch (error) {
    console.error('Error:', error);
  }
})();