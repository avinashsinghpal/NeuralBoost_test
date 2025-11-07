import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { Mail, MessageSquare, Phone, Globe, Shield, AlertTriangle } from 'lucide-react';
import { CHANNEL_COLORS, SEVERITY_LEVELS } from '../../data/phishingTypes';

const CHANNEL_ICONS = {
  email: Mail,
  sms: MessageSquare,
  voice: Phone,
  social: Globe,
  web: Globe
};

export default function TypeCard({ type, onClick, prefersReducedMotion = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = CHANNEL_ICONS[type.channel] || Shield;
  const severity = SEVERITY_LEVELS[type.severity];

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.3,
        ease: 'easeOut'
      }
    },
    hover: prefersReducedMotion
      ? {}
      : {
          y: -6,
          scale: 1.02,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20
          }
        }
  };

  const tooltipVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.2,
        duration: prefersReducedMotion ? 0.1 : 0.2
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => {
        setIsHovered(true);
        setTimeout(() => setShowTooltip(true), 300);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setShowTooltip(false);
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View analytics for ${type.name}`}
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
      style={{
        boxShadow: isHovered && !prefersReducedMotion
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 0 20px rgba(99, 102, 241, 0.3)'
          : undefined
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: `${CHANNEL_COLORS[type.channel]}20`,
              color: CHANNEL_COLORS[type.channel]
            }}
          >
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {type.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs font-medium px-2 py-1 rounded"
                style={{
                  backgroundColor: `${CHANNEL_COLORS[type.channel]}20`,
                  color: CHANNEL_COLORS[type.channel]
                }}
              >
                {type.channel.toUpperCase()}
              </span>
              <span
                className="text-xs font-medium px-2 py-1 rounded"
                style={{
                  backgroundColor: severity.bgColor,
                  color: severity.color
                }}
              >
                {severity.label}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Definition */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
        {type.definition}
      </p>

      {/* Sparkline */}
      <div className="h-16 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={type.sparkData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={CHANNEL_COLORS[type.channel]}
              strokeWidth={2}
              dot={false}
              isAnimationActive={!prefersReducedMotion}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tooltip with Red Flags */}
      <AnimatePresence>
        {showTooltip && isHovered && (
          <motion.div
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute bottom-full left-0 right-0 mb-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg p-4 shadow-xl z-10"
            role="tooltip"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} />
              <span className="text-sm font-semibold">Red Flags</span>
            </div>
            <ul className="space-y-1 text-xs">
              {type.redFlags.slice(0, 3).map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-0.5">•</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

