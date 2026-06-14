'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { getEvolutionNode } from '@/game/data/evolutions';
import { getCardDef, CARD_EMOJI } from '@/game/data/cards';

export function EvolutionChoice() {
  const evolutionChoices = useGameStore(s => s.evolutionChoices);
  const chooseEvolution = useGameStore(s => s.chooseEvolution);
  const pendingEvolution = useGameStore(s => s.pendingEvolution);
  const phase = useGameStore(s => s.phase);

  if (phase !== 'evolution_choice' || !pendingEvolution || evolutionChoices.length === 0) return null;

  const validChoices = evolutionChoices.filter(id => {
    try { return !!getEvolutionNode(id); } catch { return false; }
  });

  if (validChoices.length === 0) {
    // Fallback: skip evolution and go to next encounter
    const skipEvolution = useGameStore.getState().skipRewards;
    // Use queueMicrotask to avoid state update during render
    if (typeof window !== 'undefined') queueMicrotask(() => skipEvolution());
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-4xl w-full"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-amber-300 text-center mb-2">
          Elige tu Camino
        </h2>
        <p className="text-white/50 text-center mb-8 text-sm">
          Tu evolución define tus cartas y habilidades.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
          {validChoices.map((classPath, i) => {
            const node = getEvolutionNode(classPath);
            return (
              <motion.button
                key={classPath}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => chooseEvolution(classPath)}
                className={`flex-1 max-w-xs mx-auto sm:mx-0 rounded-2xl border border-white/15 overflow-hidden transition-all hover:border-white/30 hover:shadow-2xl cursor-pointer text-left`}
                style={{ background: 'linear-gradient(135deg, rgba(20,20,40,0.95), rgba(30,30,60,0.95))' }}
              >
                {/* Class icon */}
                <div className={`w-full h-32 flex items-center justify-center bg-gradient-to-br ${node.colorClasses}`}>
                  <span className="text-6xl">{node.emoji}</span>
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="text-xl sm:text-2xl font-bold text-white/90">{node.name}</h3>
                  <p className="text-white/40 italic text-xs mb-3">{node.title}</p>
                  <p className="text-white/60 text-sm mb-3">{node.description}</p>

                  {/* Stats */}
                  <div className="flex gap-3 text-xs text-white/50 mb-3">
                    <span>❤️ {node.maxHp}</span>
                    <span>⚡ {node.maxEnergy}</span>
                    <span>🃏 {node.drawPerTurn}</span>
                    {node.bonusStrength > 0 && (
                      <span className="text-amber-400">💪+{node.bonusStrength}</span>
                    )}
                  </div>

                  {/* Passive */}
                  <div className="bg-white/5 rounded-lg px-3 py-2 border border-white/10">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Pasiva</p>
                    <p className="text-xs text-amber-200/80">{node.passiveDescription}</p>
                  </div>

                  {/* New cards */}
                  {node.unlockCardIds.length > 0 && (
                    <div className="mt-3">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">
                        Nuevas cartas ({node.unlockCardIds.length})
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        {node.unlockCardIds.map(id => {
                          try {
                            const def = getCardDef(id);
                            return (
                              <span key={id} className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/50 flex items-center gap-1">
                                {CARD_EMOJI[id] || '🃏'} {def.name}
                              </span>
                            );
                          } catch {
                            return (
                              <span key={id} className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/50">
                                {id.replace(/_/g, ' ')}
                              </span>
                            );
                          }
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
