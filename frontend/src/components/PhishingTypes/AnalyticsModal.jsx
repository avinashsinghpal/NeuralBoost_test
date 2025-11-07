import React, { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, TrendingUp, PieChart, Target, Shield } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CHANNEL_COLORS, SEVERITY_LEVELS } from '../../data/phishingTypes';

// Simple Dialog component (fallback if Headless UI not available)
function Dialog({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        aria-hidden="true"
      />
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'trends', label: 'Trends', icon: TrendingUp },
  { id: 'sectors', label: 'Sectors', icon: PieChart },
  { id: 'lures', label: 'Top Lures', icon: Target },
  { id: 'mitigation', label: 'Mitigation', icon: Shield }
];

export default function AnalyticsModal({ isOpen, onClose, type, prefersReducedMotion = false }) {
  const [activeTab, setActiveTab] = useState('overview');

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: prefersReducedMotion ? 'tween' : 'spring',
        duration: prefersReducedMotion ? 0.1 : 0.3,
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.2
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen && type) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, type]);

  // Reset tab when modal opens
  React.useEffect(() => {
    if (isOpen && type) {
      setActiveTab('overview');
    }
  }, [isOpen, type]);

  if (!type || !isOpen) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`${type.name} Analytics`}>
      <AnimatePresence mode="wait">
        {isOpen && type && (
          <motion.div
            key={type.id}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                  {type.name} Analytics
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {type.definition}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              {TABS.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                    aria-selected={activeTab === tab.id}
                    role="tab"
                  >
                    <TabIcon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Incidents by Channel (Last 12 Months)
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={type.analytics.monthlyByChannel}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="email" stackId="a" fill="#6366f1" name="Email" />
                        <Bar dataKey="sms" stackId="a" fill="#14b8a6" name="SMS" />
                        <Bar dataKey="voice" stackId="a" fill="#f97316" name="Voice" />
                        <Bar dataKey="social" stackId="a" fill="#8b5cf6" name="Social" />
                        <Bar dataKey="web" stackId="a" fill="#3b82f6" name="Web" />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {activeTab === 'trends' && (
                  <motion.div
                    key="trends"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      12-Month Trend with Moving Average
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={type.analytics.trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#6366f1"
                          strokeWidth={2}
                          name="Incidents"
                          dot={{ fill: '#6366f1', r: 4 }}
                          isAnimationActive={!prefersReducedMotion}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {activeTab === 'sectors' && (
                  <motion.div
                    key="sectors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Industries Targeted
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <RechartsPieChart>
                        <Pie
                          data={type.analytics.industryPie}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          isAnimationActive={!prefersReducedMotion}
                        >
                          {type.analytics.industryPie.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {activeTab === 'lures' && (
                  <motion.div
                    key="lures"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Top Lure Categories
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={type.analytics.luresBar} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis type="number" stroke="#6b7280" />
                        <YAxis dataKey="name" type="category" stroke="#6b7280" width={150} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="value" fill="#6366f1" isAnimationActive={!prefersReducedMotion}>
                          {type.analytics.luresBar.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {activeTab === 'mitigation' && (
                  <motion.div
                    key="mitigation"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                  >
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                      Key Actions
                    </h3>
                    <div className="space-y-3">
                      {type.mitigations.map((mitigation, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <input
                            type="checkbox"
                            className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                            id={`mitigation-${idx}`}
                          />
                          <label
                            htmlFor={`mitigation-${idx}`}
                            className="flex-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                          >
                            {mitigation}
                          </label>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}

