import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import  EmergencyButton from '../components/EmergencyButton';
import { LocationMap } from '../components/LocationMap';
import { EmergencyContacts } from '../components/EmergencyContacts';

const Emergency = () => {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(position),
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location');
        }
      );
    }

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsVoiceEnabled(true);
    }
  }, []);

  const handleEmergency = () => {
    if (location) {
      toast.success('Emergency services have been notified!');
      // Here you would integrate with your backend to send the actual emergency alert
    } else {
      toast.error('Unable to send location. Please enable location services.');
    }
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

          <EmergencyButton onEmergency={handleEmergency} />
          
          {location && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Your Location
              </h2>
              <LocationMap location={location} />
            </motion.div>
          )}

          <EmergencyContacts />
        </motion.div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Emergency;