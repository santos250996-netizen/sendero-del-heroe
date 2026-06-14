'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { DeckCardPicker } from './CardDisplay';

export function RestScreen() {
  const phase = useGameStore(s => s.phase);
  const chooseRest = useGameStore(s => s.chooseRest);
  const restChoice = useGameStore(s => s.restChoice);
  const player = useGameStore(s => s.player);
  const removingCard = useGameStore(s => s.removingCard);
  const upgradingCard = useGameStore(s => s.upgradingCard);
  const cancelRestAction = useGameStore(s => s.cancelRestAction);

  if (phase !== 'rest') return null;

  // If in card removal or upgrade mode
  if (removingCard) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 pb-32">
        <h2 className="text-2xl font-bold text-red-400">🗑️ Eliminar Carta</h2>
        <p className="text-white/50 text-sm text-center max-w-sm">
          Selecciona una carta de tu mazo para eliminarla permanentemente.
        </p>
        <DeckCardPicker mode="remove" />
        <button
          onClick={cancelRestAction}
          className="px-6 py-2 bg-transparent border border-white/20 text-white/50 rounded-xl text-sm hover:border-white/40 transition-all"
        >
          Cancelar
        </button>
      </div>
    );
  }

  if (upgradingCard) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 pb-32">
        <h2 className="text-2xl font-bold text-cyan-400">⬆️ Mejorar Carta</h2>
        <p className="text-white/50 text-sm text-center max-w-sm">
          Selecciona una carta de tu mazo para mejorarla permanentemente.
        </p>
        <DeckCardPicker mode="upgrade" />
        <button
          onClick={cancelRestAction}
          className="px-6 py-2 bg-transparent border border-white/20 text-white/50 rounded-xl text-sm hover:border-white/40 transition-all"
        >
          Cancelar
        </button>
      </div>
    );
  }

  const healAmount = Math.floor(player.maxHp * 0.30);

  const choices = [
    {
      id: 'heal' as const,
      emoji: '💚',
      title: 'Descansar',
      description: `Recupera ${healAmount} HP (30% del máximo)`,
      color: 'from-green-600/50 to-green-800/50 border-green-400/30 hover:border-green-300/60',
    },
    {
      id: 'remove' as const,
      emoji: '🗑️',
      title: 'Eliminar Carta',
      description: 'Elimina 1 carta de tu mazo permanentemente',
      color: 'from-red-600/50 to-red-800/50 border-red-400/30 hover:border-red-300/60',
    },
    {
      id: 'upgrade' as const,
      emoji: '⬆️',
      title: 'Mejorar Carta',
      description: 'Mejora 1 carta de tu mazo (+stats)',
      color: 'from-cyan-600/50 to-cyan-800/50 border-cyan-400/30 hover:border-cyan-300/60',
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 pb-32">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
        <div className="text-5xl mb-3">🛏️</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-green-300">Zona de Descanso</h2>
        <p className="text-white/50 text-sm mt-2">Elige cómo recuperar fuerzas antes de seguir.</p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {choices.map((choice, i) => (
          <motion.button
            key={choice.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => chooseRest(choice.id)}
            className={`w-[200px] sm:w-[220px] rounded-xl border p-4 text-left transition-all duration-200 bg-gradient-to-br ${choice.color}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{choice.emoji}</span>
              <h3 className="text-white/90 font-semibold">{choice.title}</h3>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">{choice.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
