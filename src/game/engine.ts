import {
  type GameState, type CardInstance, type ClassPath, type PassiveType,
} from './types';
import { getCardDef, transformCard, getRewardPool, ALL_CARDS } from './data/cards';
import { getEvolutionNode, getEvolutionChoices, EVOLUTION_TREE } from './data/evolutions';
import { getEnemyForEncounter, getEnemyDef } from './data/enemies';

// ─── UID Generator ────────────────────────────────────────
let uidCounter = 0;
function uid(): string {
  return 'c' + (++uidCounter) + '_' + Date.now().toString(36);
}

// ─── Create new game ─────────────────────────────────────
export function createNewGame(): GameState {
  const evo = getEvolutionNode('vagabundo');
  const starterCards: CardInstance[] = [];
  // 3 copies of each starter card
  for (let i = 0; i < 3; i++) {
    evo.unlockCardIds.forEach(defId => {
      starterCards.push({ uid: uid(), defId });
    });
  }
  const baseState: GameState = {
    phase: 'battle',
    player: {
      hp: evo.maxHp, maxHp: evo.maxHp,
      energy: evo.maxEnergy, maxEnergy: evo.maxEnergy,
      drawPerTurn: evo.drawPerTurn,
      strength: 0, xp: 0,
      evolutionTier: 0,
      classPath: 'vagabundo',
      nextAttackBuff: 0,
      dodgeCount: 0,
      attackBuffTurn: 0,
    },
    deck: starterCards, hand: [], discard: [],
    enemy: null,
    encounter: 0, turn: 0,
    log: ['Tu viaje comienza como Vagabundo...'],
    rewardCards: [], pendingEvolution: false,
    evolutionChoices: [], pickedRewards: [],
  };
  return startEncounter({ ...baseState, encounter: 1 });
}

// ─── Start encounter ──────────────────────────────────────
export function startEncounter(state: GameState): GameState {
  const lastEnemyId = state.enemy?.defId;
  const enemyDef = getEnemyForEncounter(state.encounter, lastEnemyId);
  const healAmount = Math.floor(state.player.maxHp * 0.15);

  const newState: GameState = {
    ...state,
    phase: 'battle',
    enemy: {
      defId: enemyDef.id,
      hp: enemyDef.maxHp, maxHp: enemyDef.maxHp,
      block: enemyDef.block,
      name: enemyDef.name, tier: enemyDef.tier,
      burn: 0, poison: 0, freeze: 0, weaken: 0,
    },
    turn: 0,
    player: {
      ...state.player,
      hp: Math.min(state.player.hp + healAmount, state.player.maxHp),
      nextAttackBuff: 0,
      dodgeCount: 0,
      attackBuffTurn: 0,
    },
    deck: [...state.deck, ...state.discard],
    discard: [],
    hand: [],
    log: [`--- Encuentro ${state.encounter}: ${enemyDef.name} ---`, ...state.log],
    pendingEvolution: false,
    evolutionChoices: [],
    rewardCards: [],
    pickedRewards: [],
  };
  return startTurn(newState);
}

// ─── Start turn ───────────────────────────────────────────
export function startTurn(state: GameState): GameState {
  const turn = state.turn + 1;
  const p = { ...state.player };
  const logEntries: string[] = [];

  // Reset energy
  p.energy = p.maxEnergy;

  // Reset attack buff for turn
  p.attackBuffTurn = 0;

  // Apply passive: extra energy
  const passive = getEvolutionNode(p.classPath).passive;
  if (passive.type === 'extra_energy') {
    p.energy += passive.value;
    logEntries.push(`Pasiva: +${passive.value} energía`);
  }

  // Apply passive: extra draw
  let drawCount = p.drawPerTurn;
  if (passive.type === 'extra_draw') {
    drawCount += passive.value;
    if (passive.value > 0) logEntries.push(`Pasiva: +${passive.value} robo`);
  }

  let s: GameState = { ...state, turn, player: p, log: [...logEntries, ...state.log] };
  s = drawCards(s, drawCount);
  return s;
}

// ─── Draw cards ───────────────────────────────────────────
export function drawCards(state: GameState, count: number): GameState {
  let s = { ...state };
  for (let i = 0; i < count; i++) {
    if (s.hand.length >= 8) break;
    if (s.deck.length === 0) {
      s = { ...s, deck: shuffle([...s.discard]), discard: [] };
      if (s.deck.length === 0) break;
    }
    const card = s.deck[0];
    s = { ...s, deck: s.deck.slice(1), hand: [...s.hand, card] };
  }
  return s;
}

