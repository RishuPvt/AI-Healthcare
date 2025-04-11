import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Activity,
  Brain,
  AlertTriangle,
  Clipboard,
  Download,
  LayoutPanelLeft,
  Terminal,
  Stethoscope,
  Pill,
  HeartPulse,
} from "lucide-react";
import { FileUpload } from "../components/FileUpload";
import { Toaster } from "react-hot-toast";


interface AnalysisResult {
  fileName: string;
  timestamp: string;
  type: string;
  diagnosis: string;
  confidenceLevel: number; // Changed to number
  findings: string;
  recommendations: string;
}
const ReportAnalyzer = () => {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState<"reports" | "terminal">("terminal");
  const [expandedEntries, setExpandedEntries] = useState<Set<number>>(new Set());

  const toggleEntry = (index: number) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleAnalysisComplete = (results: any[]) => {
    setAnalysisHistory((prev) => [
      ...results.map((r) => ({
        ...r,
        timestamp: new Date().toISOString(),
        type: "analysis",
        diagnosis: r.diagnosis || "No diagnosis provided",
        confidenceLevel: r.confidenceLevel?.value || 0,
      })),
      ...prev,
    ]);
  };
  interface ConfidenceBadgeProps {
    level: number;
  }
  const ConfidenceBadge = ({ level }: ConfidenceBadgeProps) => (
    <div className="flex items-center">
      <div className="relative w-24 h-2 bg-gray-700 rounded-full mr-2">
        <div
          className="absolute h-2 rounded-full transition-all duration-500"
          style={{
            width: `${level}%`,
            backgroundColor:
              level >= 80 ? "#10B981" : 
              level >= 60 ? "#F59E0B" : 
              "#EF4444",
          }}
        />
      </div>
      <span
        className={`font-semibold ${
          level >= 80 ? "text-emerald-400" : 
          level >= 60 ? "text-amber-400" : 
          "text-red-400"
        }`}
      >
        {level}%
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <HeartPulse className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold dark:text-gray-100">Medical Analysis Terminal</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    AI-powered diagnostic assistance v1.0
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("terminal")}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    activeTab === "terminal"
                      ? "bg-white dark:bg-gray-600 shadow-sm text-blue-500 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  Terminal
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    activeTab === "reports"
                      ? "bg-white dark:bg-gray-600 shadow-sm text-blue-500 dark:text-blue-300"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Reports
                </button>
              </div>
            </div>

            <div className="h-[600px] overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
              {activeTab === "terminal" ? (
                <div className="space-y-6">
                  {analysisHistory.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                            <FileText className="w-5 h-5 text-blue-500 mr-2" />
                            {entry.fileName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Analyzed at {new Date(entry.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <ConfidenceBadge level={entry.confidenceLevel} />
                      </div>

                      <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4">
                          <div className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            <Clipboard className="w-4 h-4 mr-2" />
                            Clinical Findings
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {entry.findings}
                          </p>
                        </div>

                        <div className="border-l-4 border-emerald-500 pl-4">
                          <div className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            <Stethoscope className="w-4 h-4 mr-2" />
                            Diagnosis
                          </div>
                          <p className="text-emerald-500 dark:text-emerald-400 font-medium text-sm">
                            {entry.diagnosis}
                          </p>
                        </div>

                        <div className="border-l-4 border-purple-500 pl-4">
                          <div className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            <Pill className="w-4 h-4 mr-2" />
                            Recommendations
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {entry.recommendations}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {analysisHistory.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between cursor-pointer" onClick={() => toggleEntry(index)}>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                            <FileText className="w-5 h-5 text-blue-500 inline-block mr-2" />
                            {entry.fileName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <ConfidenceBadge level={entry.confidenceLevel} />
                          <button className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            {expandedEntries.has(index) ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {expandedEntries.has(index) && (
                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                              <Clipboard className="w-4 h-4 mr-2" />
                              Clinical Findings
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {entry.findings}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                              <Stethoscope className="w-4 h-4 mr-2" />
                              Diagnosis
                            </h4>
                            <p className="text-emerald-500 dark:text-emerald-400 font-medium text-sm">
                              {entry.diagnosis}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 flex items-center">
                              <Pill className="w-4 h-4 mr-2" />
                              Recommendations
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {entry.recommendations}
                            </p>
                          </div>

                          <div className="flex items-center justify-end space-x-4 mt-6">
                            <button className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200">
                              <Clipboard className="w-4 h-4 mr-2" />
                              Copy
                            </button>
                            <button className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200">
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t dark:border-gray-700">
              <FileUpload onAnalysisComplete={handleAnalysisComplete} />
            </div>
          </div>
        </motion.div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default ReportAnalyzer;