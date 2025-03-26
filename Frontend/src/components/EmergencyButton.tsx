import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Phone, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const EmergencyButton = () => {
  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [location, setLocation] = useState<string>("");
  const toastId = useRef<string | null>(null);

  // ✅ Correct international format with country code
  const emergencyNumber = "+918210807752"; // Indian format example

  const fetchLocation = useCallback(async () => {
    return new Promise<string>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const loc = `https://maps.google.com/?q=${latitude},${longitude}`;
            setLocation(loc);
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

  const sendWhatsAppSOS = useCallback(async () => {
    try {
      const finalLocation = location || (await fetchLocation());
      
      const message = encodeURIComponent(
        `🚨 SOS ALERT! I need help immediately.\nMy location: ${finalLocation}`
      );

      // ✅ Updated WhatsApp URL format
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${emergencyNumber}&text=${message}`;
      
      // ✅ Handle window popup blockers
      const newWindow = window.open(whatsappUrl, "_blank");
      if (!newWindow || newWindow.closed) {
        throw new Error("Popup blocked! Please allow popups for this site.");
      }
      
      toast.success("✅ WhatsApp SOS initiated!", { id: toastId.current });
    } catch (error) {
      toast.error(`❌ Error: ${error.message}`, { id: toastId.current });
    }
  }, [location, emergencyNumber]);

  const handleEmergency = useCallback(async () => {
    setIsPressed(true);
    toastId.current = toast.loading("🚨 Starting emergency protocol...");

    try {
      // ✅ Await location fetch before countdown
      await fetchLocation();
      
      intervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            sendWhatsAppSOS();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // ✅ Update loading toast
      toast.loading(`🚨 Sending SOS in ${countdown}...`, { id: toastId.current });

      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]); // Better vibration pattern
      }
    } catch (error) {
      toast.error("❌ Failed to initialize emergency", { id: toastId.current });
      cancelEmergency();
    }
  }, [countdown, sendWhatsAppSOS]);
  // ❌ Cancel Emergency
  const cancelEmergency = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsPressed(false);
    setCountdown(5);
    toast.dismiss();
    toast.error("Emergency Cancelled.");
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        animate={{
          scale: isPressed ? [1, 1.05, 1] : [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        onClick={handleEmergency}
        className={`
          w-full h-64 rounded-2xl font-bold text-4xl text-white
          shadow-lg transition-colors relative overflow-hidden
          ${isPressed ? "bg-red-600" : "bg-red-500 hover:bg-red-600"}
        `}
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

      {countdown === 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <a
            href="tel:112"
            className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Emergency
          </a>
          <button
            onClick={cancelEmergency}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancel Alert
          </button>
        </div>
      )}
    </div>
  );
};

export default EmergencyButton;
