'use client';

import { useGameStore } from '@/store/gameStore';
import { getCardDef } from '@/game/data/cards';
import { motion, AnimatePresence } from 'framer-motion';

const rarityColors: Record<string, string> = {
  starter: 'border-stone-400/30 bg-stone-900/60',
  common: 'border-emerald-400/30 bg-emerald-950/40',
  rare: 'border-blue-400/30 bg-blue-950/40',
  legendary: 'border-amber-400/50 bg-amber-950/50',
};

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
      className={`relative flex-shrink-0 w-[120px] sm:w-[140px] h-[170px] sm:h-[195px] rounded-xl border cursor-pointer transition-colors select-none overflow-hidden ${
        rarityColors[def.rarity]
      } ${
        canPlay
          ? 'hover:border-white/40 hover:brightness-110 active:brightness-90'
          : 'opacity-40 cursor-not-allowed grayscale-[30%]'
      } ${rarityGlow[def.rarity]}`}
    >
      {/* Cost gem */}
      <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-blue-500/30">
        {def.cost}
      </div>

      {/* Target icon */}
      <div className="absolute top-2 right-2 text-sm opacity-60">
        {targetIcons[def.target]}
      </div>

      {/* Rarity label */}
      <div className="absolute top-9 left-2">
        <span className="text-[8px] tracking-wider text-white/30 uppercase font-medium">
          {rarityLabels[def.rarity]}
        </span>
      </div>

      {/* Card content */}
      <div className="flex flex-col items-center justify-center h-full px-3 pt-10 pb-3 text-center">
        {/* Art placeholder */}
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg mb-2 bg-black/40 border border-white/10 flex items-center justify-center text-2xl`}>
          {getCardEmoji(def.id)}
        </div>

        {/* Name */}
        <h3 className="text-white/90 text-xs sm:text-sm font-semibold leading-tight mb-1.5 px-1 line-clamp-2">
          {def.name}
        </h3>

        {/* Description */}
        <p className="text-white/50 text-[10px] sm:text-xs leading-snug px-1 line-clamp-3 mb-2">
          {def.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {def.damage && (
            <span className="text-[10px] text-red-300/80 bg-red-950/50 px-1.5 py-0.5 rounded">
              ⚔{def.damage}
            </span>
          )}
          {def.heal && (
            <span className="text-[10px] text-green-300/80 bg-green-950/50 px-1.5 py-0.5 rounded">
              ❤{def.heal}
            </span>
          )}
          {def.block && (
            <span className="text-[10px] text-amber-300/80 bg-amber-950/50 px-1.5 py-0.5 rounded">
              🛡{def.block}
            </span>
          )}
          {def.strengthBuff && (
            <span className="text-[10px] text-orange-300/80 bg-orange-950/50 px-1.5 py-0.5 rounded">
              💪+{def.strengthBuff}
            </span>
          )}
          {def.drawCards && (
            <span className="text-[10px] text-blue-300/80 bg-blue-950/50 px-1.5 py-0.5 rounded">
              🃏+{def.drawCards}
            </span>
          )}
          {def.armorPierce && (
            <span className="text-[10px] text-purple-300/80 bg-purple-950/50 px-1.5 py-0.5 rounded">
              ✨Perfora
            </span>
          )}
          {def.aoeDamage && (
            <span className="text-[10px] text-red-300/80 bg-red-950/50 px-1.5 py-0.5 rounded">
              💥{def.aoeDamage}
            </span>
          )}
          {def.nextAttackBuff && def.target === 'passive' && (
            <span className="text-[10px] text-yellow-300/80 bg-yellow-950/50 px-1.5 py-0.5 rounded">
              🎌+{def.nextAttackBuff}
            </span>
          )}
          {def.damageMultiplier && def.id !== 'golpe_leyenda' && (
            <span className="text-[10px] text-rose-300/80 bg-rose-950/50 px-1.5 py-0.5 rounded">
              📈Escala
            </span>
          )}
          {def.id === 'golpe_leyenda' && (
            <span className="text-[10px] text-amber-300/80 bg-amber-950/50 px-1.5 py-0.5 rounded">
              👑Fuerza×3
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function getCardEmoji(cardId: string): string {
  const map: Record<string, string> = {
    golpe_basico: '👊',
    escudo_ramas: '🌿',
    grito_guerra: '📯',
    meditacion: '🧘',
    espada_rota: '🗡️',
    fuerza_salvaje: '🔥',
    bandera_batalla: '🏴',
    resiliencia: '🛡️',
    furia_exilio: '⚡',
    golpe_leyenda: '👑',
  };
  return map[cardId] || '🃏';
}

export function HandDisplay() {
  const hand = useGameStore(s => s.hand);
  const phase = useGameStore(s => s.phase);

  if (phase !== 'battle') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20">
      {/* Hand area */}
      <div className="flex justify-center gap-2 sm:gap-3 px-3 sm:px-6 pb-4 sm:pb-6 pt-8 overflow-x-auto"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
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

// Reward card (bigger, clickable for selection)
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
      className={`relative flex-shrink-0 w-[160px] sm:w-[180px] h-[230px] sm:h-[260px] rounded-xl border-2 cursor-pointer select-none overflow-hidden transition-all duration-200 ${
        selected
          ? 'border-emerald-400/80 bg-emerald-950/50 shadow-lg shadow-emerald-500/30'
          : rarityColors[def.rarity]
      } hover:brightness-110`}
    >
      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold z-10 shadow-lg">
          ✓
        </div>
      )}

      {/* Cost gem */}
      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-base font-bold shadow-lg shadow-blue-500/30">
        {def.cost}
      </div>

      {/* Target icon */}
      <div className="absolute top-3 right-3 text-base opacity-60">
        {targetIcons[def.target]}
      </div>

      {/* Rarity label */}
      <div className="absolute top-11 left-3">
        <span className="text-[9px] tracking-wider text-white/30 uppercase font-medium">
          {rarityLabels[def.rarity]}
        </span>
      </div>

      {/* Card content */}
      <div className="flex flex-col items-center justify-center h-full px-4 pt-12 pb-4 text-center">
        <div className="w-20 h-20 rounded-lg mb-3 bg-black/40 border border-white/10 flex items-center justify-center text-4xl">
          {getCardEmoji(def.id)}
        </div>

        <h3 className="text-white/90 text-base font-semibold leading-tight mb-2 px-1">
          {def.name}
        </h3>

        <p className="text-white/50 text-xs leading-snug px-1 mb-3">
          {def.description}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {def.damage && (
            <span className="text-[11px] text-red-300/80 bg-red-950/50 px-2 py-0.5 rounded">
              ⚔{def.damage}
            </span>
          )}
          {def.heal && (
            <span className="text-[11px] text-green-300/80 bg-green-950/50 px-2 py-0.5 rounded">
              ❤{def.heal}
            </span>
          )}
          {def.block && (
            <span className="text-[11px] text-amber-300/80 bg-amber-950/50 px-2 py-0.5 rounded">
              🛡{def.block}
            </span>
          )}
          {def.strengthBuff && (
            <span className="text-[11px] text-orange-300/80 bg-orange-950/50 px-2 py-0.5 rounded">
              💪+{def.strengthBuff}
            </span>
          )}
          {def.drawCards && (
            <span className="text-[11px] text-blue-300/80 bg-blue-950/50 px-2 py-0.5 rounded">
              🃏+{def.drawCards}
            </span>
          )}
          {def.armorPierce && (
            <span className="text-[11px] text-purple-300/80 bg-purple-950/50 px-2 py-0.5 rounded">
              ✨Perfora
            </span>
          )}
          {def.aoeDamage && (
            <span className="text-[11px] text-red-300/80 bg-red-950/50 px-2 py-0.5 rounded">
              💥{def.aoeDamage}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
