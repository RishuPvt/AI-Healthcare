import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';
import { useMedications } from '../context/MedicationContext';

const ReminderAlert = () => {
  const { medications } = useMedications();

  useEffect(() => {
    const checkReminders = () => {
      medications.forEach(medication => {
        const now = new Date();
        const nextDose = new Date(medication.nextDose);
        
        if (nextDose <= now) {
          toast(
            (t) => (
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-semibold">Time to take {medication.name}</p>
                  <p className="text-sm text-gray-600">{medication.dosage}</p>
                </div>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    // Snooze for 5 minutes
                    setTimeout(() => checkReminders(), 5 * 60 * 1000);
                  }}
                  className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
                >
                  Snooze
                </button>
              </div>
            ),
            {
              duration: 0,
            }
          );
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [medications]);

  return null;
};

export default ReminderAlert;