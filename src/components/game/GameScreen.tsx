'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { EnemyDisplay } from './EnemyDisplay';
import { PlayerHUD } from './PlayerHUD';
import { HandDisplay } from './CardDisplay';
import { RewardCard } from './CardDisplay';
import { EVOLUTIONS } from '@/game/data/cards';

const tierColors = [
  'from-stone-500 to-stone-700',
  'from-amber-600 to-amber-800',
  'from-red-600 to-red-800',
  'from-orange-500 to-amber-700',
  'from-yellow-400 to-amber-500',
];

const tierEmojis = ['🚶', '📖', '⚔️', '🛡️', '👑'];

export function GameScreen() {
  const phase = useGameStore(s => s.phase);
  const endTurn = useGameStore(s => s.endTurn);
  const isAnimating = useGameStore(s => s.isAnimating);
  const startNewGame = useGameStore(s => s.startNewGame);
  const proceedAfterReward = useGameStore(s => s.proceedAfterReward);
  const skipRewards = useGameStore(s => s.skipRewards);
  const proceedAfterEvolution = useGameStore(s => s.proceedAfterEvolution);
  const log = useGameStore(s => s.log);
  const player = useGameStore(s => s.player);
  const rewardCards = useGameStore(s => s.rewardCards);
  const encounter = useGameStore(s => s.encounter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d1a] via-[#111128] to-[#0a0a15] text-white flex flex-col">
      {/* ─── MENU ─── */}
      {phase === 'menu' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-b from-amber-200 via-amber-400 to-orange-600 bg-clip-text text-transparent">
              Sendero del Héroe
            </h1>
            <p className="text-white/40 mt-3 text-sm sm:text-base italic max-w-md mx-auto">
              Un roguelite de cartas donde cada combate te forja.<br/>
              Comienza como Vagabundo... conviértete en Leyenda.
            </p>
          </motion.div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex gap-2">
              {EVOLUTIONS.map((evo, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${tierColors[i]} flex items-center justify-center border border-white/10`}>
                    <span className="text-xl">{tierEmojis[i]}</span>
                  </div>
                  <span className="text-[10px] text-white/30">{evo.name}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-white/20">
              <div className="h-px w-8 bg-white/20" />
              <span className="text-lg">→</span>
              <div className="h-px w-8 bg-white/20" />
            </div>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={startNewGame}
            className="mt-4 px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow"
          >
            Iniciar Viaje
          </motion.button>

          <p className="text-white/20 text-xs max-w-xs text-center mt-2">
            10 encuentros te esperan. Juega cartas, derrota enemigos, evoluciona y conviértete en leyenda.
          </p>
        </div>
      )}

      {/* ─── BATTLE ─── */}
      {phase === 'battle' && (
        <div className="flex flex-col min-h-screen">
          {/* Top: Enemy */}
          <div className="flex-shrink-0 pt-6 sm:pt-10 pb-2">
            <EnemyDisplay />
          </div>

          {/* Middle: Player HUD + End Turn — must clear the fixed hand */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 pb-48 sm:pb-52">
            <PlayerHUD />

            {/* Combat log */}
            <div className="w-full max-w-md max-h-20 overflow-y-auto">
              {log.slice(0, 4).map((entry, i) => (
                <p key={i} className={`text-center text-xs ${i === 0 ? 'text-white/60' : 'text-white/25'}`}>
                  {entry}
                </p>
              ))}
            </div>

            {/* End Turn Button — above the hand, with high z-index */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={endTurn}
              disabled={isAnimating}
              className="relative z-30 px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white/90 text-sm font-semibold rounded-xl border border-white/10 hover:border-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/40"
            >
              Terminar Turno
            </motion.button>
          </div>

          {/* Bottom: Hand (fixed overlay) */}
          <HandDisplay />
        </div>
      )}

      {/* ─── REWARD ─── */}
      {phase === 'reward' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-4 pb-32">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-amber-300">¡Victoria!</h2>
            <p className="text-white/50 mt-2 text-sm">Elige una carta para añadir a tu mazo</p>
            {useGameStore.getState().pendingEvolution && (
              <p className="text-yellow-300/80 mt-2 text-xs animate-pulse">
                ✨ ¡Puedes evolucionar después!
              </p>
            )}
          </motion.div>

          <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
            {rewardCards.map(card => (
              <RewardCard key={card.uid} cardUid={card.uid} selected={false} />
            ))}
          </div>

          <button
            onClick={skipRewards}
            className="px-6 py-2.5 bg-transparent border border-white/20 text-white/50 rounded-xl text-sm hover:border-white/40 hover:text-white/70 transition-all"
          >
            Saltar recompensa
          </button>
        </div>
      )}

      {/* ─── EVOLUTION ─── */}
      {phase === 'evolution' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-center"
          >
            <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${tierColors[player.evolutionTier]} flex items-center justify-center border-2 border-white/30 shadow-lg`}>
              <span className="text-5xl">{tierEmojis[player.evolutionTier]}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mt-4 bg-gradient-to-b from-amber-200 to-amber-500 bg-clip-text text-transparent">
              {EVOLUTIONS[player.evolutionTier].name}
            </h2>
            <p className="text-white/40 italic mt-1 text-sm">{EVOLUTIONS[player.evolutionTier].title}</p>
            <p className="text-white/50 mt-3 text-xs max-w-sm mx-auto">
              {EVOLUTIONS[player.evolutionTier].description}
            </p>

            <div className="flex justify-center gap-4 mt-4 text-xs text-white/50">
              <span>❤️ {EVOLUTIONS[player.evolutionTier].maxHp} HP</span>
              <span>⚡ {EVOLUTIONS[player.evolutionTier].maxEnergy} Energía</span>
              <span>🃏 {EVOLUTIONS[player.evolutionTier].drawPerTurn} Cartas</span>
              {EVOLUTIONS[player.evolutionTier].bonusStrength > 0 && (
                <span className="text-amber-400">💪 +{EVOLUTIONS[player.evolutionTier].bonusStrength} Fuerza</span>
              )}
            </div>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={proceedAfterEvolution}
            className="px-10 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30"
          >
            Continuar Viaje
          </motion.button>
        </div>
      )}

      {/* ─── GAME OVER ─── */}
      {phase === 'gameover' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-4xl font-bold text-red-400">Has Caído</h2>
            <p className="text-white/40 mt-2 text-sm">
              Llegaste al encuentro {encounter} como {EVOLUTIONS[player.evolutionTier].name}.
            </p>
            <p className="text-white/30 mt-1 text-xs italic">
              El camino del héroe nunca termina... siempre hay un nuevo comienzo.
            </p>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={startNewGame}
            className="px-10 py-3.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-xl border border-white/10"
          >
            Intentar de Nuevo
          </motion.button>
        </div>
      )}

      {/* ─── VICTORY ─── */}
      {phase === 'victory' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-7xl mb-4">👑</div>
            <h2 className="text-5xl font-bold bg-gradient-to-b from-amber-200 via-amber-400 to-orange-600 bg-clip-text text-transparent">
              ¡Leyenda!
            </h2>
            <p className="text-white/50 mt-3 text-sm max-w-md mx-auto">
              Has completado los 10 encuentros y te has convertido en una Leyenda.
              Tu nombre será recordado por las generaciones venideras.
            </p>
            <div className="flex justify-center gap-3 mt-4 text-xs text-white/40">
              <span>❤️ HP final: {Math.max(0, player.hp)}</span>
              <span>💪 Fuerza: {player.strength}</span>
              <span>⚔️ Clase: {EVOLUTIONS[player.evolutionTier].name}</span>
            </div>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={startNewGame}
            className="px-10 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30"
          >
            Nuevo Viaje
          </motion.button>
        </div>
      )}
    </div>
  );
}
