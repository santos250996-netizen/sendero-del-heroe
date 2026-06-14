'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { getCardDef, CARD_EMOJI } from '@/game/data/cards';
import { DeckCardPicker } from './CardDisplay';

export function ShopScreen() {
  const phase = useGameStore(s => s.phase);
  const player = useGameStore(s => s.player);
  const shopItems = useGameStore(s => s.shopItems);
  const buyShopItem = useGameStore(s => s.buyShopItem);
  const leaveShop = useGameStore(s => s.leaveShop);
  const removingCard = useGameStore(s => s.removingCard);
  const upgradingCard = useGameStore(s => s.upgradingCard);
  const cancelRestAction = useGameStore(s => s.cancelRestAction);

  if (phase !== 'shop') return null;

  // If in card removal or upgrade mode from shop
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

  return (
    <div className="flex-1 flex flex-col items-center gap-5 px-4 pb-32">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <div className="text-5xl mb-3">🏪</div>
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-300">Comercio</h2>
        <p className="text-white/50 text-sm mt-2">
          Oro disponible: <span className="text-yellow-300 font-bold">{player.gold}g</span>
        </p>
      </motion.div>

      <div className="w-full max-w-md space-y-3">
        {shopItems.map((item, i) => {
          const canAfford = player.gold >= item.cost && !item.sold;

          return (
            <motion.div
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: item.sold ? 0.3 : 1 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                item.sold
                  ? 'border-stone-600/20 bg-stone-900/20'
                  : canAfford
                    ? 'border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 cursor-pointer'
                    : 'border-white/5 bg-white/[0.02] opacity-50'
              }`}
              onClick={() => canAfford && buyShopItem(item.id)}
            >
              {/* Item icon */}
              <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                {item.type === 'card' && item.cardDefId ? (
                  <span>{CARD_EMOJI[item.cardDefId] || '🃏'}</span>
                ) : item.type === 'remove' ? (
                  <span>🗑️</span>
                ) : (
                  <span>⬆️</span>
                )}
              </div>

              {/* Item info */}
              <div className="flex-1 min-w-0">
                {item.type === 'card' && item.cardDefId ? (
                  <>
                    <p className="text-white/90 text-sm font-medium truncate">
                      {getCardDef(item.cardDefId).name}
                    </p>
                    <p className="text-white/40 text-[10px] truncate">
                      {getCardDef(item.cardDefId).description}
                    </p>
                  </>
                ) : item.type === 'remove' ? (
                  <>
                    <p className="text-white/90 text-sm font-medium">Eliminar Carta</p>
                    <p className="text-white/40 text-[10px]">Quita 1 carta de tu mazo</p>
                  </>
                ) : (
                  <>
                    <p className="text-white/90 text-sm font-medium">Mejorar Carta</p>
                    <p className="text-white/40 text-[10px]">Mejora los stats de 1 carta</p>
                  </>
                )}
              </div>

              {/* Price */}
              <div className="flex-shrink-0">
                {item.sold ? (
                  <span className="text-white/20 text-xs">Vendido</span>
                ) : (
                  <div className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    canAfford
                      ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30'
                      : 'bg-stone-800/50 text-stone-400 border border-stone-600/20'
                  }`}>
                    {item.cost}g
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={leaveShop}
        className="px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white/90 text-sm font-semibold rounded-xl border border-white/10 hover:border-white/25 transition-all shadow-lg shadow-black/40"
      >
        Salir del Comercio
      </motion.button>
    </div>
  );
}
