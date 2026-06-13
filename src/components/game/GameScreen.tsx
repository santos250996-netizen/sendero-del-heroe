'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { EnemyDisplay } from './EnemyDisplay';
import { PlayerHUD } from './PlayerHUD';
import { HandDisplay, RewardCard } from './CardDisplay';
import { EvolutionChoice } from './EvolutionChoice';
import { MapDisplay } from './MapDisplay';
import { EventScreen } from './EventScreen';
import { RestScreen } from './RestScreen';
import { ShopScreen } from './ShopScreen';
import { EVOLUTION_TREE } from '@/game/data/evolutions';
import { getEvolutionNode } from '@/game/data/evolutions';
import { DeckCardPicker } from './CardDisplay';
import { DeckViewer } from './DeckViewer';

export function GameScreen() {
  const phase = useGameStore(s => s.phase);
  const endTurn = useGameStore(s => s.endTurn);
  const isAnimating = useGameStore(s => s.isAnimating);
  const startNewGame = useGameStore(s => s.startNewGame);
  const skipRewards = useGameStore(s => s.skipRewards);
  const confirmRewards = useGameStore(s => s.confirmRewards);
  const pickedRewards = useGameStore(s => s.pickedRewards);
  const log = useGameStore(s => s.log);
  const player = useGameStore(s => s.player);
  const deck = useGameStore(s => s.deck);
  const rewardCards = useGameStore(s => s.rewardCards);
  const encounter = useGameStore(s => s.encounter);
  const pendingEvolution = useGameStore(s => s.pendingEvolution);
  const finishEvent = useGameStore(s => s.finishEvent);
  const continueFromResult = useGameStore(s => s.continueFromResult);
  const eventOutcome = useGameStore(s => s.eventOutcome);
  const removingCard = useGameStore(s => s.removingCard);
  const upgradingCard = useGameStore(s => s.upgradingCard);
  const currentNodeId = useGameStore(s => s.currentNodeId);
  const map = useGameStore(s => s.map);
  const enterNode = useGameStore(s => s.enterNode);

  const tierOneNodes = Object.values(EVOLUTION_TREE).filter(n => n.tier === 1);

  const selectedNode = map?.nodes.find(n => n.id === currentNodeId);
  const selectedNodeName = selectedNode
    ? `${selectedNode.type === 'boss' ? '🐉' : selectedNode.type === 'combat' ? '⚔️' : selectedNode.type === 'elite' ? '💀' : selectedNode.type === 'rest' ? '🛏️' : selectedNode.type === 'shop' ? '🏪' : selectedNode.type === 'event' ? '❓' : '💎'} ${selectedNode.type === 'boss' ? 'Jefe Final' : selectedNode.type === 'combat' ? 'Combate' : selectedNode.type === 'elite' ? 'Élite' : selectedNode.type === 'rest' ? 'Descanso' : selectedNode.type === 'shop' ? 'Comercio' : selectedNode.type === 'event' ? 'Evento' : 'Tesoro'}`
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d1a] via-[#111128] to-[#0a0a15] text-white flex flex-col">
      {/* ─── MENU ─── */}
      {phase === 'menu' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="text-center">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-b from-amber-200 via-amber-400 to-orange-600 bg-clip-text text-transparent">
              Sendero del Héroe
            </h1>
            <p className="text-white/40 mt-3 text-sm sm:text-base italic max-w-md mx-auto">
              Elige tu camino en el mapa. Evoluciona tus cartas. Conquista al jefe final.<br/>
              3 ramas de evolución: 🔮 Mago · 🗡️ Pícaro · ⚔️ Guerrero
            </p>
          </motion.div>

          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="flex flex-wrap justify-center gap-3">
            {tierOneNodes.map(n => (
              <div key={n.id} className={`w-16 h-16 rounded-xl bg-gradient-to-br ${n.colorClasses} flex items-center justify-center border border-white/15`}>
                <span className="text-2xl">{n.emoji}</span>
              </div>
            ))}
          </motion.div>

          <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={startNewGame} className="mt-4 px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow">
            Iniciar Viaje
          </motion.button>

          <p className="text-white/20 text-xs max-w-xs text-center mt-2">10 capas. Combates, eventos, descanso y comercio. Millones de caminos.</p>
        </div>
      )}

      {/* ─── MAP ─── */}
      {phase === 'map' && (
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            <MapDisplay />
          </div>
          {/* Bottom bar: enter button */}
          {currentNodeId && (
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="fixed bottom-0 left-0 right-0 z-30 p-4"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
              }}
            >
              <div className="max-w-md mx-auto text-center">
                <p className="text-white/60 text-xs mb-2">Nodo seleccionado: <span className="text-white/80 font-medium">{selectedNodeName}</span></p>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={enterNode}
                  className="px-10 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-shadow"
                >
                  Entrar al Nodo
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* ─── BATTLE ─── */}
      {phase === 'battle' && (
        <div className="flex flex-col min-h-screen">
          <div className="flex-shrink-0 pt-6 sm:pt-10 pb-2">
            <EnemyDisplay />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 pb-48 sm:pb-52">
            <PlayerHUD />
            <div className="w-full max-w-md max-h-20 overflow-y-auto">
              {log.slice(0, 5).map((entry, i) => (
                <p key={i} className={`text-center text-xs ${i === 0 ? 'text-white/60' : 'text-white/25'}`}>{entry}</p>
              ))}
            </div>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={endTurn} disabled={isAnimating} className="relative z-30 px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white/90 text-sm font-semibold rounded-xl border border-white/10 hover:border-white/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/40">
              Terminar Turno
            </motion.button>
          </div>
          <HandDisplay />
        </div>
      )}

      {/* ─── EVOLUTION CHOICE (overlay) ─── */}
      <EvolutionChoice />

      {/* ─── REWARD ─── */}
      {phase === 'reward' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 pb-32">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-amber-300">¡Victoria!</h2>
            <p className="text-white/50 mt-2 text-sm">Elige las cartas que quieras añadir a tu mazo</p>
            {pickedRewards.length > 0 && (
              <p className="text-emerald-300/80 mt-1 text-xs">✓ {pickedRewards.length} seleccionada{pickedRewards.length > 1 ? 's' : ''}</p>
            )}
          </motion.div>
          <div className="flex gap-4 sm:gap-6 justify-center flex-wrap">
            {rewardCards.map(card => (
              <RewardCard key={card.uid} cardUid={card.uid} selected={pickedRewards.includes(card.uid)} />
            ))}
          </div>
          {rewardCards.length === 0 && (
            <p className="text-white/30 text-xs italic">No hay cartas nuevas para tu clase.</p>
          )}
          <div className="flex gap-3">
            <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={confirmRewards} className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/30">
              Confirmar ({pickedRewards.length})
            </motion.button>
            <button onClick={skipRewards} className="px-6 py-3 bg-transparent border border-white/20 text-white/50 rounded-xl text-sm hover:border-white/40 hover:text-white/70 transition-all">
              Volver al Mapa
            </button>
          </div>
        </div>
      )}

      {/* ─── REST ─── */}
      <RestScreen />

      {/* ─── SHOP ─── */}
      <ShopScreen />

      {/* ─── EVENT ─── */}
      <EventScreen />

      {/* ─── EVENT RESULT ─── */}
      {phase === 'event_result' && eventOutcome && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 pb-32">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-lg w-full text-center">
            <div className="text-4xl mb-4">📜</div>
            <div className="bg-black/40 border border-white/10 rounded-xl p-5 mb-5">
              <p className="text-white/70 text-sm sm:text-base leading-relaxed italic">
                {eventOutcome.narrative}
              </p>
            </div>

            {/* Show HP and gold changes */}
            <div className="flex justify-center gap-4 mb-5">
              <span className="text-sm text-white/60">❤️ {Math.max(0, player.hp)}/{player.maxHp}</span>
              <span className="text-sm text-yellow-300 font-medium">🪙 {player.gold}</span>
              <span className="text-sm text-white/60">🃏 {deck.length} cartas{deck.length > 15 ? <span className="text-orange-400 ml-1">⚠</span> : ''}</span>
            </div>

            {/* Card picker for remove/upgrade from events */}
            {removingCard && (
              <>
                <h3 className="text-lg font-bold text-red-400 mb-2">🗑️ Selecciona una carta para eliminar</h3>
                <DeckCardPicker mode="remove" />
              </>
            )}
            {upgradingCard && (
              <>
                <h3 className="text-lg font-bold text-cyan-400 mb-2">⬆️ Selecciona una carta para mejorar</h3>
                <DeckCardPicker mode="upgrade" />
              </>
            )}

            {!removingCard && !upgradingCard && (
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={continueFromResult}
                className="px-10 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-amber-500/30"
              >
                Continuar
              </motion.button>
            )}
          </motion.div>
        </div>
      )}

      {/* ─── GAME OVER ─── */}
      {phase === 'gameover' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-4xl font-bold text-red-400">Has Caído</h2>
            <p className="text-white/40 mt-2 text-sm">Llegaste al encuentro {encounter} como {getEvolutionNode(player.classPath).name}.</p>
          </motion.div>
          <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={startNewGame} className="px-10 py-3.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold rounded-xl border border-white/10">
            Intentar de Nuevo
          </motion.button>
        </div>
      )}

      {/* ─── VICTORY ─── */}
      {phase === 'victory' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
            <div className="text-7xl mb-4">👑</div>
            <h2 className="text-5xl font-bold bg-gradient-to-b from-amber-200 via-amber-400 to-orange-600 bg-clip-text text-transparent">¡Leyenda!</h2>
            <p className="text-white/50 mt-3 text-sm max-w-md mx-auto">
              Derrotaste al jefe final como {getEvolutionNode(player.classPath).name}.<br/>
              Oro final: {player.gold}g · Mazo: {deck.length} cartas
            </p>
          </motion.div>
          <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={startNewGame} className="px-10 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30">
            Nuevo Viaje
          </motion.button>
        </div>
      )}
      {/* ─── DECK VIEWER (overlay) ─── */}
      <DeckViewer />
    </div>
  );
}