// ─── Play a card ──────────────────────────────────────────
export function playCard(state: GameState, cardUid: string): GameState {
  const card = state.hand.find(c => c.uid === cardUid);
  if (!card) return state;
  const def = getCardDef(card.defId);
  if (state.player.energy < def.cost) {
    return { ...state, log: ['No tienes suficiente energía.', ...state.log] };
  }

  let newState: GameState = {
    ...state,
    player: { ...state.player, energy: state.player.energy - def.cost },
    hand: state.hand.filter(c => c.uid !== cardUid),
  };

  newState = applyCardEffect(newState, def);
  newState = { ...newState, discard: [...newState.discard, card] };
  return newState;
}

// ─── Apply card effects ───────────────────────────────────
function applyCardEffect(state: GameState, card: ReturnType<typeof getCardDef>): GameState {
  let s = { ...state };
  const p = { ...s.player };
  const e = s.enemy ? { ...s.enemy } : null;
  const logEntries: string[] = [];
  const passive = getEvolutionNode(p.classPath).passive;
  const passiveDamage = passive.type === 'bonus_damage' ? passive.value : 0;

  // ── Damage to single enemy ──
  if (card.damage && e && card.target === 'enemy') {
    let totalDmg = card.damage + p.strength + passiveDamage + p.nextAttackBuff + p.attackBuffTurn;

    // Execute check
    if (card.executeThreshold && card.executeDamage) {
      const hpPercent = (e.hp / e.maxHp) * 100;
      if (hpPercent < card.executeThreshold) {
        totalDmg = card.executeDamage + p.strength + passiveDamage + p.attackBuffTurn;
        logEntries.push(`¡EJECUCIÓN!`);
      }
    }

    // Consume next attack buff
    if (p.nextAttackBuff > 0) {
      p.nextAttackBuff = 0;
    }

    // Class weakness bonus
    const enemyDef = getEnemyDef(e.defId);
    if (enemyDef.classWeakness && getClassLineage(p.classPath).includes(enemyDef.classWeakness)) {
      totalDmg = Math.floor(totalDmg * 1.5);
    }

    // Apply damage considering block
    if (card.armorPierce) {
      e.hp -= totalDmg;
      logEntries.push(`${card.name}: ${totalDmg} daño (perfora)`);
    } else {
      const blocked = Math.min(e.block, totalDmg);
      const remaining = totalDmg - blocked;
      e.block -= blocked;
      if (remaining > 0) e.hp -= remaining;
      logEntries.push(`${card.name}: ${totalDmg} daño (${blocked} bloqueado, ${remaining} pasado)`);
    }

    // Passive: heal on damage
    if (passive.type === 'heal_on_damage' && totalDmg > 0) {
      p.hp = Math.min(p.hp + passive.value, p.maxHp);
    }
  }

  // ── AOE Damage ──
  if (card.aoeDamage && e) {
    let totalDmg = card.aoeDamage + Math.floor(p.strength * 0.5) + passiveDamage + p.attackBuffTurn;
    const enemyDef = getEnemyDef(e.defId);
    if (enemyDef.classWeakness && getClassLineage(p.classPath).includes(enemyDef.classWeakness)) {
      totalDmg = Math.floor(totalDmg * 1.5);
    }
    if (!card.armorPierce) {
      const blocked = Math.min(e.block, totalDmg);
      const remaining = totalDmg - blocked;
      e.block -= blocked;
      if (remaining > 0) e.hp -= remaining;
    } else {
      e.hp -= totalDmg;
    }
    logEntries.push(`${card.name}: ${totalDmg} daño AOE`);
    if (passive.type === 'heal_on_damage' && totalDmg > 0) {
      p.hp = Math.min(p.hp + passive.value, p.maxHp);
    }
  }

  // ── Heal ──
  if (card.heal) {
    p.hp = Math.min(p.hp + card.heal, p.maxHp);
    logEntries.push(`${card.name}: +${card.heal} HP`);
  }

  // ── Block ──
  if (card.block) {
    // We store block conceptually; enemy attacks reduce it
    logEntries.push(`${card.name}: +${card.block} protección`);
  }

  // ── Self damage ──
  if (card.selfDamage) {
    p.hp -= card.selfDamage;
    logEntries.push(`${card.name}: -${card.selfDamage} HP propio`);
  }

  // ── Energy gain ──
  if (card.energyGain) {
    p.energy += card.energyGain;
    logEntries.push(`${card.name}: +${card.energyGain} energía`);
  }

  // ── Strength buff ──
  if (card.strengthBuff) {
    p.strength += card.strengthBuff;
    logEntries.push(`${card.name}: +${card.strengthBuff} Fuerza`);
  }

  // ── Draw cards ──
  if (card.drawCards) {
    logEntries.push(`${card.name}: roba ${card.drawCards}`);
  }

  // ── Next attack buff ──
  if (card.nextAttackBuff && card.target === 'passive') {
    p.nextAttackBuff += card.nextAttackBuff;
    logEntries.push(`${card.name}: +${card.nextAttackBuff} próximo ataque`);
  }

  // ── Attack buff this turn ──
  if (card.attackBuffTurn) {
    p.attackBuffTurn += card.attackBuffTurn;
    logEntries.push(`${card.name}: +${card.attackBuffTurn} daño este turno`);
  }

  // ── Enemy debuffs ──
  if (e) {
    if (card.burn) {
      e.burn += card.burn;
      logEntries.push(`${card.name}: +${card.burn} quemadura`);
    }
    if (card.poison) {
      e.poison += card.poison;
      logEntries.push(`${card.name}: +${card.poison} veneno`);
    }
    if (card.freeze) {
      e.freeze += card.freeze;
      logEntries.push(`${card.name}: +${card.freeze} congelación`);
    }
    if (card.weaken) {
      e.weaken += card.weaken;
      logEntries.push(`${card.name}: -${card.weaken} daño enemigo`);
    }
  }

  s.player = p;
  s.enemy = e;
  s.log = [...logEntries, ...s.log];

  if (card.drawCards) {
    s = drawCards(s, card.drawCards);
  }
  return s;
}

