import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Globe, Shield } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CHANNEL_COLORS, SEVERITY_LEVELS } from '../../data/phishingTypes';

export default function PhishModal({ phish, isOpen, onClose, prefersReducedMotion }) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      // Focus trap
      const handleTab = (e) => {
        if (e.key !== 'Tab') return;
        
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };

      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleTab);
      document.addEventListener('keydown', handleEscape);
      modalRef.current?.querySelector('button')?.focus();

      return () => {
        document.removeEventListener('keydown', handleTab);
        document.removeEventListener('keydown', handleEscape);
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, onClose]);

  if (!phish) return null;

  const severity = SEVERITY_LEVELS[phish.severity] || SEVERITY_LEVELS.medium;

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.2,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: prefersReducedMotion ? 0.1 : 0.3,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const visualCueVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.3,
        type: 'spring',
        stiffness: 200,
      },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <motion.div
              ref={modalRef}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 id="modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
                    {phish.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {phish.description || phish.shortDescription}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Severity and Channel */}
                <div className="flex items-center gap-4">
                  <span
                    className="px-3 py-1 text-sm font-semibold rounded-full"
                    style={{
                      backgroundColor: severity.bgColor || '#e5e7eb',
                      color: severity.color || '#374151',
                    }}
                  >
                    {severity.label} Severity
                  </span>
                  <span
                    className="px-3 py-1 text-sm font-medium rounded"
                    style={{
                      backgroundColor: `${CHANNEL_COLORS[phish.channel]}20`,
                      color: CHANNEL_COLORS[phish.channel],
                    }}
                  >
                    {phish.channel.toUpperCase()} Channel
                  </span>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Channel Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      Distribution by Channel
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={phish.modalChartData.byChannel}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {phish.modalChartData.byChannel.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Top Lures */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                      Top Lures
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={phish.modalChartData.topLures}>
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill={CHANNEL_COLORS[phish.channel]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Red Flags */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Red Flags
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    {phish.redFlags.map((flag, idx) => (
                      <li key={idx}>{flag}</li>
                    ))}
                  </ul>
                </div>

                {/* Mitigations */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    What to Do
                  </h3>
                  <div className="space-y-2">
                    {phish.mitigations.map((mitigation, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          id={`mitigation-${idx}`}
                          className="mt-1"
                          aria-label={mitigation}
                        />
                        <label
                          htmlFor={`mitigation-${idx}`}
                          className="flex-1 text-gray-700 dark:text-gray-300 cursor-pointer"
                        >
                          {mitigation}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Cues */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800"
                    variants={visualCueVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">
                        Verify Domain
                      </h4>
                    </div>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      Always check the sender's email domain. Legitimate organizations use their official domains.
                    </p>
                    <img
                      src={phish.overlays.verifyDomainImg}
                      alt="Verify domain"
                      className="mt-2 w-full h-24 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/assets/phishing/fallback.png';
                      }}
                    />
                  </motion.div>

                  <motion.div
                    className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                    variants={visualCueVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      <h4 className="font-semibold text-amber-900 dark:text-amber-100">
                        Padlock ≠ Legitimacy
                      </h4>
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      A padlock icon doesn't guarantee a site is safe. Phishing sites can also use HTTPS.
                    </p>
                    <img
                      src={phish.overlays.padlockMythImg}
                      alt="Padlock myth"
                      className="mt-2 w-full h-24 object-cover rounded"
                      onError={(e) => {
                        e.target.src = '/assets/phishing/fallback.png';
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

