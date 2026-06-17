// ─── Core Game Types ─────────────────────────────────────

export type ClassPath =
  // Tier 0
  | 'vagabundo'
  // Tier 1 (9 ramas)
  | 'mago' | 'picaro' | 'guerrero'
  | 'cazador' | 'monje' | 'druida'
  | 'sacerdote' | 'chaman' | 'caballero'
  // Tier 2 (18 sub-clases)
  | 'hechicero' | 'brujo'
  | 'asesino' | 'bardo'
  | 'paladin' | 'berserker'
  | 'guardabosques' | 'artillero'
  | 'artista_marcial' | 'maestro_zen'
  | 'cambiaformas' | 'invocador'
  | 'clerigo' | 'inquisidor'
  | 'elementalista' | 'ancestral'
  | 'templario' | 'condotiero'
  // Tier 3 (18 legendarias)
  | 'archimago' | 'pirocapitan'
  | 'nigromante' | 'senor_sombras'
  | 'ninja' | 'verdugo'
  | 'trovador' | 'encantador'
  | 'cruzado' | 'santo'
  | 'titan' | 'berserker_ancestral'
  | 'maestro_bestias' | 'cazador_sombras'
  | 'desintegrador' | 'bombardero'
  | 'monje_diamante' | 'avatar'
  | 'iluminado' | 'fantasma_errante'
  | 'hombre_lobo' | 'espiritu_bosque'
  | 'druida_ancestral' | 'latigo_mundo'
  | 'sumo_sacerdote' | 'sanador_divino'
  | 'juez_final' | 'purificador'
  | 'senor_elementos' | 'ciclon'
  | 'chaman_supremo' | 'vidente'
  | 'paladin_legendario' | 'muro_hierro'
  | 'mercenario_real' | 'capitan_guerra';

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
  cleared: boolean;    // true only after combat/node is successfully completed
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
  // Original 7
  | 'extra_draw'          // +X cards per turn
  | 'bonus_damage'        // +X damage to all attacks
  | 'end_block'           // +X block at end of turn
  | 'end_heal'            // +X heal at end of turn
  | 'heal_on_damage'      // heal X when dealing damage
  | 'extra_energy'        // +X energy at start of turn
  | 'low_hp_damage'       // +X damage when HP < 50%
  // New 6
  | 'thorns'              // deals X damage back when hit
  | 'scaling_strength'    // +X strength every 3 turns
  | 'self_heal_on_low'    // heals X at end of turn if HP < 50%
  | 'block_on_draw'       // gains X block per card drawn
  | 'draw_on_damage'      // draws X card when taking damage
  | 'combo_bonus';        // if 3+ cards played this turn, +X damage

export interface PassiveEffect {
  type: PassiveType;
  value: number;
}

export interface EvolutionNode {
  id: ClassPath;
  name: string;
  title: string;
  tier: number; // 0, 1, 2, 3
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
  bonusSelfDamageReduction?: number;
  bonusAttackBuff?: number;
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
  nextEncounterDamageBonus?: number;
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
