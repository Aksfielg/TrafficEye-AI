import React from 'react';

export default function Logo({ className = "w-10 h-10" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top-Left Bracket */}
      <path 
        d="M 12 10 L 4 10 L 4 18" 
        stroke="#FFB627" 
        strokeWidth="2.5" 
        strokeLinejoin="miter" 
        strokeLinecap="square"
      />
      {/* Top-Right Bracket */}
      <path 
        d="M 28 10 L 36 10 L 36 18" 
        stroke="#FFB627" 
        strokeWidth="2.5" 
        strokeLinejoin="miter"
        strokeLinecap="square" 
      />
      {/* Bottom-Left Bracket */}
      <path 
        d="M 12 30 L 4 30 L 4 22" 
        stroke="#FFB627" 
        strokeWidth="2.5" 
        strokeLinejoin="miter"
        strokeLinecap="square" 
      />
      {/* Bottom-Right Bracket */}
      <path 
        d="M 28 30 L 36 30 L 36 22" 
        stroke="#FFB627" 
        strokeWidth="2.5" 
        strokeLinejoin="miter"
        strokeLinecap="square" 
      />
      
      {/* Iris */}
      <circle 
        cx="20" 
        cy="20" 
        r="7" 
        fill="#14171B" 
        stroke="#FFB627" 
        strokeWidth="2.5" 
      />
      
      {/* Pupil */}
      <circle 
        cx="20" 
        cy="20" 
        r="2" 
        fill="#3FC1C9" 
      />
    </svg>
  );
}
