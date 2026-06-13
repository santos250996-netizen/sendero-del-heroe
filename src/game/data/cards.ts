import { type CardDef, type TransformMap, type ClassPath, type CardUpgradeBonus } from '../types';

// ─── Upgrade bonus presets ────────────────────────────
const dmg3: CardUpgradeBonus = { bonusDamage: 3 };
const dmg2: CardUpgradeBonus = { bonusDamage: 2 };
const dmg4: CardUpgradeBonus = { bonusDamage: 4 };
const blk3: CardUpgradeBonus = { bonusBlock: 3 };
const blk2: CardUpgradeBonus = { bonusBlock: 2 };
const heal3: CardUpgradeBonus = { bonusHeal: 3 };
const heal2: CardUpgradeBonus = { bonusHeal: 2 };
const costDown1: CardUpgradeBonus = { costReduction: 1 };
const draw1: CardUpgradeBonus = { bonusDraw: 1 };
const burn2: CardUpgradeBonus = { bonusBurn: 2 };
const poison2: CardUpgradeBonus = { bonusPoison: 2 };
const freeze1: CardUpgradeBonus = { bonusFreeze: 1 };
const weaken1: CardUpgradeBonus = { bonusWeaken: 1 };
const str2: CardUpgradeBonus = { bonusStrengthBuff: 2 };
const eng1: CardUpgradeBonus = { bonusEnergyGain: 1 };
const aoe5: CardUpgradeBonus = { bonusAoeDamage: 5 };
const selfDmgReduce2: CardUpgradeBonus = { bonusSelfDamageReduction: 2 };

// ─── ALL CARDS ──────────────────────────────────────────

