import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', animated = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${animated ? 'hover-wiggle' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
          <linearGradient id="logoGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fcd34d" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#logoGradient)"
          className="transition-all duration-300"
          filter={animated ? "url(#glow)" : "none"}
        />

        {/* Inner Circle for depth */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="rgba(255,255,255,0.1)"
          className="transition-all duration-300"
        />

        {/* Custom M Letter */}
        <path
          d="M25 70 L25 30 L35 30 L50 55 L65 30 L75 30 L75 70 L68 70 L68 42 L55 65 L45 65 L32 42 L32 70 Z"
          fill="white"
          className="transition-all duration-300"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
        />

        {/* Motion Lines for "Motion" effect */}
        <path
          d="M15 25 L25 25"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          className={animated ? 'animate-pulse' : ''}
        />
        <path
          d="M15 35 L20 35"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
          className={animated ? 'animate-pulse delay-100' : ''}
        />
        <path
          d="M80 75 L85 75"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          className={animated ? 'animate-pulse delay-200' : ''}
        />
        <path
          d="M75 65 L85 65"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
          className={animated ? 'animate-pulse delay-300' : ''}
        />
      </svg>

      {/* Floating particles for motion effect */}
      {animated && (
        <>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping delay-500 opacity-75"></div>
        </>
      )}
    </div>
  );
};

export default Logo;