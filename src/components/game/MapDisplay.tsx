'use client';

import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { NODE_EMOJI, NODE_LABEL } from '@/game/data/map';
import type { NodeType, MapNode } from '@/game/types';
import { PlayerHUD } from './PlayerHUD';

const nodeColors: Record<NodeType, string> = {
  combat: 'from-red-600/60 to-red-900/60 border-red-400/40 hover:border-red-300/70 hover:from-red-500/70 hover:to-red-800/70',
  elite: 'from-purple-600/60 to-purple-900/60 border-purple-400/40 hover:border-purple-300/70 hover:from-purple-500/70 hover:to-purple-800/70',
  rest: 'from-green-600/60 to-green-900/60 border-green-400/40 hover:border-green-300/70 hover:from-green-500/70 hover:to-green-800/70',
  shop: 'from-blue-600/60 to-blue-900/60 border-blue-400/40 hover:border-blue-300/70 hover:from-blue-500/70 hover:to-blue-800/70',
  event: 'from-amber-600/60 to-amber-900/60 border-amber-400/40 hover:border-amber-300/70 hover:from-amber-500/70 hover:to-amber-800/70',
  treasure: 'from-yellow-500/60 to-yellow-800/60 border-yellow-400/40 hover:border-yellow-300/70 hover:from-yellow-400/70 hover:to-yellow-700/70',
  boss: 'from-rose-600/80 to-rose-900/80 border-rose-300/60 hover:border-rose-200/90 hover:from-rose-500/90 hover:to-rose-800/90',
  evolution: 'from-violet-600/60 to-violet-900/60 border-violet-400/40 hover:border-violet-300/70',
};

const nodeVisitedColors: Record<NodeType, string> = {
  combat: 'from-stone-700/30 to-stone-800/30 border-stone-500/20',
  elite: 'from-stone-700/30 to-stone-800/30 border-stone-500/20',
  rest: 'from-stone-700/30 to-stone-800/30 border-stone-500/20',
  shop: 'from-stone-700/30 to-stone-800/30 border-stone-500/20',
  event: 'from-stone-700/30 to-stone-800/30 border-stone-500/20',
  treasure: 'from-stone-700/30 to-stone-800/30 border-stone-500/20',
  boss: 'from-stone-700/30 to-stone-800/30 border-stone-500/20',
  evolution: 'from-stone-700/30 to-stone-800/30 border-stone-500/20',
};

function MapNodeButton({ node, isSelected }: { node: MapNode; isSelected: boolean }) {
  const selectNode = useGameStore(s => s.selectNode);
  const enterNode = useGameStore(s => s.enterNode);
  const currentNodeId = useGameStore(s => s.currentNodeId);
  const phase = useGameStore(s => s.phase);
  const visitedNodeIds = useGameStore(s => s.map?.visitedNodeIds || new Set());

  const isVisited = visitedNodeIds.has(node.id);
  const isAvailable = node.available && !isVisited;
  const isCurrent = node.id === currentNodeId;

  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={isAvailable && phase === 'map' ? { scale: 1.08, y: -2 } : {}}
      whileTap={isAvailable && phase === 'map' ? { scale: 0.95 } : {}}
      onClick={() => {
        if (isCurrent && phase === 'map') {
          enterNode();
        } else if (isAvailable && phase === 'map') {
          selectNode(node.id);
        }
      }}
      className={`relative w-[72px] sm:w-[90px] h-[72px] sm:h-[90px] rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-200 select-none ${
        isVisited
          ? `${nodeVisitedColors[node.type]} opacity-40`
          : isCurrent
            ? `${nodeColors[node.type]} ring-2 ring-white/60 shadow-lg scale-110`
            : isAvailable
              ? `${nodeColors[node.type]} cursor-pointer`
              : 'from-stone-800/20 to-stone-900/20 border-stone-600/10 opacity-30 cursor-not-allowed'
      }`}
    >
      <span className="text-xl sm:text-2xl">{NODE_EMOJI[node.type]}</span>
      <span className="text-[8px] sm:text-[10px] text-white/70 font-medium leading-tight">
        {NODE_LABEL[node.type]}
      </span>
      {isCurrent && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-amber-500/90 text-black text-[8px] font-bold rounded-full">
          IR
        </div>
      )}
      {isVisited && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-stone-600 flex items-center justify-center text-[8px]">
          ✓
        </div>
      )}
    </motion.button>
  );
}

export function MapDisplay() {
  const map = useGameStore(s => s.map);
  const phase = useGameStore(s => s.phase);
  const currentNodeId = useGameStore(s => s.currentNodeId);
  const setViewingDeck = useGameStore(s => s.setViewingDeck);
  const deck = useGameStore(s => s.deck);

  if (!map || phase !== 'map') return null;

  // Group nodes by layer
  const layers: MapNode[][] = [];
  for (let i = 0; i <= map.maxLayer; i++) {
    layers.push(map.nodes.filter(n => n.layer === i));
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 pb-6">
      <PlayerHUD />

      <div className="flex items-center justify-between w-full max-w-xs mb-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-amber-300">
          Mapa del Sendero
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setViewingDeck(true)}
          className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-lg text-white/70 text-xs hover:bg-white/20 hover:border-white/30 transition-all flex items-center gap-1.5"
        >
          🃏 {deck.length}
          {deck.length > 15 && <span className="text-orange-400">⚠</span>}
        </motion.button>
      </div>
      <p className="text-white/40 text-xs mb-4">
        Selecciona un nodo y presiona IR para entrar
      </p>

      <div className="w-full max-w-sm space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] pb-4">
        {layers.map((layer, layerIdx) => (
          <div key={layerIdx} className="flex flex-col items-center gap-1">
            {/* Layer label */}
            <div className="flex items-center gap-2 w-full max-w-xs mb-1">
              <span className="text-[10px] text-white/30 font-medium w-8">
                {layerIdx === map.maxLayer ? 'BOSS' : `Capa ${layerIdx + 1}`}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Nodes in this layer */}
            <div className="flex gap-3 sm:gap-6 items-center justify-center">
              {layer.map(node => (
                <div key={node.id} className="flex flex-col items-center">
                  {/* Connection line from above (visual) */}
                  {layerIdx > 0 && (
                    <div className="w-px h-3 bg-white/15" />
                  )}
                  <MapNodeButton node={node} isSelected={node.id === currentNodeId} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Boss label at bottom */}
        <div className="mt-3 text-center">
          <span className="text-[10px] text-rose-400/60 uppercase tracking-widest">
            ⚔️ El Destino Te Espera ⚔️
          </span>
        </div>
      </div>
    </div>
  );
}
