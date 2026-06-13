'use client';

import { useGameStore } from '@/store/gameStore';
import { getEvolutionNode, getClassColor, getClassEmoji } from '@/game/data/evolutions';

export function PlayerHUD() {
  const player = useGameStore(s => s.player);
  const phase = useGameStore(s => s.phase);
  const encounter = useGameStore(s => s.encounter);
  const deck = useGameStore(s => s.deck);
  const discard = useGameStore(s => s.discard);
  const hand = useGameStore(s => s.hand);
  const pendingEvolution = useGameStore(s => s.pendingEvolution);

  if (phase === 'menu') return null;

  const evo = getEvolutionNode(player.classPath);
  const hpPercent = (player.hp / player.maxHp) * 100;
  const energyPercent = (player.energy / player.maxEnergy) * 100;
  const nextThreshold = [15, 40, 80][player.evolutionTier] ?? 999;
  const xpPercent = Math.min(100, (player.xp / nextThreshold) * 100);

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
          <span>⚔️ {encounter}</span>
          {player.strength > 0 && <span className="text-amber-400">💪+{player.strength}</span>}
          {pendingEvolution && (
            <span className="text-yellow-300 animate-pulse text-[10px] px-1.5 py-0.5 bg-yellow-400/20 rounded-full border border-yellow-400/30">
              EVOLUCIONAR
            </span>
          )}
        </div>
      </div>

      {/* Passive indicator */}
      <div className="text-center">
        <span className="text-[10px] text-amber-200/50 bg-amber-900/20 px-2 py-0.5 rounded-full border border-amber-400/10">
          {evo.passiveDescription}
        </span>
      </div>

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

      {/* Energy + XP Row */}
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

      {/* Deck counters */}
      <div className="flex items-center gap-3 text-[11px] text-white/40 justify-center">
        <span>🃏 {deck.length}</span>
        <span>✋ {hand.length}</span>
        <span>🗑 {discard.length}</span>
      </div>
    </div>
  );
}
