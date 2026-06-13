'use client';

import { useGameStore } from '@/store/gameStore';
import { getCardDef, getEvolution, getNextEvolution } from '@/game/data/cards';

export function EnemyDisplay() {
  const enemy = useGameStore(s => s.enemy);
  const phase = useGameStore(s => s.phase);

  if (!enemy || phase !== 'battle') return null;

  const hpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const tierColors: Record<string, string> = {
    easy: 'from-green-500/20 to-green-700/10',
    medium: 'from-amber-500/20 to-amber-700/10',
    hard: 'from-red-500/20 to-red-700/10',
    boss: 'from-purple-500/30 to-purple-800/20',
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Enemy Avatar Placeholder */}
      <div className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br ${tierColors[enemy.tier]} border border-white/10 flex items-center justify-center transition-all duration-300 ${enemy.hp <= enemy.maxHp * 0.3 ? 'animate-pulse' : ''}`}>
        <div className="text-4xl sm:text-5xl opacity-60">
          {enemy.tier === 'boss' ? '🐉' : enemy.tier === 'hard' ? '💀' : enemy.tier === 'medium' ? '⚔️' : '👹'}
        </div>
        {enemy.block > 0 && (
          <div className="absolute -top-2 -right-2 bg-amber-500/90 text-black text-xs font-bold px-2 py-0.5 rounded-full">
            🛡 {enemy.block}
          </div>
        )}
      </div>

      {/* Enemy Name */}
      <h2 className="text-white/90 text-lg sm:text-xl font-semibold tracking-wide">
        {enemy.name}
      </h2>

      {/* HP Bar */}
      <div className="w-48 sm:w-64">
        <div className="flex justify-between text-xs text-white/50 mb-1">
          <span>HP</span>
          <span>{Math.max(0, enemy.hp)} / {enemy.maxHp}</span>
        </div>
        <div className="h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              hpPercent > 50 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
              hpPercent > 25 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
              'bg-gradient-to-r from-red-600 to-red-400'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
