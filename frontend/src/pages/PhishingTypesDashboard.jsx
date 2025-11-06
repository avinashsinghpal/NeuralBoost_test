import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, AlertCircle } from 'lucide-react';
import { PHISHING_TYPES } from '../data/phishingTypes';
import { useLocalStorage } from '../hooks/useLocalStorage';
import TypeCard from '../components/PhishingTypes/TypeCard';
import AnalyticsModal from '../components/PhishingTypes/AnalyticsModal';
import ModeSwitcher from '../components/PhishingTypes/ModeSwitcher';
import TypesFlow from '../components/PhishingTypes/TypesFlow';
import FiltersBar from '../components/PhishingTypes/FiltersBar';

export default function PhishingTypesDashboard() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [viewMode, setViewMode] = useLocalStorage('phishing-view-mode', 'cards');
  const [darkMode, setDarkMode] = useLocalStorage('phishing-dark-mode', false);
  const [selectedType, setSelectedType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Filter types based on search, channel, and severity
  const filteredTypes = useMemo(() => {
    return PHISHING_TYPES.filter((type) => {
      const matchesSearch =
        searchQuery === '' ||
        type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        type.definition.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesChannel =
        selectedChannel === 'all' || type.channel === selectedChannel;

      const matchesSeverity =
        selectedSeverity === 'all' || type.severity === selectedSeverity;

      return matchesSearch && matchesChannel && matchesSeverity;
    });
  }, [searchQuery, selectedChannel, selectedSeverity]);

  const handleCardClick = (type) => {
    setSelectedType(type);
    setIsModalOpen(true);
    localStorage.setItem('phishing-last-opened', type.id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedType(null);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedChannel('all');
    setSelectedSeverity('all');
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.3,
        staggerChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Phishing Types Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Explore 6 major phishing attack types with interactive analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ModeSwitcher
                mode={viewMode}
                onModeChange={setViewMode}
                prefersReducedMotion={prefersReducedMotion}
              />
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Channels:
            </span>
            {['Email', 'SMS', 'Voice', 'Social', 'Web'].map((channel) => (
              <div key={channel} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      channel === 'Email'
                        ? '#6366f1'
                        : channel === 'SMS'
                        ? '#14b8a6'
                        : channel === 'Voice'
                        ? '#f97316'
                        : channel === 'Social'
                        ? '#8b5cf6'
                        : '#3b82f6'
                  }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {channel}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <FiltersBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedChannel={selectedChannel}
          onChannelChange={setSelectedChannel}
          selectedSeverity={selectedSeverity}
          onSeverityChange={setSelectedSeverity}
          resultCount={filteredTypes.length}
          onReset={handleResetFilters}
        />

        {/* Content */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="relative"
        >
          <AnimatePresence mode="wait">
            {filteredTypes.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <AlertCircle
                  size={64}
                  className="mx-auto text-gray-400 dark:text-gray-600 mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Reset Filters
                </button>
              </motion.div>
            ) : viewMode === 'cards' ? (
              <motion.div
                key="cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredTypes.map((type) => (
                  <TypeCard
                    key={type.id}
                    type={type}
                    onClick={() => handleCardClick(type)}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="flowchart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
                style={{ 
                  minHeight: '600px',
                  height: '600px',
                  position: 'relative'
                }}
              >
                <TypesFlow
                  types={filteredTypes}
                  onNodeClick={handleCardClick}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Analytics Modal */}
      <AnalyticsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type={selectedType}
        prefersReducedMotion={prefersReducedMotion}
      />
    </div>
  );
}

