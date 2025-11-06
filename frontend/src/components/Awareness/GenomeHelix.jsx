import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

// CSS/SVG fallback for DNA helix when Lottie is not available
const HelixFallback = ({ prefersReducedMotion }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        width="200"
        height="300"
        viewBox="0 0 200 300"
        className="w-full h-full"
        style={{ transform: prefersReducedMotion ? 'none' : `rotate(${rotation}deg)` }}
      >
        {/* DNA helix strands */}
        <g stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8">
          {/* Left strand */}
          <path
            d="M 50 20 Q 40 80 50 140 Q 60 200 50 260 Q 40 280 50 300"
            stroke="#6366f1"
            className="transition-all duration-300"
          />
          <path
            d="M 50 20 Q 60 80 50 140 Q 40 200 50 260 Q 60 280 50 300"
            stroke="#6366f1"
            className="transition-all duration-300"
          />
          
          {/* Right strand */}
          <path
            d="M 150 20 Q 140 80 150 140 Q 160 200 150 260 Q 140 280 150 300"
            stroke="#14b8a6"
            className="transition-all duration-300"
          />
          <path
            d="M 150 20 Q 160 80 150 140 Q 140 200 150 260 Q 160 280 150 300"
            stroke="#14b8a6"
            className="transition-all duration-300"
          />
        </g>
        
        {/* Base pairs */}
        {[40, 80, 120, 160, 200, 240, 280].map((y, i) => (
          <line
            key={i}
            x1="50"
            y1={y}
            x2="150"
            y2={y}
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.6"
            className="transition-all duration-300"
          />
        ))}
      </svg>
    </div>
  );
};

export default function GenomeHelix({ className = '' }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [lottieData, setLottieData] = useState(null);
  const [lottieError, setLottieError] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Try to load Lottie animation
    const loadLottie = async () => {
      try {
        const response = await fetch('/assets/dna-helix.json');
        if (response.ok) {
          const data = await response.json();
          setLottieData(data);
        } else {
          setLottieError(true);
        }
      } catch (err) {
        setLottieError(true);
      }
    };

    loadLottie();

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const animationProps = prefersReducedMotion
    ? {}
    : {
        animate: {
          rotate: [0, 360],
        },
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        },
      };

  return (
    <motion.div
      className={`relative ${className}`}
      {...animationProps}
      aria-label="DNA helix visualization"
    >
      {lottieData && !lottieError ? (
        <Lottie
          animationData={lottieData}
          loop={!prefersReducedMotion}
          autoplay={!prefersReducedMotion}
          className="w-full h-full"
          aria-hidden="true"
        />
      ) : (
        <HelixFallback prefersReducedMotion={prefersReducedMotion} />
      )}
    </motion.div>
  );
}

