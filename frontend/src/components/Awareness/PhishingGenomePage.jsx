import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, AlertCircle } from 'lucide-react';
import GenomeGraph from './GenomeGraph';
import PhishCard from './PhishCard';
import PhishModal from './PhishModal';
import Filters from './Filters';
import { PHISHING_TYPES } from '../../data/phishingTypes';

export default function PhishingGenomePage() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('phishingGenomeDarkMode');
        if (stored) return JSON.parse(stored);
        if (window.matchMedia) {
          return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
      }
    } catch (e) {
      console.warn('Error reading dark mode preference:', e);
    }
    return false;
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedSeverities, setSelectedSeverities] = useState(['low', 'medium', 'high']);
  const [selectedPhish, setSelectedPhish] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Apply dark mode to html element
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      if (darkMode) {
        html.classList.add('dark');
        html.setAttribute('data-theme', 'dark');
      } else {
        html.classList.remove('dark');
        html.setAttribute('data-theme', 'light');
      }
    }

    // Save preference to localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('phishingGenomeDarkMode', JSON.stringify(darkMode));
      }
    } catch (e) {
      console.warn('Error saving dark mode preference:', e);
    }
  }, [darkMode]);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Filter phishing types
  const filteredPhishingTypes = useMemo(() => {
    return PHISHING_TYPES.filter((phish) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        phish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phish.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        phish.redFlags.some((flag) => flag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Channel filter
      const matchesChannel = selectedChannel === 'all' || phish.channel === selectedChannel;

      // Severity filter
      const matchesSeverity = selectedSeverities.includes(phish.severity);

      return matchesSearch && matchesChannel && matchesSeverity;
    });
  }, [searchQuery, selectedChannel, selectedSeverities]);

  const handleSeverityToggle = (severity) => {
    setSelectedSeverities((prev) =>
      prev.includes(severity) ? prev.filter((s) => s !== severity) : [...prev, severity]
    );
  };

  const handleCardClick = (phish) => {
    setSelectedPhish(phish);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhish(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedChannel('all');
    setSelectedSeverities(['low', 'medium', 'high']);
  };

  if (!PHISHING_TYPES || PHISHING_TYPES.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Data Available
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please check the data file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
      style={{
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: darkMode ? '#111827' : '#f9fafb',
        color: darkMode ? '#f9fafb' : '#111827',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        width: '100%',
        marginTop: 0,
      }}
    >
      {/* Header */}
      <header className="sticky bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm" style={{ top: '60px', zIndex: 0 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Phishing Genome
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Explore six types of phishing attacks and learn how to protect yourself
              </p>
            </div>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <Sun className="w-6 h-6 text-yellow-500" />
              ) : (
                <Moon className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Filters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedChannel={selectedChannel}
          onChannelChange={setSelectedChannel}
          selectedSeverities={selectedSeverities}
          onSeverityToggle={handleSeverityToggle}
        />

        {/* Empty State */}
        {filteredPhishingTypes.length === 0 && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
          >
            <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No phishing types found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your filters or search query.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Reset Filters
            </button>
          </motion.div>
        )}

        {/* Genome Visualization */}
        {filteredPhishingTypes.length > 0 && (
          <div className="relative">
            {/* Desktop: Circular layout with graph */}
            <div 
              className="hidden lg:block relative min-h-[800px] w-full" 
              style={{ minHeight: '800px', padding: '40px 0', overflow: 'visible' }}
              data-genome-container
            >
              {/* Graph visualization with connections */}
              <div className="absolute inset-0" style={{ zIndex: 1 }}>
                <GenomeGraph
                  className="w-full h-full"
                  cardPositions={filteredPhishingTypes.map((phish, index) => {
                    const angle = (index / filteredPhishingTypes.length) * 2 * Math.PI - Math.PI / 2;
                    const radius = prefersReducedMotion ? 0 : 320;
                    return {
                      angle,
                      radius,
                      x: Math.cos(angle) * radius,
                      y: Math.sin(angle) * radius,
                    };
                  })}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </div>

              {/* Cards positioned around graph */}
              <div className="relative min-h-[800px] w-full" style={{ minHeight: '800px', zIndex: 2 }}>
                {filteredPhishingTypes.map((phish, index) => {
                  const angle = (index / filteredPhishingTypes.length) * 2 * Math.PI - Math.PI / 2;
                  const radius = prefersReducedMotion ? 0 : 320;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <div
                      key={phish.id}
                      className="absolute"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                      }}
                    >
                      <PhishCard
                        phish={phish}
                        onClick={() => handleCardClick(phish)}
                        index={index}
                        totalCards={filteredPhishingTypes.length}
                        prefersReducedMotion={prefersReducedMotion}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile: Grid layout */}
            <div className="lg:hidden">
              <div className="flex justify-center mb-8">
                <div className="w-48 h-48">
                  <GenomeGraph
                    className="w-full h-full"
                    cardPositions={[]}
                    prefersReducedMotion={true}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredPhishingTypes.map((phish, index) => (
                  <PhishCard
                    key={phish.id}
                    phish={phish}
                    onClick={() => handleCardClick(phish)}
                    index={index}
                    totalCards={filteredPhishingTypes.length}
                    prefersReducedMotion={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      <PhishModal
        phish={selectedPhish}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        prefersReducedMotion={prefersReducedMotion}
      />
    </div>
  );
}