function getClassLineage(classPath: string): string[] {
  const lineage: string[] = [classPath];
  let current = classPath;
  while (EVOLUTION_TREE[current]?.parent) {
    lineage.unshift(EVOLUTION_TREE[current].parent!);
    current = EVOLUTION_TREE[current].parent!;
  }
  return lineage;
}

// ─── End player turn ──────────────────────────────────────
export function endPlayerTurn(state: GameState): GameState {
  // Discard hand
  let s: GameState = { ...state, hand: [], discard: [...state.discard, ...state.hand] };

  // Apply end-of-turn passive
  const p = { ...s.player };
  const passive = getEvolutionNode(p.classPath).passive;
  const logEntries: string[] = [];

  if (passive.type === 'end_block') {
    logEntries.push(`Pasiva: +${passive.value} bloque`);
  }
  if (passive.type === 'end_heal') {
    p.hp = Math.min(p.hp + passive.value, p.maxHp);
    logEntries.push(`Pasiva: +${passive.value} HP`);
  }
  s.player = p;
  s.log = [...logEntries, ...s.log];

  // Enemy turn
  s = enemyAction(s);
  return s;
}

// ─── Enemy action ─────────────────────────────────────────
function enemyAction(state: GameState): GameState {
  if (!state.enemy) return state;
  const enemyDef = getEnemyDef(state.enemy.defId);
  const e = { ...state.enemy };
  const p = { ...state.player };
  const logEntries: string[] = [];

  // Apply burn
  if (e.burn > 0) {
    e.hp -= e.burn;
    logEntries.push(`Quemadura: ${e.burn} daño`);
    e.burn = Math.max(0, e.burn - 1);
  }

  // Apply poison
  if (e.poison > 0) {
    e.hp -= e.poison;
    logEntries.push(`Veneno: ${e.poison} daño`);
    e.poison = Math.max(0, e.poison - 1);
  }

  // Check if enemy died from DOTs
  if (e.hp <= 0) {
    return { ...state, enemy: e, log: [...logEntries, ...state.log] };
  }

  // Freeze: skip turn
  if (e.freeze > 0) {
    e.freeze--;
    logEntries.push(`${e.name} está congelado! No ataca.`);
    return { ...state, enemy: e, player: p, log: [...logEntries, ...state.log] };
  }

  // Enemy gains block every other turn
  if (state.turn % 2 === 0) {
    e.block = Math.min(e.block + enemyDef.block, 15);
  }

  // Enemy attacks
  let dmg = Math.max(0, enemyDef.damage - e.weaken);

  // Dodge check
  if (p.dodgeCount > 0) {
    p.dodgeCount--;
    logEntries.push(`${p.dodgeCount > 0 ? 'Esquivas' : 'Esquivas'} el ataque!`);
    return { ...state, enemy: e, player: p, log: [...logEntries, ...state.log] };
  }

  p.hp -= dmg;
  logEntries.push(`${e.name} ataca por ${dmg} daño`);

  return { ...state, enemy: e, player: p, log: [...logEntries, ...state.log] };
}

