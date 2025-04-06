import React, { createContext, useContext, useState, useEffect } from 'react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  nextDose: string;
}

interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Medication) => void;
  removeMedication: (id: string) => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  const addMedication = (medication: Medication) => {
    setMedications([...medications, medication]);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  return (
    <MedicationContext.Provider value={{ medications, addMedication, removeMedication }}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedications = () => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedications must be used within a MedicationProvider');
  }
  return context;
};