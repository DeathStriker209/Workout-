import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EASE } from './ui';

// Opening animation:
// 1. the logo pops up from the bottom to the centre
// 2. the logo's light blue floods out from behind it and fills the screen
// 3. the name appears, then the whole splash fades away to reveal the app
export function Splash({ onReveal, onDone }: { onReveal: () => void; onDone: () => void }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<'rise' | 'fill' | 'out'>('rise');
  useEffect(() => { if (phase === 'out') onReveal(); }, [phase, onReveal]);

  useEffect(() => {
    const t = reduce
      ? [window.setTimeout(() => setPhase('out'), 500)]
      : [window.setTimeout(() => setPhase('fill'), 720), window.setTimeout(() => setPhase('out'), 1750)];
    return () => t.forEach(clearTimeout);
  }, [reduce]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-[#030712] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={phase === 'out' ? { opacity: 0, scale: 1.06 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE }}
      onAnimationComplete={() => phase === 'out' && onDone()}
      aria-hidden
    >
      {/* blue flood, grows from the logo's centre */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-[260vmax] h-[260vmax] rounded-full"
        style={{ x: '-50%', y: '-50%', background: 'linear-gradient(45deg, #2f96ff 30%, #77ccff 70%)' }}
        initial={{ scale: 0 }}
        animate={{ scale: phase === 'rise' ? 0 : 1 }}
        transition={{ duration: 0.7, ease: [0.7, 0, 0.3, 1] }}
      />
      <div className="relative flex flex-col items-center">
        <motion.img
          src="/logo.png" alt=""
          className="w-28 h-28 rounded-[30px]"
          initial={{ y: '55vh', scale: 0.7, opacity: 0 }}
          animate={phase === 'rise'
            ? { y: 0, scale: 1, opacity: 1, boxShadow: '0 24px 60px rgba(47,150,255,.45)' }
            : { y: -14, scale: 1.08, opacity: 1, boxShadow: '0 0 0 rgba(47,150,255,0)' }}
          transition={phase === 'rise'
            ? { type: 'spring', stiffness: 190, damping: 17, mass: 0.9 }
            : { duration: 0.6, ease: EASE }}
        />
        <motion.div
          className="font-display text-[2rem] text-[#1a1330] mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={phase === 'rise' ? { opacity: 0, y: 10 } : { opacity: 1, y: -6 }}
          transition={{ duration: 0.45, ease: EASE, delay: phase === 'fill' ? 0.35 : 0 }}
        >
          ApexLift
        </motion.div>
      </div>
    </motion.div>
  );
}
