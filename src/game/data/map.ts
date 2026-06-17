import { type MapNode, type GameMap, type NodeType, type GameEvent, type ShopItem } from '../types';

// ═══════════════════════════════════════════════════════
// MAP GENERATION
// 10 layers, 2 nodes per layer, branching paths
// Layer 9 is always boss
// ═══════════════════════════════════════════════════════

const NODE_EMOJI: Record<NodeType, string> = {
  combat: '⚔️',
  elite: '💀',
  rest: '🛏️',
  shop: '🏪',
  event: '❓',
  treasure: '💎',
  boss: '🐉',
  evolution: '🔮',
};

const NODE_LABEL: Record<NodeType, string> = {
  combat: 'Combate',
  elite: 'Élite',
  rest: 'Descanso',
  shop: 'Comercio',
  event: 'Evento',
  treasure: 'Tesoro',
  boss: 'Jefe Final',
  evolution: 'Evolución',
};

export { NODE_EMOJI, NODE_LABEL };

// Weight distribution per layer tier
// Layer 0-2: easy (mostly combat + event/rest)
// Layer 3-5: mid (combat + elite + shop + rest)
// Layer 6-8: hard (combat + elite + event)
// Layer 9: boss

function pickNodeType(layer: number, rng: () => number): NodeType {
  if (layer === 9) return 'boss';
  if (layer === 0) return 'combat'; // first node is always combat

  const r = rng();

  if (layer <= 2) {
    // Early: combat 40%, event 25%, rest 20%, treasure 10%, shop 5%
    if (r < 0.40) return 'combat';
    if (r < 0.65) return 'event';
    if (r < 0.85) return 'rest';
    if (r < 0.95) return 'treasure';
    return 'shop';
  }
  if (layer <= 5) {
    // Mid: combat 30%, elite 15%, event 20%, rest 15%, shop 12%, treasure 8%
    if (r < 0.30) return 'combat';
    if (r < 0.45) return 'elite';
    if (r < 0.65) return 'event';
    if (r < 0.80) return 'rest';
    if (r < 0.92) return 'shop';
    return 'treasure';
  }
  // Late: combat 25%, elite 25%, event 25%, rest 10%, shop 15%
  if (r < 0.25) return 'combat';
  if (r < 0.50) return 'elite';
  if (r < 0.75) return 'event';
  if (r < 0.85) return 'rest';
  return 'shop';
}

export function generateMap(layer9IsBoss: boolean = true): GameMap {
  const nodes: MapNode[] = [];
  let seed = Date.now();
  const rng = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed % 10000) / 10000;
  };

  const maxLayer = 9;

  for (let layer = 0; layer <= maxLayer; layer++) {
    if (layer === 9 && layer9IsBoss) {
      // Boss layer: single node in center
      nodes.push({
        id: `node_9_0`,
        type: 'boss',
        layer: 9,
        column: 0,
        visited: false,
        cleared: false,
        available: false,
        encounterDifficulty: 10,
      });
    } else {
      // 2 nodes per layer
      for (let col = 0; col < 2; col++) {
        // Ensure variety: second node type differs from first
        let type = pickNodeType(layer, rng);
        if (col === 1 && nodes.length > 0 && nodes[nodes.length - 1].type === type) {
          // Re-roll if same type as sibling
          type = pickNodeType(layer, rng);
        }
        nodes.push({
          id: `node_${layer}_${col}`,
          type,
          layer,
          column: col,
          visited: false,
          cleared: false,
          available: layer === 0,
          encounterDifficulty: layer + 1,
        });
      }
    }
  }

  return {
    nodes,
    currentLayer: 0,
    visitedNodeIds: [],
    maxLayer,
  };
}

/** Get available nodes for the current layer */
export function getAvailableNodes(map: GameMap): MapNode[] {
  return map.nodes.filter(n => n.available && !n.visited);
}

