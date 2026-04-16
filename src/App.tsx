/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from 'react-hot-toast';
import { Sparkles, ArrowRight, Copy, Check, ArrowLeft, LogOut, History, Trash2 } from 'lucide-react';
import GlassCard from './components/ui/GlassCard';
import LiquidButton from './components/ui/LiquidButton';
import TickerAvis from './components/ui/TickerAvis';
import StepAccordion from './components/ui/StepAccordion';
import PricingCard from './components/ui/PricingCard';
import Logo from './components/ui/Logo';
import ChatPanel from './components/ui/ChatPanel';
import { generateMockPlan } from './lib/mock-ai';
import { cn } from './lib/utils';
import toast from 'react-hot-toast';

function TypewriterTitle() {
  const [phase, setPhase] = useState<'typing' | 'cycling' | 'final'>('typing');
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cycleIndex, setCycleIndex] = useState(0);
  const [isHoveredKodia, setIsHoveredKodia] = useState(false);

  const fullText = "Kodia — Créez votre SaaS sans savoir coder.";
  const cyclingWords = [
    "sans développer.",
    "en quelques clics.",
    "sans complexité.",
    "sans savoir coder."
  ];

  // Typewriter logic with speed variation
  useEffect(() => {
    if (phase === 'typing') {
      if (currentIndex < fullText.length) {
        let speed = 50;
        if (currentIndex < 5) speed = 25; // "Kodia" types very fast
        else if (currentIndex >= 25) speed = 100; // "sans savoir coder." types slower and elegant

        const timeout = setTimeout(() => {
          setDisplayText(prev => prev + fullText[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, speed);
        return () => clearTimeout(timeout);
      } else {
        // Typing finished, start cycling
        setTimeout(() => setPhase('cycling'), 800);
      }
    }
  }, [currentIndex, phase]);

  // Cycling logic
  useEffect(() => {
    if (phase === 'cycling') {
      if (cycleIndex < cyclingWords.length - 1) {
        const timeout = setTimeout(() => {
          setCycleIndex(prev => prev + 1);
        }, 1500);
        return () => clearTimeout(timeout);
      } else {
        setPhase('final');
      }
    }
  }, [cycleIndex, phase]);

  const kodiaLetters = "Kodia".split("");

  return (
    <div className="relative mb-6 min-h-[4.5em] md:min-h-[3.5em] flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-center flex flex-wrap justify-center items-center gap-x-3">
        {/* Kodia Section */}
        <motion.span 
          className="relative inline-flex cursor-default"
          onMouseEnter={() => setIsHoveredKodia(true)}
          onMouseLeave={() => setIsHoveredKodia(false)}
        >
          {kodiaLetters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: 0 }}
              animate={isHoveredKodia ? { 
                y: -3,
                color: '#10B981',
                textShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
              } : { y: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 15,
                delay: i * 0.03 
              }}
              className="font-heading bg-gradient-to-br from-[#0F766E] to-[#D4AF37] bg-clip-text text-transparent"
              style={{ fontWeight: 800 }}
            >
              {displayText.includes(letter) || currentIndex > i ? letter : ""}
            </motion.span>
          ))}
        </motion.span>

        {/* Separator */}
        {currentIndex > 5 && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-heading font-light text-gray-300"
          >
            —
          </motion.span>
        )}

        {/* Créez votre SaaS Section */}
        {currentIndex > 8 && (
          <span className="font-sans font-semibold text-[#1F2937]">
            {displayText.slice(8, 20)}
            <span className="relative">
              {displayText.slice(20, 24)}
              {phase !== 'typing' && currentIndex >= 24 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
                  className="absolute -bottom-1 left-0 w-full h-1 bg-[#10B981] rounded-full blur-[0.5px] origin-left"
                />
              )}
            </span>
            {displayText.slice(24, 25)}
          </span>
        )}

        {/* Cycling Section */}
        <div className="inline-block min-w-[8em]">
          <AnimatePresence mode="wait">
            {phase === 'typing' ? (
              <motion.span
                key="typing-part"
                className="font-accent italic text-[#10B981]"
              >
                {displayText.slice(25)}
              </motion.span>
            ) : (
              <motion.span
                key={cyclingWords[cycleIndex]}
                initial={{ y: 20, opacity: 0, filter: 'blur(5px)' }}
                animate={{ 
                  y: 0, 
                  opacity: 1, 
                  filter: 'blur(0px)',
                  textShadow: phase === 'final' ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none'
                }}
                exit={{ y: -20, opacity: 0, filter: 'blur(5px)' }}
                transition={{ duration: 0.6, ease: "backOut" }}
                className={cn(
                  "font-accent italic text-[#10B981] inline-block",
                  phase === 'final' && "animate-pulse-slow"
                )}
              >
                {cyclingWords[cycleIndex]}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Cursor */}
        {phase === 'typing' && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-10 md:h-14 bg-[#10B981] ml-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          />
        )}
      </h1>
    </div>
  );
}

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-white/80 border-b border-black/5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          {/* Left: Navigation Links */}
          <div className="hidden md:flex items-center gap-8 flex-1">
            <a href="#features" className="text-sm font-heading font-medium text-gray-600 hover:text-green-600 transition-colors">Fonctionnement</a>
            <a href="#pricing" className="text-sm font-heading font-medium text-gray-600 hover:text-green-600 transition-colors">Tarifs</a>
          </div>

          {/* Center: High-Res Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Logo />
          </div>

          {/* Right: Action Button */}
          <div className="flex-1 flex justify-end">
            <LiquidButton onClick={onStart} className="py-2 px-4 text-sm">
              Essayer Kodia
            </LiquidButton>
          </div>
        </div>
      </nav>

      <section className="relative px-6 pt-32 pb-12 md:pt-48 md:pb-20 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8">
            <Sparkles size={16} className="text-green-600" />
            <span className="text-sm font-heading font-medium text-green-700">Propulsé par l'IA</span>
          </div>
          
          <TypewriterTitle />
          
          <p className="text-lg md:text-xl font-sans text-gray-600 max-w-3xl mx-auto mb-10">
            Décrivez votre idée. Kodia vous donne le plan stratégique, puis génère le code pour vous.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <LiquidButton onClick={onStart} className="px-8 py-3 text-lg">
              Commencer maintenant <ArrowRight size={18} />
            </LiquidButton>
            <button className="font-sans text-gray-500 hover:text-green-600 transition-colors animated-underline">
              Déjà membre ? Connexion
            </button>
          </div>
        </motion.div>
      </section>

      <section className="px-6 py-12 max-w-4xl mx-auto">
        <GlassCard className="p-8 md:p-12 text-center" delay={0.1}>
          <p className="font-accent text-xl md:text-3xl text-gray-800 leading-relaxed italic">
            "Tu décris ton idée, Kodia te dit exactement quoi faire étape par étape,<br />
            et à la fin il génère tout le code pour toi."
          </p>
        </GlassCard>
      </section>

      <TickerAvis />

      <section className="px-6 py-20 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-heading font-bold text-center mb-12 text-gray-900"
        >
          Comment ça marche concrètement
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard className="p-8" delay={0}>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-heading font-bold text-green-600">1</span>
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2 text-gray-900">Tu écris ton idée</h3>
            <p className="font-sans text-gray-500">Ex: "Une app de gestion de factures pour freelances"</p>
          </GlassCard>
          
          <GlassCard className="p-8" delay={0.1}>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-heading font-bold text-green-600">2</span>
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2 text-gray-900">Kodia génère un plan</h3>
            <p className="font-sans text-gray-500">Étude de marché, prix, fonctionnalités, branding...</p>
          </GlassCard>
          
          <GlassCard className="p-8" delay={0.2}>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-heading font-bold text-green-600">3</span>
            </div>
            <h3 className="text-xl font-heading font-semibold mb-2 text-gray-900">Tu obtiens un mega prompt</h3>
            <p className="font-sans text-gray-500">À coller dans Google AI Studio pour coder ton SaaS automatiquement</p>
          </GlassCard>
        </div>
      </section>

      <section className="px-6 py-20 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-heading font-bold text-center mb-12 text-gray-900"
        >
          Des tarifs simples, comme notre outil
        </motion.h2>
        
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          <PricingCard 
            title="Gratuit"
            price={0}
            description="Pour tester l'outil et lancer votre première idée."
            features={[
              "5 générations de plans",
              "Accès au dashboard",
              "Communauté Discord"
            ]}
            ctaText="Commencer gratuitement"
            delay={0}
          />
          <PricingCard 
            title="Pro"
            price={19}
            description="Pour les entrepreneurs sérieux qui veulent lancer vite."
            features={[
              "Générations illimitées",
              "Mega prompts avancés",
              "Export PDF",
              "Support prioritaire"
            ]}
            ctaText="Essai 7 jours"
            isRecommended
            delay={0.1}
          />
          <PricingCard 
            title="Enterprise"
            price={49}
            description="Pour les agences et les équipes produit."
            features={[
              "Tout Pro +",
              "API personnalisée",
              "Accompagnement dédié"
            ]}
            ctaText="Contacter l'équipe"
            delay={0.2}
          />
        </div>
      </section>

      <footer className="border-t border-black/5 py-12 mt-12 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Logo className="justify-center mb-4" />
          <p className="font-sans text-gray-500 text-sm">
            © 2026 Kodia. Propulsé par l'IA. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Dashboard({ onBack }: { onBack: () => void }) {
  const [idea, setIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [steps, setSteps] = useState<any[]>([]);
  const [openStep, setOpenStep] = useState<number | null>(null);
  const [megaPrompt, setMegaPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (result: { steps: any[]; megaPrompt: string }) => {
    setIsLoading(true);
    setSteps([]);
    setOpenStep(null);
    
    try {
      // The result is already generated by ChatPanel
      setSteps(result.steps);
      setMegaPrompt(result.megaPrompt);
      toast.success('Plan généré avec succès !', { icon: '✨' });
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du plan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(megaPrompt);
    setCopied(true);
    toast.success('Mega prompt copié !', { icon: '📋' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-black/5 backdrop-blur-xl bg-white/80 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative">
          {/* Left: Back Button */}
          <div className="flex-1">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium hidden sm:inline">Retour</span>
            </button>
          </div>

          {/* Center: High-Res Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Logo />
          </div>

          {/* Right: Account Info */}
          <div className="flex-1 flex justify-end">
            <div className="font-sans text-sm text-gray-500 font-medium">Mon compte</div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ChatPanel onGenerate={handleGenerate} isLoading={isLoading} />
            </motion.div>
          </div>

          <div>
            {!isLoading && steps.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass p-12 text-center"
              >
                <div className="text-6xl mb-6">🌱</div>
                <h3 className="text-xl font-heading font-bold text-gray-800">
                  Ton plan en 8 étapes apparaîtra ici.
                </h3>
                <p className="font-sans text-gray-500 mt-2">
                  Décris ton idée à gauche pour commencer l'aventure.
                </p>
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass p-12 text-center"
              >
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500/10 border-t-green-500 mb-6"></div>
                <h3 className="text-lg font-heading font-bold text-gray-800">
                  Kodia analyse le marché, prépare ton branding...
                </h3>
                <p className="font-sans text-gray-500 mt-2">Cela peut prendre quelques secondes.</p>
              </motion.div>
            )}

            {steps.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-xl font-heading font-bold mb-4 text-gray-900">Ton plan stratégique</h3>
                
                {steps.map((step, index) => (
                  <StepAccordion
                    key={index}
                    step={index + 1}
                    title={step.title}
                    description={step.description}
                    content={step.content}
                    isOpen={openStep === index}
                    onToggle={() => setOpenStep(openStep === index ? null : index)}
                    index={index}
                  />
                ))}

                {megaPrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 glass p-6 border-green-500/20"
                  >
                    <h4 className="font-heading font-bold text-lg mb-4 text-gray-900 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">8</div>
                      Le Mega Prompt
                    </h4>
                    <p className="font-sans text-gray-500 text-sm mb-4">
                      Il compile tout ça en un seul mega prompt que tu colles dans Google AI Studio qui va construire ton SaaS automatiquement.
                    </p>
                    
                    <div className="relative">
                      <div className="bg-gray-100 rounded-xl p-4 border border-green-500/20 font-mono text-sm text-gray-700 h-40 overflow-y-auto custom-scrollbar">
                        {megaPrompt}
                      </div>
                      <button
                        onClick={handleCopyPrompt}
                        className="absolute top-3 right-3 p-2 rounded-lg bg-white border border-gray-200 hover:border-green-500 hover:text-green-600 transition-all shadow-sm"
                      >
                        {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <div className="relative min-h-screen font-sans antialiased bg-[#FAFAFA]">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="bg-grid-pattern fixed inset-0 pointer-events-none z-0" />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {view === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LandingPage onStart={() => setView('dashboard')} />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Dashboard onBack={() => setView('landing')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            color: '#111827',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 500,
          },
        }}
      />
    </div>
  );
}
