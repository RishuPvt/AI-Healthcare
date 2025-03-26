export default function Footer() {
    return (
      <footer className="bg-white dark:bg-background-dark  border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Branding */}
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-green-600 dark:text-green-500">
              स्वास्थ्यसंगिनी
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Your AI Health Companion
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/chatbot" 
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors text-sm"
              >
                AI chatbot
              </a>
              <a 
                href="/analyzer" 
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors text-sm"
              >
                Report Analyzer
              </a>
              <a 
                href="/emergency" 
                className="text-gray-600 dark:text-gray-400 hover:text-green-600 transition-colors text-sm"
              >
                Emergency SOS
              </a>
            </div>
          </div>
  
          {/* Copyright */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              © {new Date().getFullYear()} स्वास्थ्यसंगिनी All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }