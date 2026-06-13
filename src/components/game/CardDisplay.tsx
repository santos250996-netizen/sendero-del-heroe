'use client';

import { useGameStore } from '@/store/gameStore';
import { getCardDef, CARD_EMOJI, CLASS_CARD_BORDER } from '@/game/data/cards';
import { motion, AnimatePresence } from 'framer-motion';

const rarityGlow: Record<string, string> = {
  starter: '',
  common: 'shadow-emerald-500/20',
  rare: 'shadow-blue-500/30',
  legendary: 'shadow-amber-500/40 shadow-lg',
};

const rarityLabels: Record<string, string> = {
  starter: 'INICIAL',
  common: 'COMÚN',
  rare: 'RARO',
  legendary: 'LEGENDARIO',
};

const targetIcons: Record<string, string> = {
  enemy: '🎯',
  self: '💚',
  all_enemies: '💥',
  passive: '🎌',
};

export function CardInHand({ cardUid }: { cardUid: string }) {
  const hand = useGameStore(s => s.hand);
  const player = useGameStore(s => s.player);
  const playCard = useGameStore(s => s.playCard);
  const isAnimating = useGameStore(s => s.isAnimating);

  const card = hand.find(c => c.uid === cardUid);
  if (!card) return null;

  const def = getCardDef(card.defId);
  const canPlay = player.energy >= def.cost && !isAnimating;

  return (
    <motion.div
      layout
      initial={{ y: 60, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 40, opacity: 0, scale: 0.6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      whileHover={canPlay ? { y: -16, scale: 1.05 } : {}}
      whileTap={canPlay ? { scale: 0.95 } : {}}
      onClick={() => canPlay && playCard(cardUid)}
      className={`relative flex-shrink-0 w-[115px] sm:w-[135px] h-[165px] sm:h-[190px] rounded-xl border cursor-pointer transition-colors select-none overflow-hidden ${
        CLASS_CARD_BORDER[def.classPath] || CLASS_CARD_BORDER.vagabundo
      } ${
        canPlay
          ? 'hover:border-white/40 hover:brightness-110 active:brightness-90'
          : 'opacity-40 cursor-not-allowed grayscale-[30%]'
      } ${rarityGlow[def.rarity]}`}
    >
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/30">
        {def.cost}
      </div>
      <div className="absolute top-2 right-2 text-sm opacity-60">
        {targetIcons[def.target]}
      </div>
      <div className="flex flex-col items-center justify-center h-full px-2 pt-8 pb-2 text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg mb-1.5 bg-black/40 border border-white/10 flex items-center justify-center text-2xl">
          {CARD_EMOJI[def.id] || '🃏'}
        </div>
        <h3 className="text-white/90 text-[11px] sm:text-xs font-semibold leading-tight mb-1 px-1 line-clamp-2">
          {def.name}
        </h3>
        <p className="text-white/40 text-[9px] sm:text-[10px] leading-snug px-1 line-clamp-2 mb-1.5">
          {def.description}
        </p>
        <div className="flex items-center gap-1 flex-wrap justify-center">
          {def.damage && <span className="text-[9px] text-red-300/80 bg-red-950/50 px-1 py-0.5 rounded">⚔{def.damage}</span>}
          {def.heal && <span className="text-[9px] text-green-300/80 bg-green-950/50 px-1 py-0.5 rounded">❤{def.heal}</span>}
          {def.block && <span className="text-[9px] text-amber-300/80 bg-amber-950/50 px-1 py-0.5 rounded">🛡{def.block}</span>}
          {def.strengthBuff && <span className="text-[9px] text-orange-300/80 bg-orange-950/50 px-1 py-0.5 rounded">💪+{def.strengthBuff}</span>}
          {def.drawCards && <span className="text-[9px] text-blue-300/80 bg-blue-950/50 px-1 py-0.5 rounded">🃏+{def.drawCards}</span>}
          {def.aoeDamage && <span className="text-[9px] text-red-300/80 bg-red-950/50 px-1 py-0.5 rounded">💥{def.aoeDamage}</span>}
          {def.burn && <span className="text-[9px] text-orange-300/80 bg-orange-950/50 px-1 py-0.5 rounded">🔥{def.burn}</span>}
          {def.poison && <span className="text-[9px] text-green-300/80 bg-green-950/50 px-1 py-0.5 rounded">☠{def.poison}</span>}
          {def.freeze && <span className="text-[9px] text-cyan-300/80 bg-cyan-950/50 px-1 py-0.5 rounded">❄{def.freeze}</span>}
          {def.selfDamage && <span className="text-[9px] text-rose-300/80 bg-rose-950/50 px-1 py-0.5 rounded">🩸-{def.selfDamage}</span>}
          {def.energyGain && <span className="text-[9px] text-cyan-300/80 bg-cyan-950/50 px-1 py-0.5 rounded">⚡+{def.energyGain}</span>}
          {def.attackBuffTurn && <span className="text-[9px] text-yellow-300/80 bg-yellow-950/50 px-1 py-0.5 rounded">🎼+{def.attackBuffTurn}</span>}
          {def.executeThreshold && <span className="text-[9px] text-red-300/80 bg-red-950/50 px-1 py-0.5 rounded">💀E</span>}
          {def.weaken && <span className="text-[9px] text-purple-300/80 bg-purple-950/50 px-1 py-0.5 rounded">👁-{def.weaken}</span>}
        </div>
      </div>
    </motion.div>
  );
}

export function HandDisplay() {
  const hand = useGameStore(s => s.hand);
  const phase = useGameStore(s => s.phase);
  if (phase !== 'battle') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      <div
        className="flex justify-center gap-2 sm:gap-3 px-3 sm:px-6 pb-4 sm:pb-6 pt-8 overflow-x-auto"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <AnimatePresence mode="popLayout">
          {hand.map(card => (
            <CardInHand key={card.uid} cardUid={card.uid} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Reward Card ───────────────────────────────────────────

export function RewardCard({ cardUid, selected }: { cardUid: string; selected: boolean }) {
  const toggleRewardCard = useGameStore(s => s.toggleRewardCard);
  const card = useGameStore(s => s.rewardCards.find(c => c.uid === cardUid));
  if (!card) return null;
  const def = getCardDef(card.defId);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: selected ? 1.03 : 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => toggleRewardCard(cardUid)}
      className={`relative flex-shrink-0 w-[155px] sm:w-[175px] h-[225px] sm:h-[250px] rounded-xl border-2 cursor-pointer select-none overflow-hidden transition-all duration-200 ${
        selected
          ? 'border-emerald-400/80 bg-emerald-950/50 shadow-lg shadow-emerald-500/30'
          : CLASS_CARD_BORDER[def.classPath] || CLASS_CARD_BORDER.vagabundo
      } hover:brightness-110`}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold z-10 shadow-lg">✓</div>
      )}
      <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/30">
        {def.cost}
      </div>
      <div className="flex flex-col items-center justify-center h-full px-4 pt-10 pb-4 text-center">
        <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-lg mb-2.5 bg-black/40 border border-white/10 flex items-center justify-center text-3xl sm:text-4xl">
          {CARD_EMOJI[def.id] || '🃏'}
        </div>
        <h3 className="text-white/90 text-sm sm:text-base font-semibold leading-tight mb-1.5 px-1">{def.name}</h3>
        <p className="text-white/50 text-[11px] sm:text-xs leading-snug px-1 mb-2.5">{def.description}</p>
        <div className="flex items-center gap-1 flex-wrap justify-center">
          {def.damage && <span className="text-[10px] text-red-300/80 bg-red-950/50 px-1.5 py-0.5 rounded">⚔{def.damage}</span>}
          {def.heal && <span className="text-[10px] text-green-300/80 bg-green-950/50 px-1.5 py-0.5 rounded">❤{def.heal}</span>}
          {def.block && <span className="text-[10px] text-amber-300/80 bg-amber-950/50 px-1.5 py-0.5 rounded">🛡{def.block}</span>}
          {def.strengthBuff && <span className="text-[10px] text-orange-300/80 bg-orange-950/50 px-1.5 py-0.5 rounded">💪+{def.strengthBuff}</span>}
          {def.drawCards && <span className="text-[10px] text-blue-300/80 bg-blue-950/50 px-1.5 py-0.5 rounded">🃏+{def.drawCards}</span>}
          {def.burn && <span className="text-[10px] text-orange-300/80 bg-orange-950/50 px-1.5 py-0.5 rounded">🔥{def.burn}</span>}
          {def.poison && <span className="text-[10px] text-green-300/80 bg-green-950/50 px-1.5 py-0.5 rounded">☠{def.poison}</span>}
          {def.aoeDamage && <span className="text-[10px] text-red-300/80 bg-red-950/50 px-1.5 py-0.5 rounded">💥{def.aoeDamage}</span>}
          {def.selfDamage && <span className="text-[10px] text-rose-300/80 bg-rose-950/50 px-1.5 py-0.5 rounded">🩸-{def.selfDamage}</span>}
          {def.energyGain && <span className="text-[10px] text-cyan-300/80 bg-cyan-950/50 px-1.5 py-0.5 rounded">⚡+{def.energyGain}</span>}
          {def.attackBuffTurn && <span className="text-[10px] text-yellow-300/80 bg-yellow-950/50 px-1.5 py-0.5 rounded">🎼+{def.attackBuffTurn}</span>}
          {def.executeThreshold && <span className="text-[10px] text-red-300/80 bg-red-950/50 px-1.5 py-0.5 rounded">💀E</span>}
          {def.weaken && <span className="text-[10px] text-purple-300/80 bg-purple-950/50 px-1.5 py-0.5 rounded">👁-{def.weaken}</span>}
          {def.freeze && <span className="text-[10px] text-cyan-300/80 bg-cyan-950/50 px-1.5 py-0.5 rounded">❄{def.freeze}</span>}
        </div>
      </div>
    </motion.div>
  );
}
