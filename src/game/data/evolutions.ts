import { type EvolutionNode } from '../types';

// ─── Evolution Tree ───────────────────────────────────────
// Vagabundo → Mago / Pícaro / Guerrero → 2 sub-classes each → Legendary

export const EVOLUTION_TREE: Record<string, EvolutionNode> = {
  // ═══ TIER 0: VAGABUNDO ═══
  vagabundo: {
    id: 'vagabundo',
    name: 'Vagabundo',
    title: 'El Errante',
    tier: 0,
    maxHp: 55,
    maxEnergy: 2,
    drawPerTurn: 3,
    requiredXp: 0,
    passive: { type: 'extra_draw', value: 0 },
    passiveDescription: 'Sin habilidad pasiva.',
    bonusStrength: 0,
    description: 'Un alma perdida que busca su destino en el camino.',
    emoji: '🚶',
    colorClasses: 'from-stone-500 to-stone-700',
    unlockCardIds: ['golpe_basico', 'escudo_ramas'],
  },

  // ═══ TIER 1: PRIMERAS CLASES ═══
  mago: {
    id: 'mago',
    name: 'Mago',
    title: 'El Discípulo Arcano',
    tier: 1,
    parent: 'vagabundo',
    maxHp: 60,
    maxEnergy: 3,
    drawPerTurn: 3,
    requiredXp: 15,
    passive: { type: 'bonus_damage', value: 1 },
    passiveDescription: '+1 daño a todos los ataques.',
    bonusStrength: 0,
    description: 'Ha despertado su poder interior. La magia fluye por sus venas.',
    emoji: '🔮',
    colorClasses: 'from-violet-600 to-purple-800',
    unlockCardIds: ['rayo', 'meditacion'],
  },
  picaro: {
    id: 'picaro',
    name: 'Pícaro',
    title: 'La Sombra Veloz',
    tier: 1,
    parent: 'vagabundo',
    maxHp: 58,
    maxEnergy: 3,
    drawPerTurn: 5,
    requiredXp: 15,
    passive: { type: 'extra_draw', value: 1 },
    passiveDescription: 'Roba 1 carta adicional por turno.',
    bonusStrength: 0,
    description: 'Rápido, letal, invisible. Ataca antes de que lo veas.',
    emoji: '🗡️',
    colorClasses: 'from-emerald-600 to-green-800',
    unlockCardIds: ['veneno', 'disparo_rapido'],
  },
  guerrero: {
    id: 'guerrero',
    name: 'Guerrero',
    title: 'El Forjado en Batalla',
    tier: 1,
    parent: 'vagabundo',
    maxHp: 75,
    maxEnergy: 3,
    drawPerTurn: 4,
    requiredXp: 15,
    passive: { type: 'end_block', value: 2 },
    passiveDescription: 'Gana 2 bloque al final de cada turno.',
    bonusStrength: 1,
    description: 'Templado por cientos de combates, su voluntad es acero.',
    emoji: '⚔️',
    colorClasses: 'from-red-600 to-red-800',
    unlockCardIds: ['grito_guerra', 'garrote'],
  },

  // ═══ TIER 2: SUB-CLASES (2 por rama) ═══
  // --- Rama Mago ---
  hechicero: {
    id: 'hechicero',
    name: 'Hechicero',
    title: 'Señor del Fuego y Hielo',
    tier: 2,
    parent: 'mago',
    maxHp: 70,
    maxEnergy: 3,
    drawPerTurn: 3,
    requiredXp: 40,
    passive: { type: 'bonus_damage', value: 2 },
    passiveDescription: '+2 daño a todos los ataques.',
    bonusStrength: 0,
    description: 'Domina los elementos primordiales. Su magia arrasa campos enteros.',
    emoji: '🔥',
    colorClasses: 'from-orange-500 to-amber-700',
    unlockCardIds: ['meteorito', 'foco'],
  },
  brujo: {
    id: 'brujo',
    name: 'Brujo',
    title: 'Tejedor de Sombras',
    tier: 2,
    parent: 'mago',
    maxHp: 65,
    maxEnergy: 3,
    drawPerTurn: 3,
    requiredXp: 40,
    passive: { type: 'heal_on_damage', value: 2 },
    passiveDescription: 'Cura 2 HP cada vez que infliges daño.',
    bonusStrength: 0,
    description: 'Pactó con las sombras. Su poder roba la vida de sus enemigos.',
    emoji: '🌑',
    colorClasses: 'from-slate-600 to-slate-900',
    unlockCardIds: ['pacto_oscuro', 'robo_vida'],
  },
  // --- Rama Pícaro ---
  asesino: {
    id: 'asesino',
    name: 'Asesino',
    title: 'La Hoja Silenciosa',
    tier: 2,
    parent: 'picaro',
    maxHp: 60,
    maxEnergy: 3,
    drawPerTurn: 5,
    requiredXp: 40,
    passive: { type: 'extra_energy', value: 1 },
    passiveDescription: '+1 energía al inicio de cada turno.',
    bonusStrength: 0,
    description: 'Un golpe, una muerte. No falla.',
    emoji: '🗡️',
    colorClasses: 'from-teal-600 to-cyan-800',
    unlockCardIds: ['ejecucion', 'emboscada'],
  },
  bardo: {
    id: 'bardo',
    name: 'Bardo',
    title: 'El Voz de la Batalla',
    tier: 2,
    parent: 'picaro',
    maxHp: 62,
    maxEnergy: 4,
    drawPerTurn: 5,
    requiredXp: 40,
    passive: { type: 'extra_energy', value: 1 },
    passiveDescription: '+1 energía al inicio de cada turno.',
    bonusStrength: 0,
    description: 'Sus canciones otorgan fuerza. Sus melodías cambian el destino.',
    emoji: '🎭',
    colorClasses: 'from-indigo-500 to-violet-700',
    unlockCardIds: ['cancion_guerra', 'inspiracion_bardo'],
  },
  // --- Rama Guerrero ---
  paladin: {
    id: 'paladin',
    name: 'Paladín',
    title: 'El Escudo Sagrado',
    tier: 2,
    parent: 'guerrero',
    maxHp: 90,
    maxEnergy: 3,
    drawPerTurn: 4,
    requiredXp: 40,
    passive: { type: 'end_heal', value: 3 },
    passiveDescription: 'Cura 3 HP al final de cada turno.',
    bonusStrength: 1,
    description: 'Fe y acero. Protege a los débiles con fuerza divina.',
    emoji: '🛡️',
    colorClasses: 'from-amber-500 to-yellow-700',
    unlockCardIds: ['luz_sagrada', 'castigo'],
  },
  berserker: {
    id: 'berserker',
    name: 'Berserker',
    title: 'La Ira Desatada',
    tier: 2,
    parent: 'guerrero',
    maxHp: 85,
    maxEnergy: 3,
    drawPerTurn: 4,
    requiredXp: 40,
    passive: { type: 'low_hp_damage', value: 4 },
    passiveDescription: 'Si tiene menos del 50% HP, +4 daño a los ataques.',
    bonusStrength: 1,
    description: 'La sangre lo alimenta. Cuanto más herido, más letal.',
    emoji: '🪓',
    colorClasses: 'from-rose-600 to-red-800',
    unlockCardIds: ['sangre_berserker', 'tromba'],
  },
};

