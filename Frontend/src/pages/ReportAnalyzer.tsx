import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Activity, Brain, AlertTriangle } from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { Toaster } from 'react-hot-toast';

const ReportAnalyzer = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Smart Report Analyzer
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Upload your medical reports and let our AI analyze them for quick insights and recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: FileText,
                title: 'Multiple Formats',
                description: 'Support for various medical report formats including PDFs and images'
              },
              {
                icon: Brain,
                title: 'AI Analysis',
                description: 'Advanced AI algorithms to interpret medical data and provide insights'
              },
              {
                icon: Activity,
                title: 'Health Tracking',
                description: 'Track your health metrics and monitor changes over time'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
              >
                <feature.icon className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                All reports are processed securely and confidentially
              </p>
            </div>
            
            <FileUpload />
          </div>
        </motion.div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default ReportAnalyzer;