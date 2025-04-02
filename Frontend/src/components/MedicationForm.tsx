import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useMedications } from '../context/MedicationContext';

interface MedicationFormProps {
  onClose: () => void;
}

const MedicationForm: React.FC<MedicationFormProps> = ({ onClose }) => {
  const { addMedication } = useMedications();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    time: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMedication({
      ...formData,
      id: Date.now().toString(),
      nextDose: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute right-0 top-0 text-gray-500 hover:text-gray-700"
      >
        <X className="h-6 w-6" />
      </button>
      
      <h2 className="text-2xl font-bold mb-6">Add New Medication</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medication Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dosage
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.dosage}
              onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frequency
            </label>
            <select
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            >
              <option value="">Select frequency</option>
              <option value="daily">Daily</option>
              <option value="twice">Twice daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <input
              type="time"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Medication
          </button>
        </div>
      </form>
    </div>
  );
};

export default MedicationForm;