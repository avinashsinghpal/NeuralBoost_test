import React from 'react';
import { LayoutGrid, Workflow } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ModeSwitcher({ mode, onModeChange, prefersReducedMotion = false }) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => onModeChange('cards')}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          mode === 'cards'
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        aria-pressed={mode === 'cards'}
        aria-label="Switch to cards view"
      >
        <LayoutGrid size={18} />
        <span className="text-sm font-medium">Cards</span>
        {mode === 'cards' && (
          <motion.div
            layoutId="activeMode"
            className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm"
            initial={false}
            transition={{
              type: prefersReducedMotion ? 'tween' : 'spring',
              stiffness: 500,
              damping: 30
            }}
            style={{ zIndex: -1 }}
          />
        )}
      </button>
      <button
        onClick={() => onModeChange('flowchart')}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
          mode === 'flowchart'
            ? 'text-indigo-600 dark:text-indigo-400'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        aria-pressed={mode === 'flowchart'}
        aria-label="Switch to flowchart view"
      >
        <Workflow size={18} />
        <span className="text-sm font-medium">Flowchart</span>
        {mode === 'flowchart' && (
          <motion.div
            layoutId="activeMode"
            className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm"
            initial={false}
            transition={{
              type: prefersReducedMotion ? 'tween' : 'spring',
              stiffness: 500,
              damping: 30
            }}
            style={{ zIndex: -1 }}
          />
        )}
      </button>
    </div>
  );
}

