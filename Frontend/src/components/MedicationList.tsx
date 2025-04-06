import React from 'react';
import { Clock, Trash2 } from 'lucide-react';
import { useMedications } from '../context/MedicationContext';

const MedicationList = () => {
  const { medications, removeMedication } = useMedications();

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-700">Your Medications</h2>
      
      {medications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No medications added yet. Click the "Add Medication" button to get started.
        </p>
      ) : (
        <div className="space-y-4">
          {medications.map((medication) => (
            <div
              key={medication.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div>
                <h3 className="font-semibold text-lg">{medication.name}</h3>
                <p className="text-gray-600">{medication.dosage}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{medication.frequency} at {medication.time}</span>
                </div>
              </div>
              
              <button
                onClick={() => removeMedication(medication.id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicationList;