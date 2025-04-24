// EmergencyButton.tsx
import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Phone, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { backendUrl } from "../APi/Backend";
interface EmergencyButtonProps {
  onEmergency: (success: boolean) => void;
}

const EmergencyButton = ({ onEmergency }: EmergencyButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const toastId = useRef<string | null>(null);

  const fetchLocation = useCallback(async () => {
    return new Promise<string>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const loc = `https://maps.google.com/?q=${latitude},${longitude}`;
            setCoordinates({ lat: latitude, lng: longitude });
            resolve(loc);
          },
          (error) => {
            toast.error("❌ Location access denied. Sending without precise location.");
            resolve("Location unavailable");
          }
        );
      } else {
        toast.error("❌ Geolocation not supported.");
        resolve("Location unavailable");
      }
    });
  }, []);
  // const fetchLocation = useCallback(async () => {
  //   return new Promise<string>((resolve, reject) => {
  //     if (navigator.geolocation) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           const { latitude, longitude } = position.coords;
  //           const loc = `https://maps.google.com/?q=${latitude},${longitude}`;
  //           setCoordinates({ lat: latitude, lng: longitude });
  //           resolve(loc);
  //         },
  //         (error) => {
  //           toast.error("❌ Location access denied. Sending without precise location.");
  //           resolve("Location unavailable");
  //         }
  //       );
  //     } else {
  //       toast.error("❌ Geolocation not supported.");
  //       resolve("Location unavailable");
  //     }
  //   });
  // }, []);

  const sendEmergencyAlert = useCallback(async () => {
    try {
      const locationUrl = await fetchLocation();
      
      const response = await axios.post(`${backendUrl}/send-alert`, {
        location: locationUrl, // Send the map URL instead of raw coordinates
        coordinates: coordinates // Optional: send both if needed
      });
  
      if (response.data.success) {
        toast.success(
          <div>
            Alert sent to {response.data.hospital} ({response.data.distance} km away)
            <br />
            <a href={locationUrl} target="_blank" rel="noopener noreferrer">
              View Location
            </a>
          </div>
        );
        onEmergency(true);
      }
    } catch (error) {
      toast.error("Failed to send emergency alert");
      onEmergency(false);
    }
  }, [coordinates, onEmergency]);
  

  const handleEmergency = useCallback(async () => {
    setIsPressed(true);
    toastId.current = toast.loading("Starting emergency protocol...");

    try {
      await fetchLocation();
      
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            sendEmergencyAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    } catch (error) {
      toast.error("Failed to initialize emergency");
      cancelEmergency();
    }
  }, [fetchLocation, sendEmergencyAlert]);

  const cancelEmergency = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsPressed(false);
    setCountdown(5);
    toast.dismiss(toastId.current!);
    toast.error("Emergency cancelled");
    onEmergency(false);
  }, [onEmergency]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        animate={{ scale: isPressed ? [1, 1.05, 1] : 1 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        onClick={handleEmergency}
        className={`w-full h-64 rounded-2xl font-bold text-4xl text-white shadow-lg transition-colors relative overflow-hidden ${
          isPressed ? "bg-red-600" : "bg-red-500 hover:bg-red-600"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 opacity-75" />
        <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
          <AlertCircle className="w-16 h-16" />
          {isPressed ? (
            <>
              <span>SENDING SOS IN</span>
              <span className="text-6xl">{countdown}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  cancelEmergency();
                }}
                className="mt-2 px-4 py-2 bg-white text-red-600 rounded-lg text-base hover:bg-red-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <span>TAP TO SEND SOS</span>
          )}
        </div>
      </motion.button>
    </div>
  );
};

export default EmergencyButton;