export const ALL_CARDS: CardDef[] = [
  // ═══ BASE: VAGABUNDO (Tier 0) ═══
  {
    id: 'golpe_basico', name: 'Golpe Básico',
    description: 'Ataca con lo que tienes a mano.',
    cost: 1, rarity: 'starter', target: 'enemy', classPath: 'vagabundo', tier: 0,
    damage: 6, upgradeBonus: dmg3,
  },
  {
    id: 'escudo_ramas', name: 'Escudo de Ramas',
    description: 'Un muro frágil de ramas entrelazadas.',
    cost: 1, rarity: 'starter', target: 'self', classPath: 'vagabundo', tier: 0,
    block: 5, upgradeBonus: blk3,
  },

  // ═══ MAGO (Tier 1) — New cards ═══
  {
    id: 'rayo', name: 'Rayo',
    description: 'Una descarga eléctrica concentrada.',
    cost: 2, rarity: 'common', target: 'enemy', classPath: 'mago', tier: 1,
    damage: 8, upgradeBonus: dmg4,
  },
  {
    id: 'meditacion', name: 'Meditación',
    description: 'Calma la mente. Cura 5 HP y roba 2 cartas.',
    cost: 1, rarity: 'common', target: 'self', classPath: 'mago', tier: 1,
    heal: 5, drawCards: 2, upgradeBonus: heal3,
  },

  // ═══ PÍCARO (Tier 1) — New cards ═══
  {
    id: 'veneno', name: 'Veneno',
    description: 'Envenena al enemigo. 3 daño + 3 veneno.',
    cost: 1, rarity: 'common', target: 'enemy', classPath: 'picaro', tier: 1,
    damage: 3, poison: 3, upgradeBonus: poison2,
  },
  {
    id: 'disparo_rapido', name: 'Disparo Rápido',
    description: 'Rápido y gratuito. 3 daño.',
    cost: 0, rarity: 'common', target: 'enemy', classPath: 'picaro', tier: 1,
    damage: 3, upgradeBonus: dmg2,
  },

  // ═══ GUERRERO (Tier 1) — New cards ═══
  {
    id: 'grito_guerra', name: 'Grito de Guerra',
    description: 'Ruge con fuerza. 4 daño +2 Fuerza permanente.',
    cost: 1, rarity: 'common', target: 'enemy', classPath: 'guerrero', tier: 1,
    damage: 4, strengthBuff: 2, upgradeBonus: str2,
  },
  {
    id: 'garrote', name: 'Garrote',
    description: 'Un golpe contundente. 5 daño + roba 1.',
    cost: 1, rarity: 'common', target: 'enemy', classPath: 'guerrero', tier: 1,
    damage: 5, drawCards: 1, upgradeBonus: dmg2,
  },

  // ═══ TRANSFORMED: VAGABUNDO → TIER 1 ═══
  // Mago transforms
  {
    id: 'bola_fuego', name: 'Bola de Fuego',
    description: '5 daño + quema 3 al enemigo.',
    cost: 1, rarity: 'common', target: 'enemy', classPath: 'mago', tier: 1,
    damage: 5, burn: 3, upgradeBonus: burn2,
  },
  {
    id: 'escudo_arcano', name: 'Escudo Arcano',
    description: '4 bloque + congela 1 turno del enemigo.',
    cost: 1, rarity: 'common', target: 'enemy', classPath: 'mago', tier: 1,
    freeze: 1, upgradeBonus: freeze1,
  },
  // Pícaro transforms
  {
    id: 'punialada', name: 'Puñalada',
    description: '4 daño + roba 1 carta.',
    cost: 1, rarity: 'common', target: 'enemy', classPath: 'picaro', tier: 1,
    damage: 4, drawCards: 1, upgradeBonus: dmg2,
  },
  {
    id: 'evadir', name: 'Evadir',
    description: 'Esquiva el próximo ataque enemigo.',
    cost: 1, rarity: 'common', target: 'self', classPath: 'picaro', tier: 1,
    block: 3, upgradeBonus: blk2,
  },
  // Guerrero transforms
  {
    id: 'corte_poderoso', name: 'Corte Poderoso',
    description: 'Un corte devastador. 8 daño.',
    cost: 1, rarity: 'common', target: 'enemy', classPath: 'guerrero', tier: 1,
    damage: 8, upgradeBonus: dmg3,
  },
  {
    id: 'muro_escudos', name: 'Muro de Escudos',
    description: '8 bloque. Una fortaleza de acero.',
    cost: 1, rarity: 'common', target: 'self', classPath: 'guerrero', tier: 1,
    block: 8, upgradeBonus: blk3,
  },

  // ═══ HECHICERO (Tier 2) — New cards ═══
  {
    id: 'meteorito', name: 'Meteorito',
    description: 'Hace caer fuego del cielo. 15 daño a todos.',
    cost: 3, rarity: 'rare', target: 'all_enemies', classPath: 'hechicero', tier: 2,
    aoeDamage: 15, upgradeBonus: aoe5,
  },
  {
    id: 'foco', name: 'Foco Arcano',
    description: 'Concentración pura. Roba 3 cartas.',
    cost: 1, rarity: 'rare', target: 'self', classPath: 'hechicero', tier: 2,
    drawCards: 3, upgradeBonus: draw1,
  },
  // Hechicero transforms
  {
    id: 'llamarada', name: 'Llamarada',
    description: 'Inferno devasta. 8 daño + 5 quemadura.',
    cost: 2, rarity: 'rare', target: 'enemy', classPath: 'hechicero', tier: 2,
    damage: 8, burn: 5, upgradeBonus: burn2,
  },
  {
    id: 'barrera_hielo', name: 'Barrera de Hielo',
    description: '6 bloque + congela 2 turnos.',
    cost: 2, rarity: 'rare', target: 'enemy', classPath: 'hechicero', tier: 2,
    block: 6, freeze: 2, upgradeBonus: freeze1,
  },

  // ═══ BRUJO (Tier 2) — New cards ═══
  {
    id: 'pacto_oscuro', name: 'Pacto Oscuro',
    description: 'Sacrificio. Pierde 5 HP, gana 3 energía.',
    cost: 0, rarity: 'rare', target: 'self', classPath: 'brujo', tier: 2,
    selfDamage: 5, energyGain: 3, upgradeBonus: eng1,
  },
  {
    id: 'robo_vida', name: 'Robo de Vida',
    description: '8 daño + cura 4 HP.',
    cost: 2, rarity: 'rare', target: 'enemy', classPath: 'brujo', tier: 2,
    damage: 8, heal: 4, upgradeBonus: dmg2,
  },
  // Brujo transforms
  {
    id: 'drenar_alma', name: 'Drenar Alma',
    description: 'Roba la fuerza vital. 6 daño + quema 2.',
    cost: 2, rarity: 'rare', target: 'enemy', classPath: 'brujo', tier: 2,
    damage: 6, burn: 2, upgradeBonus: dmg2,
  },
  {
    id: 'maldicion', name: 'Maldición de Debilidad',
    description: 'Debilita al enemigo. -2 daño permanente.',
    cost: 1, rarity: 'rare', target: 'enemy', classPath: 'brujo', tier: 2,
    weaken: 2, upgradeBonus: weaken1,
  },

  // ═══ ASESINO (Tier 2) — New cards ═══
  {
    id: 'ejecucion', name: 'Ejecución',
    description: 'Si el enemigo tiene <30% HP, 15 daño. Si no, 5.',
    cost: 2, rarity: 'rare', target: 'enemy', classPath: 'asesino', tier: 2,
    damage: 5, executeThreshold: 30, executeDamage: 15, upgradeBonus: dmg2,
  },
  {
    id: 'emboscada', name: 'Emboscada',
    description: 'Ataque sorpresa. 10 daño + roba 2.',
    cost: 2, rarity: 'rare', target: 'enemy', classPath: 'asesino', tier: 2,
    damage: 10, drawCards: 2, upgradeBonus: dmg3,
  },
  // Asesino transforms
  {
    id: 'apunialar', name: 'Apuñalar',
    description: 'Golpe mortal. 7 daño + 3 veneno.',
    cost: 1, rarity: 'rare', target: 'enemy', classPath: 'asesino', tier: 2,
    damage: 7, poison: 3, upgradeBonus: poison2,
  },
  {
    id: 'sombras', name: 'Sombras',
    description: 'Se funde con la oscuridad. Esquiva 2 ataques.',
    cost: 1, rarity: 'rare', target: 'self', classPath: 'asesino', tier: 2,
    block: 6, upgradeBonus: blk2,
  },

  // ═══ BARDO (Tier 2) — New cards ═══
  {
    id: 'cancion_guerra', name: 'Canción de Guerra',
    description: 'Inspira valor. +3 daño a todos los ataques este turno.',
    cost: 1, rarity: 'rare', target: 'passive', classPath: 'bardo', tier: 2,
    attackBuffTurn: 3, upgradeBonus: costDown1,
  },
  {
    id: 'inspiracion_bardo', name: 'Inspiración',
    description: 'Una melodía que renueva las esperanzas. Roba 4.',
    cost: 1, rarity: 'rare', target: 'self', classPath: 'bardo', tier: 2,
    drawCards: 4, upgradeBonus: draw1,
  },
  // Bardo transforms
  {
    id: 'golpe_ritmico', name: 'Golpe Rítmico',
    description: '5 daño al compás + roba 1.',
    cost: 1, rarity: 'rare', target: 'enemy', classPath: 'bardo', tier: 2,
    damage: 5, drawCards: 1, upgradeBonus: dmg2,
  },
  {
    id: 'melodia_protectora', name: 'Melodía Protectora',
    description: '4 bloque + cura 2 HP.',
    cost: 1, rarity: 'rare', target: 'self', classPath: 'bardo', tier: 2,
    block: 4, heal: 2, upgradeBonus: heal2,
  },

  // ═══ PALADÍN (Tier 2) — New cards ═══
  {
    id: 'luz_sagrada', name: 'Luz Sagrada',
    description: '5 daño + cura 5 HP.',
    cost: 1, rarity: 'rare', target: 'enemy', classPath: 'paladin', tier: 2,
    damage: 5, heal: 5, upgradeBonus: dmg3,
  },
  {
    id: 'castigo', name: 'Castigo',
    description: 'Justicia divina. 12 daño.',
    cost: 2, rarity: 'rare', target: 'enemy', classPath: 'paladin', tier: 2,
    damage: 12, upgradeBonus: dmg3,
  },
  // Paladín transforms
  {
    id: 'golpe_divino', name: 'Golpe Divino',
    description: '10 daño sagrado + cura 3.',
    cost: 2, rarity: 'rare', target: 'enemy', classPath: 'paladin', tier: 2,
    damage: 10, heal: 3, upgradeBonus: dmg3,
  },
  {
    id: 'bendicion', name: 'Bendición',
    description: '8 bloque + cura 5 HP.',
    cost: 2, rarity: 'rare', target: 'self', classPath: 'paladin', tier: 2,
    block: 8, heal: 5, upgradeBonus: heal3,
  },

  // ═══ BERSERKER (Tier 2) — New cards ═══
  {
    id: 'sangre_berserker', name: 'Sangre Berserker',
    description: 'Sacrificio brutal. Pierde 8 HP, 20 daño.',
    cost: 2, rarity: 'rare', target: 'enemy', classPath: 'berserker', tier: 2,
    damage: 20, selfDamage: 8, upgradeBonus: selfDmgReduce2,
  },
  {
    id: 'tromba', name: 'Tromba',
    description: 'Gira sin control. 7 daño a todos. Se lastima 2.',
    cost: 2, rarity: 'rare', target: 'all_enemies', classPath: 'berserker', tier: 2,
    aoeDamage: 7, selfDamage: 2, upgradeBonus: aoe5,
  },
  // Berserker transforms
  {
    id: 'hachazo_salvaje', name: 'Hachazo Salvaje',
    description: 'Un golpe devastador. 10 daño. Se lastima 3.',
    cost: 2, rarity: 'rare', target: 'enemy', classPath: 'berserker', tier: 2,
    damage: 10, selfDamage: 3, upgradeBonus: dmg3,
  },
  {
    id: 'furia', name: 'Furia',
    description: 'Canaliza la rabia. +4 Fuerza. Se lastima 5.',
    cost: 1, rarity: 'rare', target: 'passive', classPath: 'berserker', tier: 2,
    strengthBuff: 4, selfDamage: 5, upgradeBonus: selfDmgReduce2,
  },

  // ═══ CURSE CARDS ═══
  {
    id: 'decadencia', name: 'Decadencia',
    description: 'Maldición: al jugarla, pierdes 3 HP.',
    cost: 0, rarity: 'curse', target: 'self', classPath: 'vagabundo', tier: 0,
    selfDamage: 3,
  },
  {
    id: 'culpa', name: 'Culpa',
    description: 'Maldición: ocupa espacio. No hace nada.',
    cost: 0, rarity: 'curse', target: 'passive', classPath: 'vagabundo', tier: 0,
  },
  {
    id: 'vacuidad', name: 'Vacuidad',
    description: 'Maldición: no puedes robar esta carta. Si la robas, pierdes 1 energía.',
    cost: 0, rarity: 'curse', target: 'passive', classPath: 'vagabundo', tier: 0,
    energyGain: -1,
  },
];

