import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function GenomeGraph({ 
  className = '', 
  cardPositions = [],
  prefersReducedMotion = false 
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width || 800,
          height: rect.height || 800,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const graphVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 0.5,
        ease: 'easeOut',
      },
    },
  };

  const nodeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
    pulse: prefersReducedMotion
      ? {}
      : {
          scale: [1, 1.1, 1],
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
  };

  const connectionVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 0.6,
      transition: {
        duration: prefersReducedMotion ? 0.1 : 1,
        ease: 'easeInOut',
      },
    },
  };

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ overflow: 'visible', pointerEvents: 'none' }}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connections from center to cards */}
        {cardPositions.map((cardPos, index) => {
          // Calculate end position relative to center
          const endX = centerX + cardPos.x;
          const endY = centerY + cardPos.y;

          return (
            <motion.line
              key={`connection-${index}`}
              x1={centerX}
              y1={centerY}
              x2={endX}
              y2={endY}
              stroke="#6366f1"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.4"
              variants={connectionVariants}
              initial="initial"
              animate="animate"
              style={{
                filter: 'drop-shadow(0 0 2px rgba(99, 102, 241, 0.5))',
              }}
            />
          );
        })}

        {/* Additional genome connections between cards */}
        {!prefersReducedMotion &&
          cardPositions.map((cardPos1, i) => {
            if (i === cardPositions.length - 1) return null;
            const cardPos2 = cardPositions[i + 1];
            const x1 = centerX + cardPos1.x;
            const y1 = centerY + cardPos1.y;
            const x2 = centerX + cardPos2.x;
            const y2 = centerY + cardPos2.y;
            
            return (
              <motion.line
                key={`genome-connection-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#14b8a6"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.2"
                variants={connectionVariants}
                initial="initial"
                animate="animate"
                style={{
                  transition: `delay ${i * 0.1}s`,
                }}
              />
            );
          })}
      </svg>

      {/* Center node - Security shield icon */}
      <motion.div
        className="absolute"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          perspective: '1000px',
        }}
        variants={graphVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="relative"
          variants={nodeVariants}
          initial="initial"
          animate={['animate', 'pulse']}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-indigo-500"
            style={{
              width: '120px',
              height: '120px',
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%',
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    rotate: 360,
                    transition: {
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                  }
            }
          />

          {/* Middle ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-3 border-teal-500"
            style={{
              width: '90px',
              height: '90px',
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%',
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    rotate: -360,
                    transition: {
                      duration: 15,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                  }
            }
          />

          {/* Center core with Shield icon */}
          <div
            className="absolute rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg"
            style={{
              width: '120px',
              height: '120px',
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%',
              boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              borderRadius: '50%',
            }}
          >
            {/* Shield Icon */}
            <svg
              width="60"
              height="70"
              viewBox="0 0 24 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
              }}
            >
              <path
                d="M12 0L2 5V13C2 19.55 6.16 25.74 12 28C17.84 25.74 22 19.55 22 13V5L12 0Z"
                fill="white"
                fillOpacity="0.95"
              />
              <path
                d="M12 2.5L4 6.5V13C4 18.2 7.2 23.1 12 25.1C16.8 23.1 20 18.2 20 13V6.5L12 2.5Z"
                fill="#10b981"
                fillOpacity="0.8"
              />
              <path
                d="M9 13L11 15L15 11"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Orbiting nodes */}
          {!prefersReducedMotion &&
            [0, 1, 2, 3].map((i) => {
              const angle = (i / 4) * 2 * Math.PI;
              const radius = 45;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.div
                  key={`orbit-${i}`}
                  className="absolute rounded-full bg-indigo-400"
                  style={{
                    width: '12px',
                    height: '12px',
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 8px rgba(99, 102, 241, 0.8)',
                  }}
                  animate={{
                    x: [0, Math.cos(angle + Math.PI / 2) * 5, 0],
                    y: [0, Math.sin(angle + Math.PI / 2) * 5, 0],
                    transition: {
                      duration: 2 + i * 0.3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                />
              );
            })}
        </motion.div>
      </motion.div>
    </div>
  );
}

