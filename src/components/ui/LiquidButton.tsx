import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface LiquidButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export default function LiquidButton({ children, onClick, isLoading, className = '', type = 'button' }: LiquidButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipples((prev) => [...prev, { x, y, id: Date.now() }]);
    
    if (onClick) onClick();
  };

  const background = useTransform(
    [x, y],
    ([latestX, latestY]) => `radial-gradient(circle at ${latestX}px ${latestY}px, rgba(16, 185, 129, 0.4) 0%, transparent 70%)`
  );

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      type={type}
      disabled={isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={isLoading ? { width: 48, borderRadius: 9999 } : { width: 'auto', borderRadius: 12 }}
      className={cn(
        "relative flex items-center gap-2 px-6 py-3 font-heading font-semibold text-white overflow-hidden transition-all",
        "bg-green-600 border border-green-500 hover:bg-green-700 shadow-lg shadow-green-500/20",
        isLoading && "px-0 justify-center",
        className
      )}
    >
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ background }}
      />

      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            }}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              marginLeft: -10,
              marginTop: -10,
            }}
          />
        ))}
      </AnimatePresence>
      
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      )}
    </motion.button>
  );
}