// ─── Card Transform Map ──────────────────────────────────

export const TRANSFORM_MAP: TransformMap = {
  golpe_basico: { mago: 'bola_fuego', picaro: 'punialada', guerrero: 'corte_poderoso' },
  escudo_ramas: { mago: 'escudo_arcano', picaro: 'evadir', guerrero: 'muro_escudos' },
  bola_fuego: { hechicero: 'llamarada', brujo: 'drenar_alma' },
  escudo_arcano: { hechicero: 'barrera_hielo', brujo: 'maldicion' },
  punialada: { asesino: 'apunialar', bardo: 'golpe_ritmico' },
  evadir: { asesino: 'sombras', bardo: 'melodia_protectora' },
  corte_poderoso: { paladin: 'golpe_divino', berserker: 'hachazo_salvaje' },
  muro_escudos: { paladin: 'bendicion', berserker: 'furia' },
};

// ─── Event reward cards (generic) ───────────────────────
// These are "wildcard" cards that can be given by events

export const EVENT_REWARD_CARDS: CardDef[] = [
  {
    id: 'wish_card', name: 'Deseo Cumplido',
    description: 'El pozo concedió tu deseo. 7 daño + 3 bloque.',
    cost: 2, rarity: 'rare', target: 'enemy', classPath: 'vagabundo', tier: 0,
    damage: 7, block: 3, upgradeBonus: dmg3,
  },
  {
    id: 'soul_pact_card', name: 'Pacto de Sangre',
    description: 'Poder oscuro. 10 daño + quema 2.',
    cost: 2, rarity: 'rare', target: 'enemy', classPath: 'vagabundo', tier: 0,
    damage: 10, burn: 2, upgradeBonus: dmg3,
  },
  {
    id: 'wanderer_card', name: 'Carta del Caminante',
    description: 'Versatilidad. Roba 2 + 3 bloque.',
    cost: 1, rarity: 'common', target: 'self', classPath: 'vagabundo', tier: 0,
    drawCards: 2, block: 3, upgradeBonus: draw1,
  },
  {
    id: 'grimorio_card', name: 'Conocimiento Prohibido',
    description: 'Roba 3 y gana 1 energía.',
    cost: 0, rarity: 'rare', target: 'self', classPath: 'vagabundo', tier: 0,
    drawCards: 3, energyGain: 1, upgradeBonus: draw1,
  },
];