/** Mark a node as visited and unlock next layer nodes */
export function visitNode(map: GameMap, nodeId: string): GameMap {
  const node = map.nodes.find(n => n.id === nodeId);
  if (!node) return map;

  const newVisited = [...map.visitedNodeIds];
  if (!newVisited.includes(nodeId)) newVisited.push(nodeId);

  const newNodes = map.nodes.map(n => {
    if (n.id === nodeId) return { ...n, visited: true, available: false };
    // Same layer: sibling node becomes unavailable (only 1 path per layer)
    if (n.layer === node.layer) return { ...n, available: false, visited: n.visited };
    // Next layer: both columns become available for the player to choose
    if (n.layer === node.layer + 1) return { ...n, available: true };
    return n;
  });

  // Only the next layer's nodes become available
  const nextLayer = node.layer + 1;

  return {
    ...map,
    nodes: newNodes,
    visitedNodeIds: newVisited,
    currentLayer: nextLayer,
  };
}

/** Check if the map is complete (boss cleared) */
export function isMapComplete(map: GameMap): boolean {
  const bossNode = map.nodes.find(n => n.type === 'boss');
  return bossNode ? bossNode.cleared : false;
}

// ═══════════════════════════════════════════════════════
// EVENTS (with narrative)
// ═══════════════════════════════════════════════════════

