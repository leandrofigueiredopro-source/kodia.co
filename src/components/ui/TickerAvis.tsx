import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const avis = [
  { name: "Thomas", role: "Freelance Dev", text: "Kodia a transformé ma façon de lancer des projets.", benefit: "Gain de temps de 2 semaines sur le MVP." },
  { name: "Sarah", role: "Marketing", text: "Le mega prompt est bluffant de précision.", benefit: "Landing page prête en 5 minutes." },
  { name: "Marc", role: "Entrepreneur", text: "Enfin un outil qui comprend le business.", benefit: "Stratégie de prix validée par le marché." },
  { name: "Julie", role: "Designer", text: "Le branding suggéré était déjà parfait.", benefit: "Identité visuelle cohérente dès le jour 1." },
  { name: "Kevin", role: "Indie Hacker", text: "J'ai lancé mon SaaS en un weekend.", benefit: "Code propre et prêt à l'emploi." },
  { name: "Léa", role: "Product Manager", text: "L'étude de marché m'a ouvert les yeux.", benefit: "Ciblage client affiné instantanément." },
  { name: "Antoine", role: "SaaS Founder", text: "Indispensable pour tout nouveau projet.", benefit: "Mega prompt compatible Google AI Studio." },
  { name: "Chloé", role: "Growth Hacker", text: "La séquence email convertit déjà.", benefit: "Automatisation du funnel dès le départ." },
];

export default function TickerAvis() {
  return (
    <div className="w-full py-12 overflow-hidden ticker-container">
      <motion.div
        animate={{ x: [0, -1600] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex gap-6 whitespace-nowrap"
      >
        {[...avis, ...avis].map((item, i) => (
          <div key={i} className="flip-card w-[320px] h-[200px] flex-shrink-0">
            <div className="flip-card-inner">
              <div className="flip-card-front">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 font-heading font-bold">
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-sm text-gray-900">{item.name}</div>
                    <div className="font-sans text-xs text-gray-500">{item.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-green-500 text-green-500" />)}
                </div>
                <p className="font-accent text-base text-gray-700 italic whitespace-normal leading-tight">"{item.text}"</p>
              </div>
              <div className="flip-card-back">
                <h4 className="font-heading text-green-600 font-bold text-sm mb-2">Ce que Kodia m'a apporté :</h4>
                <p className="font-sans text-gray-800 text-sm font-medium whitespace-normal">{item.benefit}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
