'use client';

import { useGameStore } from '@/store/gameStore';
import { getEvolutionNode, getClassColor, getClassEmoji } from '@/game/data/evolutions';
import { getNextXpThreshold } from '@/game/engine';

export function PlayerHUD() {
  // Individual selectors to avoid new object reference on each render
  const player = useGameStore(s => s.player);
  const phase = useGameStore(s => s.phase);
  const encounter = useGameStore(s => s.encounter);
  const deck = useGameStore(s => s.deck);
  const discard = useGameStore(s => s.discard);
  const hand = useGameStore(s => s.hand);
  const map = useGameStore(s => s.map);
  const gold = useGameStore(s => s.player.gold);

  if (phase === 'menu') return null;

  const evo = getEvolutionNode(player.classPath);
  const hpPercent = (player.hp / player.maxHp) * 100;
  const energyPercent = (player.energy / player.maxEnergy) * 100;
  const nextThreshold = getNextXpThreshold(player.evolutionTier);
  const xpPercent = Math.min(100, (player.xp / nextThreshold) * 100);

  const visitedCount = map?.nodes.filter(n => n.visited).length || 0;
  const totalNodes = map?.nodes.length || 10;
  // Progress: only show 100% if boss node is visited (boss defeated)
  const bossVisited = map?.nodes.some(n => n.type === 'boss' && n.visited);
  const progressPercent = bossVisited ? 100 : (visitedCount / totalNodes) * 100;

  // Hide energy/XP in non-battle phases
  const showBattleStats = phase === 'battle';

  return (
    <div className="flex flex-col gap-2 w-full max-w-md mx-auto">
      {/* Evolution & Stats Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getClassColor(player.classPath)} flex items-center justify-center border border-white/20`}>
            <span className="text-lg">{getClassEmoji(player.classPath)}</span>
          </div>
          <div>
            <p className="text-white/90 text-sm font-semibold leading-tight">{evo.name}</p>
            <p className="text-white/40 text-xs italic">{evo.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-white/60">
          <span className="text-yellow-300 font-bold">🪙 {gold}</span>
          {showBattleStats && <span>⚔️ {encounter}</span>}
          {player.strength > 0 && <span className="text-amber-400">💪+{player.strength}</span>}
          {player.block > 0 && <span className="text-cyan-400">🛡{player.block}</span>}
        </div>
      </div>

      {/* Passive indicator */}
      <div className="text-center">
        <span className="text-[10px] text-amber-200/50 bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-400/10">
          {evo.passiveDescription}
        </span>
      </div>

      {/* Map progress bar (shown outside battle) */}
      {!showBattleStats && (
        <div>
          <div className="flex justify-between text-[11px] text-white/50 mb-0.5">
            <span>🗺️ Progreso</span>
            <span>Capa {visitedCount}/{totalNodes}</span>
          </div>
          <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-500"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
        </div>
      )}

      {/* HP Bar */}
      <div>
        <div className="flex justify-between text-[11px] text-white/50 mb-0.5">
          <span>❤️ HP</span>
          <span>{Math.max(0, player.hp)} / {player.maxHp}</span>
        </div>
        <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              hpPercent > 50 ? 'bg-gradient-to-r from-rose-600 to-red-400' :
              hpPercent > 25 ? 'bg-gradient-to-r from-orange-500 to-amber-400' :
              'bg-gradient-to-r from-red-700 to-red-500'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      {/* Energy + XP Row (battle only) */}
      {showBattleStats && (
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-white/50 mb-0.5">
              <span>⚡ Energía</span>
              <span>{player.energy}/{player.maxEnergy}</span>
            </div>
            <div className="h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300"
                style={{ width: `${energyPercent}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-white/50 mb-0.5">
              <span>✨ XP</span>
              <span>{player.xp}/{nextThreshold}</span>
            </div>
            <div className="h-2.5 bg-black/50 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-400 transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Deck counters */}
      {showBattleStats && (
        <div className="flex items-center gap-3 text-[11px] text-white/40 justify-center">
          <span>🃏 {deck.length}</span>
          {player.block > 0 && <span>🛡 {player.block}</span>}
          {player.dodgeCount > 0 && <span>🌀 {player.dodgeCount}</span>}
          <span>✋ {hand.length}</span>
          <span>🗑 {discard.length}</span>
        </div>
      )}
    </div>
  );
}
