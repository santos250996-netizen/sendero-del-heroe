// ─── Core Game Types ─────────────────────────────────────

export type ClassPath =
  | 'vagabundo'
  | 'mago' | 'picaro' | 'guerrero'
  | 'hechicero' | 'brujo' | 'asesino' | 'bardo' | 'paladin' | 'berserker';

export type CardRarity = 'starter' | 'common' | 'rare' | 'legendary' | 'curse';
export type CardTarget = 'enemy' | 'self' | 'all_enemies' | 'passive';
export type EnemyTier = 'easy' | 'medium' | 'hard' | 'boss';

export type GamePhase =
  | 'menu'
  | 'map'           // viewing the roguelite map, choosing next node
  | 'battle'        // combat
  | 'evolution_choice'
  | 'reward'        // post-combat card reward
  | 'rest'          // rest stop: heal / remove card / upgrade card
  | 'shop'          // buy cards, remove cards, upgrade cards
  | 'event'         // event narrative + choices
  | 'event_result'  // outcome of an event choice
  | 'gameover'
  | 'victory';

// ─── Map ───────────────────────────────────────────────

export type NodeType = 'combat' | 'elite' | 'rest' | 'shop' | 'event' | 'treasure' | 'boss' | 'evolution';

export interface MapNode {
  id: string;
  type: NodeType;
  layer: number;       // 0-9
  column: number;      // 0 or 1 (2 columns)
  visited: boolean;
  available: boolean;
  // Combat / Elite / Boss nodes
  encounterDifficulty: number;  // scales enemy selection
  eventId?: string;     // for event nodes
}

export interface GameMap {
  nodes: MapNode[];     // flat list, ordered by layer
  currentLayer: number; // 0-9
  visitedNodeIds: string[];
  maxLayer: number;
}

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

export interface CardUpgradeBonus {
  bonusDamage?: number;
  bonusBlock?: number;
  bonusHeal?: number;
  costReduction?: number;
  bonusDraw?: number;
  bonusBurn?: number;
  bonusPoison?: number;
  bonusEnergyGain?: number;
  bonusStrengthBuff?: number;
  bonusAoeDamage?: number;
  bonusFreeze?: number;
  bonusWeaken?: number;
  bonusDodge?: number;
  bonusSelfDamageReduction?: number; // reduces self-damage
}

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
  dodge?: number;
  // conditional (execute: if enemy < X% HP, deal executeDamage)
  executeThreshold?: number;
  executeDamage?: number;
  // upgrade bonus: applied when card.upgraded = true
  upgradeBonus?: CardUpgradeBonus;
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
  classWeakness?: ClassPath;
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
  block: number;
  xp: number;
  evolutionTier: number;
  classPath: ClassPath;
  nextAttackBuff: number;
  dodgeCount: number;
  attackBuffTurn: number;
  gold: number;
}

// ─── Instances ──────────────────────────────────────────

export interface CardInstance {
  uid: string;
  defId: string;
  upgraded: boolean;
}

// ─── Events ─────────────────────────────────────────────

export interface EventOption {
  id: string;
  text: string;          // short choice text
  narrative: string;     // what happens after choosing
  goldChange?: number;
  hpChange?: number;     // direct HP change (can be negative)
  maxHpChange?: number;   // permanent max HP change
  cardReward?: string;    // cardId to add to deck
  canRemoveCard?: boolean;
  canUpgradeCard?: boolean;
  curseCard?: string;     // cardId of curse to add
  nextEncounterDamageBonus?: number;  // buff/debuff next enemy encounter
}

export interface GameEvent {
  id: string;
  title: string;
  narrative: string;
  emoji: string;
  options: EventOption[];
}

// ─── Shop ───────────────────────────────────────────────

export interface ShopItem {
  id: string;
  type: 'card' | 'remove' | 'upgrade';
  cardDefId?: string;
  cost: number;
  sold: boolean;
}

// ─── Rest ───────────────────────────────────────────────

export type RestChoice = 'heal' | 'remove' | 'upgrade';

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
  // Map
  map: GameMap | null;
  currentNodeId: string | null;
  // Rest
  restChoice: RestChoice | null;
  removingCard: boolean;
  upgradingCard: boolean;
  // Event
  currentEvent: GameEvent | null;
  eventOutcome: EventOption | null;
  // Shop
  shopItems: ShopItem[];
  // Meta flags
  nextEncounterDamageBonus: number;
}
