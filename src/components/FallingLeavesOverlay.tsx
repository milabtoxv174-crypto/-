import React, { useMemo } from 'react';

interface LeafParticle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  swayDistance: number;
  rotationSpeed: number;
  color: string;
  type: 'maple' | 'oak' | 'ginkgo' | 'birch' | 'petal' | 'sparkle';
}

interface FallingLeavesProps {
  active: boolean;
}

export const FallingLeavesOverlay: React.FC<FallingLeavesProps> = ({ active }) => {
  const particles = useMemo<LeafParticle[]>(() => {
    const leafColors = [
      '#e5c158', // Champagne Gold
      '#d4af37', // Pure Gold
      '#c5a059', // Antique Gold
      '#b8860b', // Deep Amber
      '#c86432', // Warm Terracotta
      '#d9822b', // Golden Ochre
      '#ffd700', // Bright Gold
    ];

    const types: LeafParticle['type'][] = ['maple', 'oak', 'ginkgo', 'birch', 'petal', 'sparkle'];

    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 96 + 2,
      size: Math.floor(Math.random() * 12) + 16,
      duration: Math.random() * 7 + 9,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.4 + 0.45,
      swayDistance: Math.floor(Math.random() * 40) + 20,
      rotationSpeed: Math.random() * 5 + 4,
      color: leafColors[i % leafColors.length],
      type: types[i % types.length],
    }));
  }, []);

  if (!active) return null;

  const renderLeafSvg = (type: LeafParticle['type'], color: string) => {
    switch (type) {
      case 'maple':
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-full h-full drop-shadow-sm opacity-90">
            <path d="M12 2L13.5 6L17 5L16 8.5L20 10L16.5 12.5L18 16L14 15L13 22L11 22L10 15L6 16L7.5 12.5L4 10L8 8.5L7 5L10.5 6L12 2Z" />
          </svg>
        );
      case 'oak':
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-full h-full drop-shadow-sm opacity-90">
            <path d="M12 2C10.5 3.5 11 6 9 7C7 8 5 9 6 11C7 13 5 15 7 17C9 19 10 20 11.5 22L12.5 22C14 20 15 19 17 17C19 15 17 13 18 11C19 9 17 8 15 7C13 6 13.5 3.5 12 2Z" />
          </svg>
        );
      case 'ginkgo':
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-full h-full drop-shadow-sm opacity-85">
            <path d="M12 22C12 18 11.5 14 10 10C7.5 8 5 5 7 2C10.5 3 13.5 3 17 2C19 5 16.5 8 14 10C12.5 14 12 18 12 22Z" />
          </svg>
        );
      case 'birch':
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-full h-full drop-shadow-sm opacity-85">
            <path d="M12 2C8 6 5 11 6 16C7 20 10 22 12 22C14 22 17 20 18 16C19 11 16 6 12 2Z" />
          </svg>
        );
      case 'petal':
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-full h-full drop-shadow-sm opacity-90">
            <path d="M12 3C8 7 8 15 12 21C16 15 16 7 12 3Z" />
          </svg>
        );
      case 'sparkle':
      default:
        return (
          <svg viewBox="0 0 24 24" fill={color} className="w-full h-full drop-shadow-md">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {particles.map((p) => {
        return (
          <div
            key={p.id}
            className="absolute will-change-transform"
            style={{
              left: `${p.left}%`,
              top: '-8%',
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animation: `weddingLeafFall ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          >
            <div
              style={{
                animation: `weddingLeafFlutter ${p.rotationSpeed}s ease-in-out infinite alternate`,
              }}
              className="w-full h-full"
            >
              {renderLeafSvg(p.type, p.color)}
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes weddingLeafFall {
          0% {
            transform: translateY(0vh) translateX(0px) rotate(0deg);
          }
          25% {
            transform: translateY(30vh) translateX(25px) rotate(45deg);
          }
          50% {
            transform: translateY(60vh) translateX(-20px) rotate(110deg);
          }
          75% {
            transform: translateY(85vh) translateX(20px) rotate(190deg);
          }
          100% {
            transform: translateY(115vh) translateX(-10px) rotate(270deg);
          }
        }

        @keyframes weddingLeafFlutter {
          0% {
            transform: rotate3d(1, 1, 0, 0deg) scale(0.9);
          }
          50% {
            transform: rotate3d(1, 1, 0, 45deg) scale(1.05);
          }
          100% {
            transform: rotate3d(1, 1, 0, -45deg) scale(0.9);
          }
        }
      `}</style>
    </div>
  );
};
