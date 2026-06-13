'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';

export function EventScreen() {
  const currentEvent = useGameStore(s => s.currentEvent);
  const phase = useGameStore(s => s.phase);
  const chooseEventOption = useGameStore(s => s.chooseEventOption);
  const player = useGameStore(s => s.player);

  if (phase !== 'event' || !currentEvent) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 pb-32">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-lg w-full"
      >
        {/* Event header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{currentEvent.emoji}</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-amber-300">{currentEvent.title}</h2>
        </div>

        {/* Narrative */}
        <div className="bg-black/40 border border-white/10 rounded-xl p-4 sm:p-5 mb-6">
          <p className="text-white/70 text-sm sm:text-base leading-relaxed italic">
            {currentEvent.narrative}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentEvent.options.map((option, i) => {
            const canAfford = (option.goldChange || 0) >= 0 || player.gold >= Math.abs(option.goldChange || 0);
            return (
              <motion.button
                key={option.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={canAfford ? { scale: 1.02, x: 4 } : {}}
                whileTap={canAfford ? { scale: 0.98 } : {}}
                onClick={() => canAfford && chooseEventOption(option.id)}
                disabled={!canAfford}
                className={`w-full text-left p-3 sm:p-4 rounded-xl border transition-all duration-200 ${
                  canAfford
                    ? 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 cursor-pointer'
                    : 'border-white/5 bg-white/[0.02] opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white/80 text-sm font-medium">{option.text}</p>
                    {/* Cost/benefit preview */}
                    <div className="flex gap-2 mt-1">
                      {option.goldChange && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          option.goldChange > 0 ? 'bg-yellow-900/40 text-yellow-300/70' : 'bg-red-900/40 text-red-300/70'
                        }`}>
                          {option.goldChange > 0 ? '+' : ''}{option.goldChange} oro
                        </span>
                      )}
                      {option.hpChange && option.hpChange > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-900/40 text-green-300/70">
                          +{option.hpChange} HP
                        </span>
                      )}
                      {option.hpChange && option.hpChange < 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/40 text-red-300/70">
                          {option.hpChange} HP
                        </span>
                      )}
                      {option.maxHpChange && option.maxHpChange < 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-300/70">
                          {option.maxHpChange} HP máx
                        </span>
                      )}
                      {option.cardReward && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/40 text-blue-300/70">
                          🃏 carta
                        </span>
                      )}
                      {option.canRemoveCard && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-900/40 text-orange-300/70">
                          🗑 eliminar carta
                        </span>
                      )}
                      {option.canUpgradeCard && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-900/40 text-cyan-300/70">
                          ⬆ mejorar carta
                        </span>
                      )}
                      {option.curseCard && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-300/70">
                          ☠️ maldición
                        </span>
                      )}
                      {option.nextEncounterDamageBonus && option.nextEncounterDamageBonus > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/40 text-red-300/70">
                          ⚠️ +{option.nextEncounterDamageBonus} dmg próximo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
