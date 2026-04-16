import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = '', showText = false }: LogoProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("flex items-center justify-center group", className)}>
      <motion.div 
        className="relative h-[50px] w-auto aspect-square flex items-center justify-center bg-white rounded-lg overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Pure White Background Container for the Logo Asset */}
        <div className="relative w-full h-full flex items-center justify-center p-1">
          {!hasError ? (
            <img 
              src="/logo.png" 
              alt="Kodia Brand Logo"
              className="h-full w-auto object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
              referrerPolicy="no-referrer"
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-green-600">
              <svg viewBox="0 0 100 100" className="w-8 h-8 fill-current">
                <path d="M30 20 H45 V80 H30 Z" />
                <path d="M45 50 L75 20 H60 L45 40 Z" />
                <path d="M45 50 L75 80 H60 L45 60 Z" />
              </svg>
            </div>
          )}
          
          {/* Subtle Studio Lighting Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
          
          {/* Internal Refraction Simulation (Overlay) */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-rose-400/5 to-emerald-500/5 mix-blend-overlay" />
          </div>
        </div>
      </motion.div>
      
      {showText && (
        <span className="ml-3 font-heading font-extrabold text-2xl tracking-tighter bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 bg-clip-text text-transparent">
          Kodia
        </span>
      )}
    </div>
  );
}
