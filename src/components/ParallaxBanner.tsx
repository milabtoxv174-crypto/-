import React, { useEffect, useRef, useState } from 'react';

interface ParallaxBannerProps {
  imageSrc: string;
  altText?: string;
  speed?: number; // 0.1 to 0.5 recommended
  className?: string;
  children?: React.ReactNode;
  heightClass?: string;
}

export const ParallaxBanner: React.FC<ParallaxBannerProps> = ({
  imageSrc,
  altText = 'Wedding Atmosphere',
  speed = 0.25,
  className = '',
  children,
  heightClass = 'h-64 sm:h-80 md:h-96',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!containerRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const distanceFromCenter = rect.top + rect.height / 2 - windowHeight / 2;
            setOffsetY(-distanceFromCenter * speed);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${heightClass} ${className}`}
    >
      {/* Moving Background Image Layer */}
      <div
        className="absolute inset-0 w-full h-[140%] -top-[20%] will-change-transform pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(0, ${offsetY}px, 0)`,
        }}
      >
        <img
          src={imageSrc}
          alt={altText}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-75 contrast-105"
        />
      </div>

      {/* Dark Emerald Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#051a14]/80 via-[#0a2a22]/60 to-[#051a14]/90 pointer-events-none" />

      {/* Content Container */}
      {children && (
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center">
          {children}
        </div>
      )}
    </div>
  );
};
