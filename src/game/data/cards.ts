import { type CardDef, type EvolutionPath } from '../types';

// ─── Evolution Paths ────────────────────────────────────

export const EVOLUTIONS: EvolutionPath[] = [
  {
    tier: 0,
    name: 'Vagabundo',
    title: 'El Errante',
    maxHp: 55,
    maxEnergy: 2,
    drawPerTurn: 3,
    unlockCards: ['golpe_basico', 'escudo_ramas'],
    requiredXp: 0,
    bonusStrength: 0,
    description: 'Un alma perdida que busca su destino en el camino.',
  },
  {
    tier: 1,
    name: 'Aprendiz',
    title: 'El Que Aprende',
    maxHp: 70,
    maxEnergy: 3,
    drawPerTurn: 4,
    unlockCards: ['grito_guerra', 'meditacion', 'espada_rota'],
    requiredXp: 15,
    bonusStrength: 1,
    description: 'Ha aprendido que el poder viene del conocimiento.',
  },
  {
    tier: 2,
    name: 'Guerrero',
    title: 'El Forjado en Batalla',
    maxHp: 90,
    maxEnergy: 3,
    drawPerTurn: 4,
    unlockCards: ['fuerza_salvaje', 'bandera_batalla', 'resiliencia'],
    requiredXp: 40,
    bonusStrength: 2,
    description: 'Templado por cientos de combates, su voluntad es acero.',
  },
  {
    tier: 3,
    name: 'Campeón',
    title: 'El Protector del Reino',
    maxHp: 115,
    maxEnergy: 4,
    drawPerTurn: 5,
    unlockCards: ['furia_exilio'],
    requiredXp: 80,
    bonusStrength: 3,
    description: 'Los pueblos susurran su nombre con reverencia.',
  },
  {
    tier: 4,
    name: 'Leyenda',
    title: 'El Mito Vivo',
    maxHp: 140,
    maxEnergy: 4,
    drawPerTurn: 5,
    unlockCards: ['golpe_leyenda'],
    requiredXp: 130,
    bonusStrength: 5,
    description: 'Su nombre se escribirá en las estrellas. Es eterno.',
  },
];

// ─── 10 Cards ───────────────────────────────────────────

export const ALL_CARDS: CardDef[] = [
  // TIER 0 - Starter
  {
    id: 'golpe_basico',
    name: 'Golpe Básico',
    description: 'Ataca con lo que tienes a mano.',
    cost: 1,
    rarity: 'starter',
    target: 'enemy',
    damage: 6,
    availableFromTier: 0,
  },
  {
    id: 'escudo_ramas',
    name: 'Escudo de Ramas',
    description: 'Un muro frágil de ramas entrelazadas.',
    cost: 1,
    rarity: 'starter',
    target: 'self',
    block: 5,
    availableFromTier: 0,
  },

  // TIER 1 - Aprendiz
  {
    id: 'grito_guerra',
    name: 'Grito de Guerra',
    description: 'Ruge y gana +2 Fuerza permanente.',
    cost: 1,
    rarity: 'common',
    target: 'self',
    strengthBuff: 2,
    damage: 4,
    availableFromTier: 1,
  },
  {
    id: 'meditacion',
    name: 'Meditación',
    description: 'Calma la mente. Cura 5 HP y roba 2 cartas.',
    cost: 1,
    rarity: 'common',
    target: 'self',
    heal: 5,
    drawCards: 2,
    availableFromTier: 1,
  },
  {
    id: 'espada_rota',
    name: 'Espada Rota',
    description: 'Una espada rota que aún corta. Ignora bloque enemigo.',
    cost: 2,
    rarity: 'common',
    target: 'enemy',
    damage: 8,
    armorPierce: true,
    availableFromTier: 1,
  },

  // TIER 2 - Guerrero
  {
    id: 'fuerza_salvaje',
    name: 'Fuerza Salvaje',
    description: 'Cuanto más herido, más fuerte. Daño escala con HP perdido.',
    cost: 2,
    rarity: 'rare',
    target: 'enemy',
    damage: 5,
    damageMultiplier: 1.5, // extra damage per % missing HP
    hpThreshold: 1, // always scales
    availableFromTier: 2,
  },
  {
    id: 'bandera_batalla',
    name: 'Bandera de Batalla',
    description: 'Alza la bandera. El siguiente ataque +8 daño.',
    cost: 1,
    rarity: 'rare',
    target: 'passive',
    nextAttackBuff: 8,
    availableFromTier: 2,
  },
  {
    id: 'resiliencia',
    name: 'Resiliencia',
    description: 'El cuerpo resiste. Gana 10 de bloque y cura 3 HP.',
    cost: 2,
    rarity: 'rare',
    target: 'self',
    block: 10,
    heal: 3,
    availableFromTier: 2,
  },

  // TIER 3 - Campeón
  {
    id: 'furia_exilio',
    name: 'Furia del Exilio',
    description: 'Libera todo el dolor acumulado. 12 daño a todos los enemigos.',
    cost: 3,
    rarity: 'rare',
    target: 'all_enemies',
    aoeDamage: 12,
    availableFromTier: 3,
  },

  // TIER 4 - Leyenda
  {
    id: 'golpe_leyenda',
    name: 'Golpe de Leyenda',
    description: 'Un ataque digno de un mito. 20 daño + Fuerza x3.',
    cost: 3,
    rarity: 'legendary',
    target: 'enemy',
    damage: 20,
    damageMultiplier: 3, // multiply by strength
    availableFromTier: 4,
  },
];

// Helper
export function getCardDef(id: string): CardDef {
  const card = ALL_CARDS.find(c => c.id === id);
  if (!card) throw new Error(`Card not found: ${id}`);
  return card;
}

export function getEvolution(tier: number): EvolutionPath {
  return EVOLUTIONS[tier];
}

export function getNextEvolution(tier: number): EvolutionPath | null {
  return tier < 4 ? EVOLUTIONS[tier + 1] : null;
}

export function getAvailableCards(tier: number): CardDef[] {
  return ALL_CARDS.filter(c => c.availableFromTier <= tier);
}
