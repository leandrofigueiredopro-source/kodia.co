import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate, AnimatePresence } from 'motion/react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import LiquidButton from './LiquidButton';

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  ctaText: string;
  isRecommended?: boolean;
  delay?: number;
}

export default function PricingCard({
  title,
  price,
  description,
  features,
  ctaText,
  isRecommended,
  delay = 0
}: PricingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Mouse tracking for glare effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glareX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const glareY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // Price counter animation
  const count = useMotionValue(0);
  const roundedPrice = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, price, { duration: 1, delay: delay + 0.5 });
    return () => controls.stop();
  }, [price, delay]);

  // Glare background style
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.3) 0%, transparent 60%)`
  );

  // Spotlight background style
  const spotlightBackground = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x}px ${y}px, rgba(16, 185, 129, 0.15) 0%, transparent 70%)`
  );

  return (
    <div className="relative group h-full">
      {/* Background Orbs */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
          opacity: isHovered ? 0.6 : 0.3
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute -inset-4 blur-[80px] rounded-full pointer-events-none z-0 transition-opacity duration-500",
          isRecommended ? "bg-green-400/30" : "bg-cyan-400/20"
        )}
      />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay, type: "spring", damping: 20 }}
        className={cn(
          "glass p-8 flex flex-col h-full relative overflow-hidden z-10 animated-bg-gradient",
          isRecommended && "border-green-500/40 shadow-xl scale-105 z-20 shimmer-container",
          isHovered && "shadow-[0_0_30px_rgba(16,185,129,0.4)] border-green-500/50"
        )}
      >
        {/* Spotlight effect */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: spotlightBackground }}
        />

        {/* Glare effect for Pro card */}
        {isRecommended && (
          <motion.div 
            className="absolute inset-0 pointer-events-none z-30"
            style={{ background: glareBackground }}
          />
        )}

        {isRecommended && (
          <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-heading font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider z-40 badge-pulse">
            Populaire
          </div>
        )}

        <div className="mb-8 relative z-40">
          <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">{title}</h3>
          <div className="flex items-baseline gap-1 mb-2 h-10 overflow-hidden">
            <AnimatePresence mode="wait">
              {!isHovered ? (
                <motion.div
                  key="monthly"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-baseline gap-1"
                >
                  <motion.span className={cn(
                    "font-heading font-bold text-4xl",
                    isRecommended ? "bg-gradient-to-r from-green-600 to-cyan-500 bg-clip-text text-transparent" : "text-gray-900"
                  )}>
                    <motion.span>{roundedPrice}</motion.span>€
                  </motion.span>
                  {price > 0 && <span className="text-gray-500 text-sm">/mois</span>}
                </motion.div>
              ) : (
                <motion.div
                  key="yearly"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="flex items-baseline gap-1"
                >
                  <span className="font-heading font-bold text-2xl text-green-600">
                    Soit {price * 10}€/an
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="font-sans text-sm text-gray-500">{description}</p>
        </div>

        <div className="space-y-4 mb-10 flex-grow relative z-40">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-green-600" />
              </div>
              <span className="font-sans text-sm text-gray-700">{feature}</span>
            </div>
          ))}
        </div>

        <div className="relative z-40">
          <LiquidButton 
            className={cn(
              "w-full py-3 justify-center",
              !isRecommended && "bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200 shadow-none"
            )}
          >
            {ctaText}
          </LiquidButton>
        </div>
      </motion.div>
    </div>
  );
}
