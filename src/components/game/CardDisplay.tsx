'use client';

import { useGameStore } from '@/store/gameStore';
import { getCardDef, getEffectiveCardDef, CARD_EMOJI, CLASS_CARD_BORDER } from '@/game/data/cards';
import { motion, AnimatePresence } from 'framer-motion';

const rarityGlow: Record<string, string> = {
  starter: '',
  common: 'shadow-emerald-500/20',
  rare: 'shadow-blue-500/30',
  legendary: 'shadow-amber-500/40 shadow-lg',
  curse: 'shadow-purple-500/40',
};

const rarityLabels: Record<string, string> = {
  starter: 'INICIAL',
  common: 'COMÚN',
  rare: 'RARO',
  legendary: 'LEGENDARIO',
  curse: 'MALDICIÓN',
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

  const effectiveDef = getEffectiveCardDef(card);
  const baseDef = getCardDef(card.defId);
  const canPlay = player.energy >= effectiveDef.cost && !isAnimating;

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
        CLASS_CARD_BORDER[baseDef.classPath] || CLASS_CARD_BORDER.vagabundo
      } ${
        baseDef.rarity === 'curse' ? 'border-purple-500/40 bg-purple-950/40' : ''
      } ${
        canPlay
          ? 'hover:border-white/40 hover:brightness-110 active:brightness-90'
          : 'opacity-40 cursor-not-allowed grayscale-[30%]'
      } ${rarityGlow[baseDef.rarity]}`}
    >
      {/* Upgrade indicator */}
      {card.upgraded && (
        <div className="absolute top-2 left-8 w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center text-[8px] text-white font-bold z-10 shadow-lg shadow-cyan-500/40">
          +
        </div>
      )}

      {/* Cost badge */}
      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/30">
        {effectiveDef.cost}
      </div>
      <div className="absolute top-2 right-2 text-sm opacity-60">
        {targetIcons[baseDef.target]}
      </div>
      <div className="flex flex-col items-center justify-center h-full px-2 pt-8 pb-2 text-center">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg mb-1.5 bg-black/40 border border-white/10 flex items-center justify-center text-2xl">
          {CARD_EMOJI[baseDef.id] || '🃏'}
        </div>
        <h3 className="text-white/90 text-[11px] sm:text-xs font-semibold leading-tight mb-1 px-1 line-clamp-2">
          {effectiveDef.name}
          {card.upgraded && <span className="text-cyan-400 ml-0.5">+</span>}
        </h3>
        <p className="text-white/40 text-[9px] sm:text-[10px] leading-snug px-1 line-clamp-2 mb-1.5">
          {effectiveDef.description}
        </p>
        <div className="flex items-center gap-1 flex-wrap justify-center">
          {effectiveDef.damage && <span className="text-[9px] text-red-300/80 bg-red-950/50 px-1 py-0.5 rounded">⚔{effectiveDef.damage}</span>}
          {effectiveDef.heal && <span className="text-[9px] text-green-300/80 bg-green-950/50 px-1 py-0.5 rounded">❤{effectiveDef.heal}</span>}
          {effectiveDef.block && <span className="text-[9px] text-amber-300/80 bg-amber-950/50 px-1 py-0.5 rounded">🛡{effectiveDef.block}</span>}
          {effectiveDef.strengthBuff && <span className="text-[9px] text-orange-300/80 bg-orange-950/50 px-1 py-0.5 rounded">💪+{effectiveDef.strengthBuff}</span>}
          {effectiveDef.drawCards && <span className="text-[9px] text-blue-300/80 bg-blue-950/50 px-1 py-0.5 rounded">🃏+{effectiveDef.drawCards}</span>}
          {effectiveDef.aoeDamage && <span className="text-[9px] text-red-300/80 bg-red-950/50 px-1 py-0.5 rounded">💥{effectiveDef.aoeDamage}</span>}
          {effectiveDef.burn && <span className="text-[9px] text-orange-300/80 bg-orange-950/50 px-1 py-0.5 rounded">🔥{effectiveDef.burn}</span>}
          {effectiveDef.poison && <span className="text-[9px] text-green-300/80 bg-green-950/50 px-1 py-0.5 rounded">☠{effectiveDef.poison}</span>}
          {effectiveDef.freeze && <span className="text-[9px] text-cyan-300/80 bg-cyan-950/50 px-1 py-0.5 rounded">❄{effectiveDef.freeze}</span>}
          {effectiveDef.selfDamage && <span className="text-[9px] text-rose-300/80 bg-rose-950/50 px-1 py-0.5 rounded">🩸-{effectiveDef.selfDamage}</span>}
          {effectiveDef.energyGain && <span className="text-[9px] text-cyan-300/80 bg-cyan-950/50 px-1 py-0.5 rounded">⚡{effectiveDef.energyGain > 0 ? '+' : ''}{effectiveDef.energyGain}</span>}
          {effectiveDef.attackBuffTurn && <span className="text-[9px] text-yellow-300/80 bg-yellow-950/50 px-1 py-0.5 rounded">🎼+{effectiveDef.attackBuffTurn}</span>}
          {effectiveDef.executeThreshold && <span className="text-[9px] text-red-300/80 bg-red-950/50 px-1 py-0.5 rounded">💀E</span>}
          {effectiveDef.weaken && <span className="text-[9px] text-purple-300/80 bg-purple-950/50 px-1 py-0.5 rounded">👁-{effectiveDef.weaken}</span>}
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

// ─── Deck Card Picker (for rest/shop card removal & upgrade) ──

export function DeckCardPicker({ mode }: { mode: 'remove' | 'upgrade' }) {
  const deck = useGameStore(s => s.deck);
  const removeCardFromDeck = useGameStore(s => s.removeCardFromDeck);
  const upgradeCardInDeck = useGameStore(s => s.upgradeCardInDeck);

  // Deduplicate by defId for display (show unique cards with count)
  const uniqueCards: { defId: string; count: number; instances: typeof deck; upgraded: boolean }[] = [];
  const seen = new Map<string, typeof deck>();

  for (const card of deck) {
    const key = `${card.defId}_${card.upgraded}`;
    if (!seen.has(key)) {
      seen.set(key, []);
    }
    seen.get(key)!.push(card);
  }

  for (const [key, instances] of seen) {
    const first = instances[0];
    uniqueCards.push({
      defId: first.defId,
      count: instances.length,
      instances,
      upgraded: first.upgraded,
    });
  }

  return (
    <div className="w-full max-w-md max-h-[50vh] overflow-y-auto px-2">
      <div className="grid grid-cols-2 gap-2">
        {uniqueCards.map((uc) => {
          const def = getCardDef(uc.defId);
          const canUpgrade = mode === 'upgrade' && def.upgradeBonus && !uc.upgraded;

          return (
            <motion.button
              key={`${uc.defId}_${uc.upgraded}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={mode === 'remove' || canUpgrade ? { scale: 1.05, y: -2 } : {}}
              whileTap={mode === 'remove' || canUpgrade ? { scale: 0.95 } : {}}
              onClick={() => {
                const card = uc.instances[0];
                if (mode === 'remove') {
                  removeCardFromDeck(card.uid);
                } else if (canUpgrade) {
                  upgradeCardInDeck(card.uid);
                }
              }}
              className={`relative p-2.5 rounded-lg border text-left transition-all ${
                def.rarity === 'curse'
                  ? 'border-purple-500/30 bg-purple-950/30'
                  : CLASS_CARD_BORDER[def.classPath] || CLASS_CARD_BORDER.vagabundo
              } ${
                mode === 'remove'
                  ? 'hover:border-red-400/60 hover:bg-red-950/30 cursor-pointer'
                  : canUpgrade
                    ? 'hover:border-cyan-400/60 hover:bg-cyan-950/30 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {uc.count > 1 && (
                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/20 text-white/70 text-[9px] font-bold flex items-center justify-center">
                  ×{uc.count}
                </div>
              )}
              {uc.upgraded && (
                <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-cyan-500 text-[7px] text-white font-bold flex items-center justify-center">
                  +
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xl">{CARD_EMOJI[def.id] || '🃏'}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-white/90 text-[11px] font-semibold truncate">
                    {def.name}{uc.upgraded && <span className="text-cyan-400">+</span>}
                  </p>
                  <p className="text-white/40 text-[9px] truncate">{def.description}</p>
                  {mode === 'upgrade' && canUpgrade && (
                    <p className="text-cyan-400/70 text-[9px] mt-0.5">Click para mejorar</p>
                  )}
                  {mode === 'upgrade' && (uc.upgraded || !def.upgradeBonus) && (
                    <p className="text-white/20 text-[9px] mt-0.5">
                      {uc.upgraded ? 'Ya mejorada' : 'No mejorable'}
                    </p>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
