import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StepAccordionProps {
  key?: React.Key;
  step: number;
  title: string;
  description: string;
  content: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

export default function StepAccordion({ step, title, description, content, isOpen, onToggle, index }: StepAccordionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={cn(
        "glass overflow-hidden cursor-pointer font-sans",
        isOpen && "border-green-500/40 bg-green-500/5"
      )}
      onClick={onToggle}
      layout
    >
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold transition-all",
            isOpen 
              ? "bg-gradient-to-br from-green-500 to-cyan-500 text-white shadow-lg shadow-green-500/30" 
              : "bg-green-500/10 text-green-600 border border-green-500/20"
          )}>
            {step}
          </div>
          <div>
            <h4 className="font-heading font-semibold text-lg text-gray-900">{title}</h4>
            <p className="font-sans text-sm text-gray-500 line-clamp-1">{description}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <ChevronDown size={20} className="text-gray-400" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2 border-t border-black/5">
              <div className="bg-gray-50 rounded-xl p-4 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap border border-black/5">
                {content}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-green-600 font-heading font-medium">
                <CheckCircle2 size={14} />
                Étape validée par Kodia
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