export const ALL_EVENTS: GameEvent[] = [
  {
    id: 'pozo_deseos',
    title: 'Pozo de los Deseos',
    narrative: 'Encuentras un pozo de agua cristalina rodeado de monedas oxidadas. Un susurro antiguo te ofrece un trato: paga con oro y el pozo revelará una carta de poder.',
    emoji: '⛲',
    options: [
      {
        id: 'pay_wish',
        text: 'Lanzar 30 de oro al pozo',
        narrative: 'Las monedas brillan al caer. El agua bulle y de su interior emerge una carta que resplandece con energía arcana. La agregas a tu mazo.',
        goldChange: -30,
        cardReward: 'wish_card',
      },
      {
        id: 'drink_water',
        text: 'Beber del pozo gratis',
        narrative: 'El agua es fresca y revitalizante. No obtienes cartas, pero recuperas algo de vitalidad para continuar.',
        hpChange: 10,
      },
      {
        id: 'ignore_well',
        text: 'Ignorar el pozo y seguir',
        narrative: 'Los susurros cesan. Decides que tu camino no pasa por aquí.',
      },
    ],
  },
  {
    id: 'alma_perdida',
    title: 'Alma Perdida',
    narrative: 'Un espíritu atormentado flota ante ti. Sus ojos brillan con tristeza eterna. Ofrece un pacto sombrío: tu sangre a cambio de poder inmenso.',
    emoji: '👻',
    options: [
      {
        id: 'accept_pact',
        text: 'Ceder 10% de HP máximo',
        narrative: 'El espíritu sonríe mientras tu cuerpo se debilita. De su forma etérea emerge una carta legendaria que arde con un fuego frío. El poder es real, pero el precio es permanente.',
        maxHpChange: -10,
        cardReward: 'soul_pact_card',
      },
      {
        id: 'banish_spirit',
        text: 'Intentar desterrar al espíritu',
        narrative: 'Concentras tu voluntad y el espíritu retrocede con un grito. Desaparece entre las sombras, pero no antes de dejarte un puñado de monedas doradas.',
        goldChange: 25,
      },
    ],
  },
  {
    id: 'mercader_ambulante',
    title: 'Mercader Ambulante',
    narrative: 'Un mercader misterioso aparece de la nada, su carreta llena de objetos extraños. "Intercambio justo", dice con una sonrisa torcida. "Una carta tuya por una de las mías."',
    emoji: '🧳',
    options: [
      {
        id: 'trade_card',
        text: 'Intercambiar 1 carta del mazo por otra',
        narrative: 'El mercader revisa tu mazo con ojos expertos. Toma una carta y te entrega otra a cambio. "Un trato justo, como prometí."',
        canRemoveCard: true,
        cardReward: 'wanderer_card',
      },
      {
        id: 'buy_info',
        text: 'Pagar 15g por información',
        narrative: 'El mercader te susurra secretos sobre los peligros que te esperan. "El siguiente enemigo será más débil por lo que sabes." Recuperas algo de salud con la confianza ganada.',
        goldChange: -15,
        hpChange: 8,
        nextEncounterDamageBonus: -3,
      },
      {
        id: 'reject_merchant',
        text: 'Rechazar al mercader',
        narrative: '"Tu pérdida", murmura el mercader mientras desaparece con su carreta.',
      },
    ],
  },
  {
    id: 'cofre_maldito',
    title: 'Cofre Maldito',
    narrative: 'Un cofre ornamentado yace entre las rocas. Su cerradura brilla con runas que parecen palpitar. Tu instinto dice que hay una gran recompensa... o una gran maldición.',
    emoji: '📦',
    options: [
      {
        id: 'open_chest',
        text: 'Abrir el cofre (riesgo)',
        narrative: 'Al abrir el cofre, una explosión de energía oscura te golpea. Entre las sombras encuentras monedas de oro, pero también sientes una maldición grabándose en tu mazo.',
        goldChange: 50,
        curseCard: 'decadencia',
      },
      {
        id: 'smash_chest',
        text: 'Destruir el cofre con fuerza',
        narrative: 'Golpeas el cofre hasta que las runas se apagan. La magia se dispersa inofensivamente. Dentro solo encuentras polvo y una moneda de cobre.',
        goldChange: 5,
      },
      {
        id: 'walk_away',
        text: 'No tocar el cofre',
        narrative: 'La prudencia es la madre de la victoria. Sigues tu camino.',
      },
    ],
  },
  {
    id: 'altar_poder',
    title: 'Altar del Poder',
    narrative: 'Un antiguo altar de piedra humeante emana energía pura. Ofrece mejorar tus cartas, pero advierte: "El poder tiene un precio. Tu próximo enemigo sentirá mi ira."',
    emoji: '⛪',
    options: [
      {
        id: 'altar_upgrade',
        text: 'Mejorar 1 carta (enemigo +30%)',
        narrative: 'El altar resplandece y tus cartas brillan con nueva fuerza. Una onda de energía se expande por el camino — los enemigos la sentirán.',
        canUpgradeCard: true,
        nextEncounterDamageBonus: 3,
      },
      {
        id: 'altar_heal',
        text: 'Absorber la energía (curar 20 HP)',
        narrative: 'Te acercas al altar y la energía fluye hacia ti. El calor reconfortante repara tus heridas mientras el altar se oscurece.',
        hpChange: 20,
      },
      {
        id: 'altar_leave',
        text: 'Dejar el altar intacto',
        narrative: 'El altar continúa brillando para el siguiente aventurero que pase por aquí.',
      },
    ],
  },
  {
    id: 'manantial',
    title: 'Manantial Sagrado',
    narrative: 'Entre las raíces de un árbol milenario brota un manantial de aguas cristalinas. El agua desprende un aroma a flores silvestres y la luz se filtra entre las hojas doradas.',
    emoji: '🌊',
    options: [
      {
        id: 'drink_spring',
        text: 'Beber del manantial sagrado',
        narrative: 'El agua es la más pura que jamás has probado. Un calor agradable se extiende por todo tu cuerpo. Tus heridas se cierran y tu espíritu se renueva.',
        hpChange: 25,
      },
      {
        id: 'fill_flask',
        text: 'Llenar tu cantimplora',
        narrative: 'Guardas agua del manantial para el camino. Aunque no la bebes ahora, la presencia del lugar sagrado te llena de paz y recuperas algo de energía.',
        goldChange: 10,
        hpChange: 5,
      },
    ],
  },
  {
    id: 'campamento_bandidos',
    title: 'Campamento Bandidos',
    narrative: 'Humo se eleva entre los árboles. Un campamento de bandidos abandonado contiene cofres con botín. Pero parece demasiado tranquilo... quizás quedó una trampa.',
    emoji: '🔥',
    options: [
      {
        id: 'loot_camp',
        text: 'Registrar el campamento',
        narrative: 'Encuentras bolsas de oro y provisiones. Los bandidos ya se fueron. Es tu día de suerte.',
        goldChange: 35,
      },
      {
        id: 'ambush_check',
        text: 'Inspeccionar con cuidado',
        narrative: 'Descubres una trampa oculta bajo los cofres. Al desarmarla, encuentras las monedas que los bandidos querían proteger.',
        goldChange: 20,
        hpChange: 5,
      },
    ],
  },
  {
    id: 'grimorio',
    title: 'Grimorio Antiguo',
    narrative: 'Un grimorio encuadernado en cuero negro descansa sobre un pedestal de piedra. Sus páginas están escritas en una lengua antigua, pero los diagramas de cartas brillan con magia activa.',
    emoji: '📖',
    options: [
      {
        id: 'study_grimoire',
        text: 'Estudiar el grimorio',
        narrative: 'Pasas horas estudiando las páginas. Cuando terminas, una carta materializada se desliza del libro hacia tus manos. La sabiduría antigua es tuya.',
        cardReward: 'grimorio_card',
      },
      {
        id: 'sell_grimoire',
        text: 'Vender el grimorio a cambio de oro',
        narrative: 'Alguien pagará bien por este libro. Guardas el oro y continúas tu camino sin mirar atrás.',
        goldChange: 40,
      },
    ],
  },
  {
    id: 'viajero_herido',
    title: 'Viajero Herido',
    narrative: 'Un viajero malherido yace junto al sendero. Sus ojos se abren con dificultad. "Ayúdame... o quédate con lo que tengo." Su saco contiene objetos de valor.',
    emoji: '🤕',
    options: [
      {
        id: 'help_traveler',
        text: 'Ayudar al viajero (cuesta 10 HP)',
        narrative: 'Vendas sus heridas y le das parte de tu energía. A cambio, el viajero te da un amuleto mágico y un poco de oro como agradecimiento.',
        hpChange: -10,
        goldChange: 20,
      },
      {
        id: 'rob_traveler',
        text: 'Tomar su saco',
        narrative: 'El viajero no puede impedirte tomar el saco. Encuentras monedas y un objeto brillante. La culpa te pesa, pero el camino es duro.',
        goldChange: 35,
        curseCard: 'culpa',
      },
      {
        id: 'pass_traveler',
        text: 'Seguir sin detenerte',
        narrative: 'No puedes permitirte detenerte. El viajero asiente con comprensión mientras te alejas.',
      },
    ],
  },
];

export function getRandomEvent(rng: () => number): GameEvent {
  const idx = Math.floor(rng() * ALL_EVENTS.length);
  return ALL_EVENTS[idx];
}

// ═══════════════════════════════════════════════════════
// TREASURE NODE REWARDS
// ═══════════════════════════════════════════════════════

export function getTreasureReward(): { gold: number; hp?: number } {
  const gold = 15 + Math.floor(Math.random() * 20); // 15-34 gold
  const maybeHeal = Math.random() < 0.3 ? 10 : undefined;
  return { gold, hp: maybeHeal };
}

// ═══════════════════════════════════════════════════════
// GOLD REWARDS
// ═══════════════════════════════════════════════════════

export function getCombatGoldReward(nodeType: NodeType): number {
  switch (nodeType) {
    case 'combat': return 10 + Math.floor(Math.random() * 6);   // 10-15
    case 'elite': return 20 + Math.floor(Math.random() * 11);  // 20-30
    case 'boss': return 40 + Math.floor(Math.random() * 16);   // 40-55
    default: return 10;
  }
}

// Removed: dead code — shop generation is handled directly in engine.ts

