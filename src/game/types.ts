// ─── Core Game Types ─────────────────────────────────────

export type ClassPath =
  | 'vagabundo'
  | 'mago' | 'picaro' | 'guerrero'
  | 'hechicero' | 'brujo' | 'asesino' | 'bardo' | 'paladin' | 'berserker';

export type CardRarity = 'starter' | 'common' | 'rare' | 'legendary';
export type CardTarget = 'enemy' | 'self' | 'all_enemies' | 'passive';
export type EnemyTier = 'easy' | 'medium' | 'hard' | 'boss';
export type GamePhase =
  | 'menu'
  | 'battle'
  | 'evolution_choice'
  | 'reward'
  | 'gameover'
  | 'victory';

// ─── Evolution ──────────────────────────────────────────

export type PassiveType =
  | 'extra_draw'
  | 'bonus_damage'
  | 'end_block'
  | 'end_heal'
  | 'heal_on_damage'
  | 'extra_energy';

export interface PassiveEffect {
  type: PassiveType;
  value: number;
}

export interface EvolutionNode {
  id: ClassPath;
  name: string;
  title: string;
  tier: number; // 0, 1, 2
  parent?: ClassPath;
  maxHp: number;
  maxEnergy: number;
  drawPerTurn: number;
  requiredXp: number;
  passive: PassiveEffect;
  passiveDescription: string;
  bonusStrength: number;
  description: string;
  emoji: string;
  colorClasses: string;
  unlockCardIds: string[];
}

// ─── Cards ─────────────────────────────────────────────

export interface CardDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  rarity: CardRarity;
  target: CardTarget;
  classPath: ClassPath;
  tier: number;
  // damage
  damage?: number;
  aoeDamage?: number;
  damageMultiplier?: number;
  armorPierce?: boolean;
  // heal
  heal?: number;
  // block
  block?: number;
  // buffs
  strengthBuff?: number;
  drawCards?: number;
  energyGain?: number;
  nextAttackBuff?: number;
  attackBuffTurn?: number;
  // debuffs on enemy
  burn?: number;
  poison?: number;
  freeze?: number;
  weaken?: number;
  // self effects
  selfDamage?: number;
  // conditional (execute: if enemy < X% HP, deal executeDamage)
  executeThreshold?: number;
  executeDamage?: number;
}

// ─── Transform map ─────────────────────────────────────

// Maps cardId → { classPath → newCardId }
export type TransformMap = Record<string, Partial<Record<ClassPath, string>>>;

// ─── Enemies ────────────────────────────────────────────

export interface EnemyDef {
  id: string;
  name: string;
  maxHp: number;
  damage: number;
  block: number;
  tier: EnemyTier;
  minEncounter: number;
  description: string;
  classWeakness?: ClassPath; // takes 50% more damage from this class family
}

export interface EnemyState {
  defId: string;
  hp: number;
  maxHp: number;
  block: number;
  name: string;
  tier: EnemyTier;
  // status effects
  burn: number;
  poison: number;
  freeze: number;
  weaken: number;
}

// ─── Player ────────────────────────────────────────────

export interface PlayerState {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  drawPerTurn: number;
  strength: number;
  xp: number;
  evolutionTier: number;
  classPath: ClassPath;
  nextAttackBuff: number;
  dodgeCount: number;
  attackBuffTurn: number;
}

// ─── Instances ──────────────────────────────────────────

export interface CardInstance {
  uid: string;
  defId: string;
}

// ─── Game State ─────────────────────────────────────────

export interface GameState {
  phase: GamePhase;
  player: PlayerState;
  deck: CardInstance[];
  hand: CardInstance[];
  discard: CardInstance[];
  enemy: EnemyState | null;
  encounter: number;
  turn: number;
  log: string[];
  rewardCards: CardInstance[];
  pendingEvolution: boolean;
  evolutionChoices: ClassPath[];
  pickedRewards: string[];
}
