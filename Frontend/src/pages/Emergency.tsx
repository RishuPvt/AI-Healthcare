// Emergency.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import EmergencyButton from '../components/EmergencyButton';
import { LocationMap } from '../components/LocationMap';
import { EmergencyContacts } from '../components/EmergencyContacts';

const Emergency = () => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [emergencySent, setEmergencySent] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position),
        (error) => toast.error('Enable location services for emergency features')
      );
    }
  }, []);

  const handleEmergencyResponse = (success: boolean) => {
    setEmergencySent(success);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-8">
            Emergency SOS
          </h1>

          <EmergencyButton onEmergency={handleEmergencyResponse} />
          
          {location && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Your Location
              </h2>
              <LocationMap 
                latitude={location.coords.latitude}
                longitude={location.coords.longitude}
              />
            </motion.div>
          )}

          {emergencySent && (
            <div className="mt-8 p-4 bg-green-100 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">
                Emergency alert sent successfully! Help is on the way.
              </h3>
              <p className="mt-2 text-green-700">
                Stay calm and wait for assistance. Medical professionals have been notified.
              </p>
            </div>
          )}

          <EmergencyContacts />
        </motion.div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Emergency;