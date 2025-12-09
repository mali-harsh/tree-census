import React from 'react';
import { MapPin, Menu, X, Moon, Sun } from 'lucide-react';

const Header = ({ 
  sidebarOpen, 
  onSidebarToggle, 
  currentView, 
  onViewChange,
  isDarkMode,
  onThemeToggle 
}) => {
  return (
    <header className="bg-gradient-to-r from-green-700 to-green-800 text-white shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="w-full px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            <button
              onClick={onSidebarToggle}
              className="lg:hidden p-2 hover:bg-green-600 rounded-lg transition-colors duration-200 active:bg-green-700"
              aria-label="Toggle sidebar"
              title="Toggle menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold leading-tight">Tree Census</h1>
                <p className="text-xs sm:text-sm text-green-100">Urban Forest</p>
              </div>
            </div>
          </div>

          {/* Center: Navigation (Desktop) */}
          <nav className="hidden md:flex gap-2">
            {[
              { view: 'map', label: 'Map', icon: '🗺️' },
              { view: 'dashboard', label: 'Dashboard', icon: '📊' },
              { view: 'data', label: 'Data', icon: '📋' }
            ].map(({ view, label, icon }) => (
              <button
                key={view}
                onClick={() => onViewChange(view)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  currentView === view
                    ? 'bg-green-600 shadow-lg'
                    : 'hover:bg-green-600 active:bg-green-700'
                }`}
                title={label}
              >
                <span>{icon}</span>
                <span className="hidden lg:inline">{label}</span>
              </button>
            ))}
          </nav>

          {/* Right: Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 hover:bg-green-600 rounded-lg transition-colors duration-200 active:bg-green-700 flex-shrink-0"
            aria-label="Toggle dark mode"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-3 flex gap-2 overflow-x-auto pb-2">
          {[
            { view: 'map', label: 'Map', icon: '🗺️' },
            { view: 'dashboard', label: 'Dashboard', icon: '📊' },
            { view: 'data', label: 'Data', icon: '📋' }
          ].map(({ view, label, icon }) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap text-sm transition-all duration-200 flex items-center gap-1 ${
                currentView === view
                  ? 'bg-green-600 shadow-lg'
                  : 'hover:bg-green-600 active:bg-green-700'
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