// ─── Helpers ────────────────────────────────────────────

export function getCardDef(id: string): CardDef {
  const card = ALL_CARDS.find(c => c.id === id) || EVENT_REWARD_CARDS.find(c => c.id === id);
  if (!card) throw new Error(`Card not found: ${id}`);
  return card;
}

/** Get effective card stats considering upgrade bonus */
export function getEffectiveCardDef(card: { defId: string; upgraded: boolean }): CardDef {
  const def = getCardDef(card.defId);
  if (!card.upgraded || !def.upgradeBonus) return def;

  const ub = def.upgradeBonus;
  return {
    ...def,
    cost: Math.max(0, def.cost - (ub.costReduction || 0)),
    damage: def.damage ? def.damage + (ub.bonusDamage || 0) : undefined,
    aoeDamage: def.aoeDamage ? def.aoeDamage + (ub.bonusAoeDamage || 0) : undefined,
    block: def.block ? def.block + (ub.bonusBlock || 0) : (ub.bonusBlock ? ub.bonusBlock : undefined),
    heal: def.heal ? def.heal + (ub.bonusHeal || 0) : (ub.bonusHeal ? ub.bonusHeal : undefined),
    drawCards: def.drawCards ? def.drawCards + (ub.bonusDraw || 0) : (ub.bonusDraw ? ub.bonusDraw : undefined),
    burn: def.burn ? def.burn + (ub.bonusBurn || 0) : (ub.bonusBurn ? ub.bonusBurn : undefined),
    poison: def.poison ? def.poison + (ub.bonusPoison || 0) : (ub.bonusPoison ? ub.bonusPoison : undefined),
    freeze: def.freeze ? def.freeze + (ub.bonusFreeze || 0) : (ub.bonusFreeze ? ub.bonusFreeze : undefined),
    weaken: def.weaken ? def.weaken + (ub.bonusWeaken || 0) : (ub.bonusWeaken ? ub.bonusWeaken : undefined),
    strengthBuff: def.strengthBuff ? def.strengthBuff + (ub.bonusStrengthBuff || 0) : (ub.bonusStrengthBuff ? ub.bonusStrengthBuff : undefined),
    energyGain: def.energyGain ? def.energyGain + (ub.bonusEnergyGain || 0) : (ub.bonusEnergyGain ? ub.bonusEnergyGain : undefined),
    selfDamage: def.selfDamage ? Math.max(0, def.selfDamage - (ub.bonusSelfDamageReduction || 0)) : undefined,
  };
}