// ─── Check combat end ──────────────────────────────────────
export function checkCombatEnd(state: GameState): 'enemy_dead' | 'player_dead' | 'continue' {
  if (state.player.hp <= 0) return 'player_dead';
  if (state.enemy && state.enemy.hp <= 0) return 'enemy_dead';
  return 'continue';
}

// ─── Victory ──────────────────────────────────────────────
export function handleVictory(state: GameState): GameState {
  const xpGain = state.enemy?.tier === 'boss' ? 25 : state.enemy?.tier === 'hard' ? 18 : state.enemy?.tier === 'medium' ? 12 : 8;
  const newXp = state.player.xp + xpGain;

  // Check if evolution is available
  const choiceNodes = getEvolutionChoices(state.player.evolutionTier, state.player.classPath);
  const choiceIds: ClassPath[] = choiceNodes.map(n => n.id);

  // Generate reward cards
  const ownedDefIds = new Set(state.deck.map(c => c.defId));
  const rewardPool = getRewardPool(state.player.classPath, ownedDefIds);
  const rewardCards = generateRewardCards(rewardPool, 3);

  return {
    ...state,
    phase: choiceIds.length > 0 && newXp >= getNextXpThreshold(state.player.evolutionTier) ? 'evolution_choice' : 'reward',
    player: { ...state.player, xp: newXp },
    rewardCards,
    evolutionChoices: choiceIds,
    pendingEvolution: choiceIds.length > 0 && newXp >= getNextXpThreshold(state.player.evolutionTier),
    log: [`¡Victoria! +${xpGain} XP`, ...state.log],
  };
}

function getNextXpThreshold(tier: number): number {
  return [15, 40, 80][tier] ?? 999;
}

// ─── Choose evolution ─────────────────────────────────────
export function chooseEvolution(state: GameState, classPath: ClassPath): GameState {
  const node = getEvolutionNode(classPath);

  // Transform cards in deck
  let newDeck = state.deck.map(card => {
    const newDefId = transformCard(card.defId, classPath);
    if (newDefId) {
      return { ...card, defId: newDefId };
    }
    return card;
  });

  // Add unlocked class cards (1 copy each)
  const newCards: CardInstance[] = node.unlockCardIds.map(defId => ({
    uid: uid(), defId,
  }));
  newDeck = [...newDeck, ...newCards];

  const evolvedState: GameState = {
    ...state,
    phase: 'battle',
    player: {
      ...state.player,
      evolutionTier: node.tier,
      classPath: classPath,
      maxHp: node.maxHp,
      hp: Math.min(state.player.hp + 15, node.maxHp),
      maxEnergy: node.maxEnergy,
      energy: node.maxEnergy,
      drawPerTurn: node.drawPerTurn,
      strength: state.player.strength + node.bonusStrength,
    },
    deck: newDeck,
    log: [`¡Evolucionaste a ${node.name}!`, ...state.log],
    pendingEvolution: false,
    evolutionChoices: [],
  };

  // Start next encounter immediately after evolution
  return startEncounter({ ...evolvedState, encounter: state.encounter + 1 });
}

// ─── Reward card management ───────────────────────────────
export function addRewardCard(state: GameState, cardUid: string): GameState {
  const card = state.rewardCards.find(c => c.uid === cardUid);
  if (!card) return state;
  return {
    ...state,
    deck: [...state.deck, card],
    rewardCards: state.rewardCards.filter(c => c.uid !== cardUid),
    log: [`Añadida ${getCardDef(card.defId).name} al mazo`, ...state.log],
  };
}

export function confirmRewards(state: GameState): GameState {
  let newState: GameState = { ...state, pickedRewards: [] };
  return startNextEncounter(newState);
}

export function skipRewards(state: GameState): GameState {
  return startNextEncounter({ ...state, pickedRewards: [] });
}

function startNextEncounter(state: GameState): GameState {
  return startEncounter({ ...state, encounter: state.encounter + 1 });
}

// ─── Generate reward cards ───────────────────────────────
function generateRewardCards(pool: CardDef[], count: number): CardInstance[] {
  if (pool.length === 0) return [];
  const shuffled = shuffle([...pool]);
  return shuffled.slice(0, count).map(def => ({ uid: uid(), defId: def.id }));
}

// ─── Shuffle ──────────────────────────────────────────────
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ─── Final victory check ───────────────────────────────────
export function checkFinalVictory(state: GameState): boolean {
  return state.encounter >= 10;
}
