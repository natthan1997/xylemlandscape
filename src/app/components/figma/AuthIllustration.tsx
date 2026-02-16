import React from 'react';

export const AuthIllustration: React.FC = () => {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-auto"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.1" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(16 185 129)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="rgb(5 150 105)" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="grad3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(110 231 183)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="rgb(167 243 208)" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Background shapes */}
      <rect width="400" height="300" rx="20" fill="url(#grad1)" />
      <path
        d="M-50,350 C100,150 300,400 450,200 V350 H-50 Z"
        fill="rgb(16 185 129 / 0.05)"
      />

      {/* Main plant */}
      <g transform="translate(150 160) scale(1.2)">
        {/* Pot */}
        <path
          d="M-40,50 L40,50 L30,80 L-30,80 Z"
          fill="rgb(108 117 125 / 0.7)"
        />
        <rect x="-42" y="45" width="84" height="10" rx="3" fill="rgb(108 117 125 / 0.8)" />

        {/* Stem */}
        <path d="M0,50 V-20" stroke="url(#grad2)" strokeWidth="8" strokeLinecap="round" />

        {/* Leaves */}
        <g>
          <path
            d="M0,-10 C40,-20 40,-60 0,-70 C-40,-60 -40,-20 0,-10 Z"
            fill="url(#grad2)"
            transform="translate(0, -5) rotate(15)"
          />
          <path
            d="M0,10 C30,0 30,-40 0,-50 C-30,-40 -30,0 0,10 Z"
            fill="url(#grad3)"
            transform="translate(-20, 10) rotate(-25) scale(0.8)"
          />
          <path
            d="M0,15 C35,5 35,-45 0,-55 C-35,-45 -35,5 0,15 Z"
            fill="url(#grad2)"
            transform="translate(20, 20) rotate(35) scale(0.9)"
          />
           <path
            d="M0,5 C20,-5 20,-35 0,-40 C-20,-35 -20,-5 0,5 Z"
            fill="url(#grad3)"
            transform="translate(5, -40) rotate(55) scale(0.6)"
          />
        </g>
      </g>

      {/* Floating UI elements */}
      <g className="opacity-80">
        {/* Chart */}
        <rect x="40" y="60" width="100" height="70" rx="8" fill="white" filter="drop-shadow(0 4px 6px rgb(0 0 0 / 0.05))" />
        <rect x="55" y="75" width="15" height="40" rx="3" fill="rgb(167 243 208)" />
        <rect x="75" y="95" width="15" height="20" rx="3" fill="rgb(52 211 153)" />
        <rect x="95" y="85" width="15" height="30" rx="3" fill="rgb(16 185 129)" />
        <circle cx="120" cy="72" r="4" fill="rgb(249 115 22)" />

        {/* Checklist */}
        <rect x="250" y="180" width="120" height="50" rx="8" fill="white" filter="drop-shadow(0 4px 6px rgb(0 0 0 / 0.05))" />
        <path d="M262,195 L267,200 L275,192" stroke="rgb(16 185 129)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="282" y="193" width="70" height="4" rx="2" fill="rgb(229 231 235)" />
         <path d="M262,210 L267,215 L275,207" stroke="rgb(16 185 129)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="282" y="208" width="50" height="4" rx="2" fill="rgb(229 231 235)" />
      </g>
    </svg>
  );
};
