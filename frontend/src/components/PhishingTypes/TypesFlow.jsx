import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, Globe, Shield } from 'lucide-react';
import { CHANNEL_COLORS, SEVERITY_LEVELS } from '../../data/phishingTypes';

const CHANNEL_ICONS = {
  email: Mail,
  sms: MessageSquare,
  voice: Phone,
  social: Globe,
  web: Globe
};

// Fallback SVG flowchart (since reactflow may not be available)
export default function TypesFlow({ types, onNodeClick, prefersReducedMotion = false }) {
  const containerRef = React.useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width || 800,
          height: rect.height || 600
        });
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      updateDimensions();
    }, 100);

    // Use ResizeObserver for better dimension tracking
    let resizeObserver;
    if (containerRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(containerRef.current);
    }

    // Fallback to window resize
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      clearTimeout(timeoutId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', updateDimensions);
    };
  }, [types]);

  // Calculate node positions in a circular layout
  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;
  const radius = Math.min(dimensions.width, dimensions.height) * 0.25;

  const nodes = React.useMemo(() => {
    return types.map((type, index) => {
      const angle = (index / types.length) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      return { ...type, x, y, angle };
    });
  }, [types, centerX, centerY, radius]);

  const nodeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.3,
        delay: (index) => (prefersReducedMotion ? 0 : index * 0.1)
      }
    },
    hover: prefersReducedMotion
      ? {}
      : {
          scale: 1.1,
          transition: {
            type: 'spring',
            stiffness: 300,
            damping: 20
          }
        }
  };

  const edgeVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 0.3,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 1,
        delay: (index) => (prefersReducedMotion ? 0 : index * 0.1)
      }
    }
  };

  if (!types || types.length === 0) {
    return (
      <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl">
        <p className="text-gray-500 dark:text-gray-400">No types to display</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[600px] relative bg-gray-50 dark:bg-gray-900 rounded-xl overflow-visible"
      style={{ position: 'relative' }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="absolute inset-0"
        style={{ overflow: 'visible', pointerEvents: 'none' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Animated edges connecting nodes */}
        {nodes.map((node, i) => {
          const nextNode = nodes[(i + 1) % nodes.length];
          return (
            <motion.line
              key={`edge-${i}`}
              x1={node.x}
              y1={node.y}
              x2={nextNode.x}
              y2={nextNode.y}
              stroke={CHANNEL_COLORS[node.channel]}
              strokeWidth="2"
              strokeDasharray="5,5"
              variants={edgeVariants}
              initial="initial"
              animate="animate"
              style={{
                filter: 'drop-shadow(0 0 2px rgba(99, 102, 241, 0.5))'
              }}
            />
          );
        })}

        {/* Center connection lines */}
        {nodes.map((node) => (
          <motion.line
            key={`center-${node.id}`}
            x1={centerX}
            y1={centerY}
            x2={node.x}
            y2={node.y}
            stroke={CHANNEL_COLORS[node.channel]}
            strokeWidth="1"
            strokeDasharray="3,3"
            opacity="0.2"
            variants={edgeVariants}
            initial="initial"
            animate="animate"
          />
        ))}
      </svg>

      {/* Nodes */}
      <div className="relative w-full h-full">
        {nodes.map((node, index) => {
          const Icon = CHANNEL_ICONS[node.channel] || Shield;
          const severity = SEVERITY_LEVELS[node.severity];

          return (
            <motion.div
              key={node.id}
              variants={nodeVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              onClick={() => onNodeClick(node)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNodeClick(node);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View analytics for ${node.name}`}
              className="absolute cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-lg z-10"
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'auto'
              }}
            >
              <div
                className="p-4 rounded-xl shadow-lg border-2 transition-all"
                style={{
                  backgroundColor: '#fff',
                  borderColor: CHANNEL_COLORS[node.channel],
                  minWidth: '180px',
                  boxShadow: `0 4px 6px rgba(0, 0, 0, 0.1), 0 0 20px ${CHANNEL_COLORS[node.channel]}40`
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `${CHANNEL_COLORS[node.channel]}20`,
                      color: CHANNEL_COLORS[node.channel]
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {node.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${CHANNEL_COLORS[node.channel]}20`,
                          color: CHANNEL_COLORS[node.channel]
                        }}
                      >
                        {node.channel}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded"
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
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {node.definition}
                </p>
              </div>
            </motion.div>
          );
        })}

        {/* Center hub */}
        <motion.div
          className="absolute rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg flex items-center justify-center z-20"
          style={{
            left: `${centerX}px`,
            top: `${centerY}px`,
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
            pointerEvents: 'auto'
          }}
          animate={
            prefersReducedMotion
              ? {}
              : {
                  rotate: 360,
                  transition: {
                    duration: 20,
                    repeat: Infinity,
                    ease: 'linear'
                  }
                }
          }
        >
          <Shield size={32} className="text-white" />
        </motion.div>
      </div>
    </div>
  );
}

