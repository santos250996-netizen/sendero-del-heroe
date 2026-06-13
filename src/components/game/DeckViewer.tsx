'use client';

import { useGameStore } from '@/store/gameStore';
import { getCardDef, getEffectiveCardDef, CARD_EMOJI, CLASS_CARD_BORDER } from '@/game/data/cards';
import { motion, AnimatePresence } from 'framer-motion';

const rarityLabels: Record<string, string> = {
  starter: 'INICIAL',
  common: 'COMÚN',
  rare: 'RARO',
  legendary: 'LEGENDARIO',
  curse: 'MALDICIÓN',
};

const rarityColors: Record<string, string> = {
  starter: 'text-stone-400',
  common: 'text-emerald-400',
  rare: 'text-blue-400',
  legendary: 'text-amber-400',
  curse: 'text-purple-400',
};

export function DeckViewer() {
  const viewingDeck = useGameStore(s => s.viewingDeck);
  const setViewingDeck = useGameStore(s => s.setViewingDeck);
  const deck = useGameStore(s => s.deck);
  const player = useGameStore(s => s.player);

  if (!viewingDeck) return null;

  // Group by defId + upgraded status
  const groups: { defId: string; upgraded: boolean; count: number; instances: typeof deck }[] = [];
  const seen = new Map<string, typeof deck>();
  for (const card of deck) {
    const key = `${card.defId}_${card.upgraded}`;
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key)!.push(card);
  }
  for (const [key, instances] of seen) {
    groups.push({
      defId: instances[0].defId,
      upgraded: instances[0].upgraded,
      count: instances.length,
      instances,
    });
  }

  const deckSize = deck.length;
  const isHeavy = deckSize > 15;
  const upgradedCount = deck.filter(c => c.upgraded).length;
  const curseCount = deck.filter(c => {
    try { return getCardDef(c.defId).rarity === 'curse'; } catch { return false; }
  }).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => { if (e.target === e.currentTarget) setViewingDeck(false); }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg max-h-[85vh] bg-gradient-to-b from-[#141428] to-[#0d0d1a] border border-white/15 rounded-2xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold text-amber-300">🃏 Mi Mazo</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-white/50">{deckSize} cartas</span>
              {isHeavy && <span className="text-xs text-orange-400/80 bg-orange-900/30 px-1.5 py-0.5 rounded">⚠ Mazo pesado</span>}
              {upgradedCount > 0 && <span className="text-xs text-cyan-400/80">⬆ {upgradedCount} mejorada{upgradedCount > 1 ? 's' : ''}</span>}
              {curseCount > 0 && <span className="text-xs text-purple-400/80">☠ {curseCount} maldición{curseCount > 1 ? 'es' : ''}</span>}
            </div>
          </div>
          <button
            onClick={() => setViewingDeck(false)}
            className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* Deck stats bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-black/30 border-b border-white/5">
          <span className="text-[10px] text-white/30">Clase:</span>
          <span className="text-[10px] text-white/60 font-medium capitalize">{player.classPath}</span>
          <span className="text-[10px] text-white/20">|</span>
          <span className="text-[10px] text-white/30">Robo por turno:</span>
          <span className="text-[10px] text-white/60">{isHeavy ? player.drawPerTurn - 1 : player.drawPerTurn}</span>
        </div>

        {/* Card list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <AnimatePresence>
            {groups.map((group, i) => {
              const def = getCardDef(group.defId);
              const effectiveDef = getEffectiveCardDef({ defId: group.defId, upgraded: group.upgraded });
              const isCurse = def.rarity === 'curse';

              return (
                <motion.div
                  key={`${group.defId}_${group.upgraded}`}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                    isCurse
                      ? 'border-purple-500/30 bg-purple-950/20'
                      : CLASS_CARD_BORDER[def.classPath] || CLASS_CARD_BORDER.vagabundo
                  }`}
                >
                  {/* Card icon */}
                  <div className="w-11 h-11 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-xl flex-shrink-0 relative">
                    {CARD_EMOJI[def.id] || '🃏'}
                    {group.upgraded && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[7px] text-white font-bold flex items-center justify-center shadow-sm shadow-cyan-500/50">
                        +
                      </div>
                    )}
                  </div>

                  {/* Card info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-white/90 text-xs font-semibold truncate">
                        {effectiveDef.name}
                        {group.upgraded && <span className="text-cyan-400">+</span>}
                      </p>
                      <span className={`text-[8px] font-medium ${rarityColors[def.rarity]}`}>
                        {rarityLabels[def.rarity]}
                      </span>
                    </div>
                    <p className="text-white/40 text-[10px] truncate">{def.description}</p>

                    {/* Stats row */}
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      <span className="text-[9px] text-cyan-300/80 bg-cyan-950/50 px-1 py-0.5 rounded">
                        ⚡{effectiveDef.cost}
                      </span>
                      {effectiveDef.damage && <span className="text-[9px] text-red-300/80 bg-red-950/50 px-1 py-0.5 rounded">⚔{effectiveDef.damage}</span>}
                      {effectiveDef.heal && <span className="text-[9px] text-green-300/80 bg-green-950/50 px-1 py-0.5 rounded">❤{effectiveDef.heal}</span>}
                      {effectiveDef.block && <span className="text-[9px] text-amber-300/80 bg-amber-950/50 px-1 py-0.5 rounded">🛡{effectiveDef.block}</span>}
                      {effectiveDef.burn && <span className="text-[9px] text-orange-300/80 bg-orange-950/50 px-1 py-0.5 rounded">🔥{effectiveDef.burn}</span>}
                      {effectiveDef.poison && <span className="text-[9px] text-green-300/80 bg-green-950/50 px-1 py-0.5 rounded">☠{effectiveDef.poison}</span>}
                      {effectiveDef.freeze && <span className="text-[9px] text-cyan-300/80 bg-cyan-950/50 px-1 py-0.5 rounded">❄{effectiveDef.freeze}</span>}
                      {effectiveDef.strengthBuff && <span className="text-[9px] text-orange-300/80 bg-orange-950/50 px-1 py-0.5 rounded">💪+{effectiveDef.strengthBuff}</span>}
                      {effectiveDef.drawCards && <span className="text-[9px] text-blue-300/80 bg-blue-950/50 px-1 py-0.5 rounded">🃏+{effectiveDef.drawCards}</span>}
                      {effectiveDef.aoeDamage && <span className="text-[9px] text-red-300/80 bg-red-950/50 px-1 py-0.5 rounded">💥{effectiveDef.aoeDamage}</span>}
                      {effectiveDef.selfDamage && <span className="text-[9px] text-rose-300/80 bg-rose-950/50 px-1 py-0.5 rounded">🩸-{effectiveDef.selfDamage}</span>}
                      {effectiveDef.energyGain && effectiveDef.energyGain !== 0 && <span className="text-[9px] text-cyan-300/80 bg-cyan-950/50 px-1 py-0.5 rounded">⚡{effectiveDef.energyGain > 0 ? '+' : ''}{effectiveDef.energyGain}</span>}
                      {effectiveDef.weaken && <span className="text-[9px] text-purple-300/80 bg-purple-950/50 px-1 py-0.5 rounded">👁-{effectiveDef.weaken}</span>}
                      {effectiveDef.attackBuffTurn && <span className="text-[9px] text-yellow-300/80 bg-yellow-950/50 px-1 py-0.5 rounded">🎼+{effectiveDef.attackBuffTurn}</span>}
                      {effectiveDef.executeThreshold && <span className="text-[9px] text-red-300/80 bg-red-950/50 px-1 py-0.5 rounded">💀E</span>}
                    </div>
                  </div>

                  {/* Copy count */}
                  <div className="flex-shrink-0">
                    {group.count > 1 ? (
                      <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-white/70 text-[10px] font-bold">
                        ×{group.count}
                      </div>
                    ) : (
                      <div className="w-6 h-6" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {groups.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/30 text-sm">Tu mazo está vacío</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => setViewingDeck(false)}
            className="w-full py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white/90 text-sm font-semibold rounded-xl border border-white/10 hover:border-white/25 transition-all"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
