import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Mail, MessageSquare, Phone, AlertTriangle } from 'lucide-react';
import { CHANNEL_COLORS, SEVERITY_LEVELS } from '../../data/phishingTypes';

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  voice: Phone,
  generic: AlertTriangle,
};

export default function PhishCard({ phish, onClick, index, totalCards, prefersReducedMotion }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = channelIcons[phish.channel] || channelIcons.generic;
  const severity = SEVERITY_LEVELS[phish.severity] || SEVERITY_LEVELS.medium;

  const cardVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
      y: prefersReducedMotion ? 0 : [0, -10, 0],
      transition: {
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
        y: prefersReducedMotion
          ? undefined
          : {
              duration: 2 + index * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const tooltipVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      className="relative"
      style={{
        zIndex: showTooltip ? 1000 : 'auto',
      }}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={prefersReducedMotion ? {} : 'hover'}
      whileFocus="hover"
      onHoverStart={() => {
        setIsHovered(true);
        setTimeout(() => setShowTooltip(true), 300);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
      onFocus={() => {
        setIsHovered(true);
        setShowTooltip(true);
      }}
      onBlur={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
    >
      <motion.button
        className={`
          relative w-64 p-4 rounded-xl border-2 transition-all
          bg-white dark:bg-gray-800
          border-gray-200 dark:border-gray-700
          shadow-lg hover:shadow-2xl
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        `}
        onClick={onClick}
        aria-label={`View details for ${phish.name}`}
        style={{
          borderColor: isHovered ? CHANNEL_COLORS[phish.channel] : undefined,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon
              className="w-5 h-5"
              style={{ color: CHANNEL_COLORS[phish.channel] }}
              aria-hidden="true"
            />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {phish.name}
            </h3>
          </div>
          <span
            className="px-2 py-1 text-xs font-semibold rounded-full"
            style={{
              backgroundColor: severity.bgColor || '#e5e7eb',
              color: severity.color || '#374151',
            }}
          >
            {severity.label}
          </span>
        </div>

        {/* Channel tag */}
        <div className="mb-3">
          <span
            className="text-xs font-medium px-2 py-1 rounded"
            style={{
              backgroundColor: `${CHANNEL_COLORS[phish.channel]}20`,
              color: CHANNEL_COLORS[phish.channel],
            }}
          >
            {phish.channel.toUpperCase()}
          </span>
        </div>

        {/* Sparkline */}
        <div className="h-12 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={phish.sparkData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={CHANNEL_COLORS[phish.channel]}
                strokeWidth={2}
                dot={false}
                isAnimationActive={!prefersReducedMotion}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Tooltip overlay */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 rounded-lg shadow-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm"
              variants={tooltipVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              role="tooltip"
              aria-live="polite"
              style={{
                zIndex: 99999,
                position: 'absolute',
                pointerEvents: 'none',
                maxWidth: '256px',
              }}
            >
              <p className="mb-2">{phish.shortDescription}</p>
              <div className="border-t border-gray-700 dark:border-gray-300 pt-2">
                <p className="font-semibold mb-1">Red Flags:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {phish.redFlags.slice(0, 3).map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