export function transformCard(cardId: string, classPath: ClassPath): string | null {
  const mapping = TRANSFORM_MAP[cardId];
  if (!mapping) return null;
  return mapping[classPath] || null;
}

/** Get all cards available to a given class lineage */
export function getAvailableCards(classPath: string): CardDef[] {
  const lineage = getClassLineage(classPath);
  return ALL_CARDS.filter(c => lineage.includes(c.classPath));
}

/** Get reward pool: cards from player's lineage they don't already own */
export function getRewardPool(classPath: string, ownedDefIds: Set<string>): CardDef[] {
  const available = getAvailableCards(classPath);
  return available.filter(c => !ownedDefIds.has(c.id) && c.rarity !== 'curse');
}

/** Get random card from class lineage for shop/event */
export function getRandomClassCard(classPath: string, excludeIds?: Set<string>): CardDef | null {
  const pool = getAvailableCards(classPath).filter(c => c.rarity !== 'curse' && c.rarity !== 'starter' && (!excludeIds || !excludeIds.has(c.id)));
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function getClassLineage(classPath: string): string[] {
  const lineage: string[] = [classPath];
  let current = classPath;
  const nodes: Record<string, { parent?: string }> = {
    mago: { parent: 'vagabundo' }, picaro: { parent: 'vagabundo' }, guerrero: { parent: 'vagabundo' },
    hechicero: { parent: 'mago' }, brujo: { parent: 'mago' },
    asesino: { parent: 'picaro' }, bardo: { parent: 'picaro' },
    paladin: { parent: 'guerrero' }, berserker: { parent: 'guerrero' },
  };
  while (nodes[current]?.parent) {
    lineage.unshift(nodes[current].parent!);
    current = nodes[current].parent!;
  }
  return lineage;
}

// ─── Card Emoji Map ─────────────────────────────────────

export const CARD_EMOJI: Record<string, string> = {
  golpe_basico: '👊', escudo_ramas: '🌿',
  bola_fuego: '🔥', escudo_arcano: '❄️',
  rayo: '⚡', meditacion: '🧘',
  punialada: '🗡️', evadir: '💨',
  veneno: '☠️', disparo_rapido: '💨',
  corte_poderoso: '⚔️', muro_escudos: '🛡️',
  grito_guerra: '📯', garrote: '💥',
  llamarada: '🔥', barrera_hielo: '🧊',
  meteorito: '☄️', foco: '🔮',
  drenar_alma: '🌑', maldicion: '👁️',
  pacto_oscuro: '♤', robo_vida: '💜',
  apunialar: '🔪', sombras: '🌑',
  ejecucion: '💀', emboscada: '🏹',
  golpe_ritmico: '🎵', melodia_protectora: '🎶',
  cancion_guerra: '🎼', inspiracion_bardo: '🎭',
  golpe_divino: '✨', bendicion: '🙏',
  luz_sagrada: '☀️', castigo: '⚡',
  hachazo_salvaje: '🪓', furia: '😡',
  sangre_berserker: '🩸', tromba: '🌪️',
  // curses
  decadencia: '💀', culpa: '😔', vacuidad: '🕳️',
  // event cards
  wish_card: '⛲', soul_pact_card: '👻', wanderer_card: '🧳', grimorio_card: '📖',
};

// ─── Class Color for Cards ──────────────────────────────

export const CLASS_CARD_BORDER: Record<string, string> = {
  vagabundo: 'border-stone-400/30 bg-stone-900/60',
  mago: 'border-violet-400/30 bg-violet-950/40',
  picaro: 'border-emerald-400/30 bg-emerald-950/40',
  guerrero: 'border-red-400/30 bg-red-950/40',
  hechicero: 'border-orange-400/30 bg-orange-950/40',
  brujo: 'border-slate-400/30 bg-slate-950/40',
  asesino: 'border-teal-400/30 bg-teal-950/40',
  bardo: 'border-indigo-400/30 bg-indigo-950/40',
  paladin: 'border-amber-400/30 bg-amber-950/40',
  berserker: 'border-rose-400/30 bg-rose-950/40',
};
