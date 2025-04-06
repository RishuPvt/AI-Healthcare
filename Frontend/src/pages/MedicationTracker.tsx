import React, { useState, useEffect } from 'react';
import { Plus, Clock, AlertTriangle, Pill, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useMedications } from '../context/MedicationContext';
import MedicationForm from '../components/MedicationForm';
import MedicationList from '../components/MedicationList';
import ReminderAlert from '../components/ReminderAlert';

const MedicationTracker = () => {
  const [showForm, setShowForm] = useState(false);
  const { medications } = useMedications();
  const [interactions, setInteractions] = useState<string[]>([]);

  useEffect(() => {
    // Check for drug interactions using OpenFDA API
    const checkDrugInteractions = async () => {
      if (medications.length >= 2) {
        try {
          const drugNames = medications.map(med => med.name).join('+');
          const response = await axios.get(
            `https://api.fda.gov/drug/label.json?search=drug_interactions:(${drugNames})&limit=1`
          );
          
          if (response.data.results?.[0]?.drug_interactions) {
            setInteractions(response.data.results[0].drug_interactions);
            
            // Show warning if interactions found
            toast.error('Potential drug interactions detected! Please consult your healthcare provider.', {
              duration: 6000,
            });
          }
        } catch (error) {
          console.error('Error checking drug interactions:', error);
        }
      }
    };

    checkDrugInteractions();
  }, [medications]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-black">Medication Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your medications and stay healthy</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Medication</span>
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Pill className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold dark:text-gray-100">Active Medications</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{medications.length}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold dark:text-gray-100">Next Dose</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {medications.filter(med => med.nextDose && new Date(med.nextDose) > new Date()).length}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-semibold dark:text-gray-100">Drug Safety</h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {interactions.length > 0 ? 'Interactions detected' : 'No known interactions'}
          </p>
        </motion.div>
      </div>

      {interactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                Potential Drug Interactions Detected
              </h3>
              <ul className="mt-2 text-sm text-red-700 dark:text-red-300 space-y-1">
                {interactions.map((interaction, index) => (
                  <li key={index}>{interaction}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      <MedicationList />
      
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md m-4"
          >
            <MedicationForm onClose={() => setShowForm(false)} />
          </motion.div>
        </div>
      )}

      <ReminderAlert />
    </motion.div>
  );
};

export default MedicationTracker;

