import React from 'react';
import { Phone, Heart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

const DEMO_CONTACTS: Contact[] = [
  { id: '1', name: 'John Doe', phone: '+1234567890', relation: 'Father' },
  { id: '2', name: 'Jane Doe', phone: '+1234567891', relation: 'Mother' },
];

export const EmergencyContacts: React.FC = () => {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Emergency Contacts</h2>
        <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </button>
      </div>
      <div className="grid gap-4">
        {DEMO_CONTACTS.map((contact) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {contact.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-red-500" />
                  {contact.relation}
                </p>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};