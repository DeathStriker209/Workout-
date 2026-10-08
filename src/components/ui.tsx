import React, { useEffect } from 'react';
import { AnimatePresence, HTMLMotionProps, motion } from 'motion/react';

// Shared easing: fast start, soft landing (same family as iOS/Android sheets)
export const EASE = [0.22, 1, 0.36, 1] as const;

type TapProps = HTMLMotionProps<'button'> & {
  /** ms to wait before running onClick, so the shrink-and-bounce is visible before the screen changes */
  delay?: number;
  scale?: number;
};

/** Any tappable thing: shrinks while pressed, springs back on release. */
export const Tap = React.forwardRef<HTMLButtonElement, TapProps>(function Tap(
  { delay = 0, scale = 0.95, onClick, type = 'button', ...rest }, ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale }}
      transition={{ type: 'spring', stiffness: 700, damping: 30, mass: 0.6 }}
      onClick={(e) => {
        if (!onClick) return;
        if (delay) { e.persist?.(); window.setTimeout(() => onClick(e), delay); } else onClick(e);
      }}
      {...rest}
    />
  );
});

/** Bottom sheet that slides up from the bottom; drag down or tap outside to close. */
export function Sheet({ open, onClose, children, label }: { open: boolean; onClose: () => void; children: React.ReactNode; label: string }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={label}>
          <motion.div className="absolute inset-0 bg-black/65" onClick={onClose}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
          <motion.div
            className="relative w-full max-w-md bg-[#121217] rounded-t-[28px] px-5 pt-3 pb-[calc(2rem+env(safe-area-inset-bottom))] border-t border-white/5 shadow-[0_-20px_60px_rgba(0,0,0,.5)]"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ duration: 0.32, ease: EASE }}
            drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, i) => { if (i.offset.y > 90 || i.velocity.y > 600) onClose(); }}
          >
            <div className="w-11 h-1.5 bg-white/15 rounded-full mx-auto mb-5" />
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Centered confirmation popup. */
export function Confirm({ open, icon, title, body, confirmLabel, onConfirm, onCancel }: {
  open: boolean; icon: React.ReactNode; title: string; body: string; confirmLabel: string;
  onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6" role="alertdialog" aria-modal="true" aria-label={title}>
          <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onCancel}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} />
          <motion.div className="relative w-full max-w-[340px] bg-[#17171c] border border-white/5 rounded-[28px] p-6 text-center"
            initial={{ opacity: 0, scale: 0.88, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 6 }}
            transition={{ type: 'spring', stiffness: 520, damping: 34 }}>
            <motion.div className="w-16 h-16 rounded-full bg-[#3a1d18] text-[#ff5733] flex items-center justify-center mx-auto"
              initial={{ rotate: -90, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.05 }}>
              {icon}
            </motion.div>
            <h2 className="font-display text-xl mt-4">{title}</h2>
            <p className="text-[#9a9aa3] text-[0.95rem] leading-relaxed mt-2">{body}</p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <Tap onClick={onCancel} className="h-12 rounded-2xl bg-[#26262e] font-semibold">Cancel</Tap>
              <Tap onClick={onConfirm} className="h-12 rounded-2xl bg-[#ff5733] font-semibold">{confirmLabel}</Tap>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
