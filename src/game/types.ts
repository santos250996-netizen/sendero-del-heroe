// ─── Core Game Types ─────────────────────────────────────

export type EvolutionTier = 0 | 1 | 2 | 3 | 4;

export interface EvolutionPath {
  tier: EvolutionTier;
  name: string;
  title: string;
  maxHp: number;
  maxEnergy: number;
  drawPerTurn: number;
  unlockCards: string[];
  requiredXp: number;
  bonusStrength: number;
  description: string;
}

export type CardRarity = 'starter' | 'common' | 'rare' | 'legendary';
export type CardTarget = 'enemy' | 'self' | 'all_enemies' | 'passive';

export interface CardDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  rarity: CardRarity;
  target: CardTarget;
  damage?: number;
  heal?: number;
  block?: number;
  strengthBuff?: number;
  drawCards?: number;
  damageMultiplier?: number; // e.g. scales with missing HP
  armorPierce?: boolean;
  aoeDamage?: number;
  nextAttackBuff?: number;
  hpThreshold?: number; // percentage of missing HP to scale
  availableFromTier: EvolutionTier;
}

export interface CardInstance {
  uid: string; // unique instance id
  defId: string;
}

export type EnemyTier = 'easy' | 'medium' | 'hard' | 'boss';

export interface EnemyDef {
  id: string;
  name: string;
  maxHp: number;
  damage: number;
  block: number;
  tier: EnemyTier;
  minEncounter: number;
  description: string;
}

export interface EnemyState {
  defId: string;
  hp: number;
  maxHp: number;
  block: number;
  name: string;
  tier: EnemyTier;
}

export type GamePhase =
  | 'menu'
  | 'battle'
  | 'reward'
  | 'evolution'
  | 'victory'
  | 'gameover';

export interface PlayerState {
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  drawPerTurn: number;
  strength: number;
  xp: number;
  evolutionTier: EvolutionTier;
  nextAttackBuff: number;
}

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
}
