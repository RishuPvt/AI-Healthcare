import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageSquare,
  FileText,
  AlertCircle,
  Info,
  Menu,
  X,
  LogIn,
} from "lucide-react";
import { motion } from "framer-motion";
const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: Heart },
    { name: "AI Chatbot", path: "/chatbot", icon: MessageSquare },
    // { name: 'Report Analyzer', path: '/analyzer', icon: FileText },
    { name: "Emergency SOS", path: "/emergency", icon: AlertCircle },
    { name: "Medication", path: "/Medication", icon: FileText },
    { name: "Profile", path: "/about", icon: Info },
    { name: "", path: "/Auth", icon: LogIn },
  ];

  return (
    <nav className="bg-white dark:bg-background-dark shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Heart className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-poppins font-bold text-primary">
              SwasthyaSangini
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center px-3 py-2 rounded-md text-sm font-inter text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white transition-colors"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center px-3 py-2 rounded-md text-base font-inter text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
