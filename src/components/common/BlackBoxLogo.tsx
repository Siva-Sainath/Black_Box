import React from 'react';

interface BlackBoxLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const BlackBoxLogo: React.FC<BlackBoxLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-xs', gap: 'gap-1.5' },
    md: { icon: 32, text: 'text-sm', gap: 'gap-2.5' },
    lg: { icon: 48, text: 'text-lg', gap: 'gap-3' },
  };

  const { icon, text, gap } = sizeMap[size];

  return (
    <div className={`flex items-center ${gap} ${className}`}>
      {/* Glassmorphic logo icon */}
      <div
        className="relative rounded-lg"
        style={{
          width: icon,
          height: icon,
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Inner glow circle */}
        <div
          className="absolute inset-1 rounded-md"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 70%)',
          }}
        />

        {/* Black box inner cube */}
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full p-1.5"
          style={{ filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.4))' }}
        >
          {/* Outer cube wireframe */}
          <rect
            x="16"
            y="16"
            width="32"
            height="32"
            fill="none"
            stroke="url(#gradient1)"
            strokeWidth="2"
            rx="3"
          />

          {/* Inner accent lines (3D effect) */}
          <line
            x1="20"
            y1="20"
            x2="44"
            y2="20"
            stroke="url(#gradient2)"
            strokeWidth="1.5"
            opacity="0.7"
          />
          <line
            x1="20"
            y1="32"
            x2="44"
            y2="32"
            stroke="url(#gradient2)"
            strokeWidth="1.5"
            opacity="0.5"
          />
          <line
            x1="20"
            y1="44"
            x2="44"
            y2="44"
            stroke="url(#gradient2)"
            strokeWidth="1.5"
            opacity="0.7"
          />

          {/* Center dot */}
          <circle cx="32" cy="32" r="2.5" fill="rgba(56, 189, 248, 0.9)" />

          {/* Pulsing aura */}
          <circle
            cx="32"
            cy="32"
            r="4"
            fill="none"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="1"
            opacity="0.6"
          >
            <animate
              attributeName="r"
              from="4"
              to="8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              from="0.6"
              to="0"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>

          <defs>
            <linearGradient
              id="gradient1"
              x1="16"
              y1="16"
              x2="48"
              y2="48"
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient
              id="gradient2"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div>
          <div className={`${text} font-bold tracking-tight text-white`}>
            Black Box
          </div>
          <div className="text-[10px] text-zinc-400 font-medium -mt-0.5">
            Agent observability
          </div>
        </div>
      )}
    </div>
  );
};