// ─── Helpers ────────────────────────────────────────────

export function getEvolutionNode(id: string): EvolutionNode {
  const node = EVOLUTION_TREE[id];
  if (!node) throw new Error(`Evolution not found: ${id}`);
  return node;
}

export function getChildren(parentId: string): EvolutionNode[] {
  return Object.values(EVOLUTION_TREE).filter(n => n.parent === parentId);
}

export function getEvolutionChoices(playerTier: number, playerClass: string): EvolutionNode[] {
  if (playerTier === 0) {
    // Vagabundo → choose Tier 1 class
    return getChildren('vagabundo');
  }
  if (playerTier === 1) {
    // Tier 1 → choose Tier 2 sub-class
    return getChildren(playerClass);
  }
  return []; // Tier 2→3 is automatic (not implemented yet)
}

export function getClassLineage(classPath: string): string[] {
  const lineage: string[] = [classPath];
  let current = classPath;
  while (true) {
    const node = EVOLUTION_TREE[current];
    if (!node || !node.parent) break;
    lineage.unshift(node.parent);
    current = node.parent;
  }
  return lineage;
}

export function getClassColor(classPath: string): string {
  return EVOLUTION_TREE[classPath]?.colorClasses || 'from-stone-500 to-stone-700';
}

export function getClassEmoji(classPath: string): string {
  return EVOLUTION_TREE[classPath]?.emoji || '❓';
}
