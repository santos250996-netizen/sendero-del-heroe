import {
  type GameState, type CardInstance, type ClassPath, type MapNode, type NodeType,
  type GameEvent, type EventOption, type ShopItem, type RestChoice,
} from './types';
import { getCardDef, getEffectiveCardDef, transformCard, getRewardPool, ALL_CARDS, getRandomClassCard } from './data/cards';
import { getEvolutionNode, getEvolutionChoices, EVOLUTION_TREE } from './data/evolutions';
import { getEnemyForEncounter, getEnemyDef } from './data/enemies';
import {
  generateMap, visitNode, getAvailableNodes, isMapComplete,
  getRandomEvent, getCombatGoldReward, getTreasureReward, generateShopItems,
} from './data/map';

// ─── UID Generator ────────────────────────────────────────
let uidCounter = 0;
function uid(): string {
  return 'c' + (++uidCounter) + '_' + Date.now().toString(36);
}

// ─── Create new game ─────────────────────────────────────
export function createNewGame(): GameState {
  const evo = getEvolutionNode('vagabundo');
  const starterCards: CardInstance[] = [];
  for (let i = 0; i < 3; i++) {
    evo.unlockCardIds.forEach(defId => {
      starterCards.push({ uid: uid(), defId, upgraded: false });
    });
  }
  const map = generateMap();
  const baseState: GameState = {
    phase: 'map',
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
      gold: 30, // start with some gold
    },
    deck: starterCards, hand: [], discard: [],
    enemy: null,
    encounter: 0, turn: 0,
    log: ['Tu viaje comienza como Vagabundo...'],
    rewardCards: [], pendingEvolution: false,
    evolutionChoices: [], pickedRewards: [],
    map,
    currentNodeId: null,
    restChoice: null,
    removingCard: false,
    upgradingCard: false,
    currentEvent: null,
    eventOutcome: null,
    shopItems: [],
    nextEncounterDamageBonus: 0,
  };
  return baseState;
}

// ─── Select a map node ───────────────────────────────────
export function selectMapNode(state: GameState, nodeId: string): GameState {
  const node = state.map?.nodes.find(n => n.id === nodeId);
  if (!node || !node.available || node.visited) return state;

  const newMap = visitNode(state.map!, nodeId);

  return {
    ...state,
    map: newMap,
    currentNodeId: nodeId,
  };
}

// ─── Enter a node (after selecting it on the map) ─────────
export function enterNode(state: GameState): GameState {
  const node = state.map?.nodes.find(n => n.id === state.currentNodeId);
  if (!node) return state;

  switch (node.type) {
    case 'combat':
    case 'elite':
    case 'boss':
      return enterCombat(state, node);

    case 'rest':
      return { ...state, phase: 'rest', restChoice: null, removingCard: false, upgradingCard: false };

    case 'shop':
      return enterShop(state);

    case 'event':
      return enterEvent(state);

    case 'treasure':
      return resolveTreasure(state);

    case 'evolution':
      // Not used in current flow (evolution is handled via XP thresholds)
      return enterCombat(state, node);

    default:
      return { ...state, phase: 'map', currentNodeId: null };
  }
}

// ─── Enter Combat ────────────────────────────────────────
function enterCombat(state: GameState, node: MapNode): GameState {
  const lastEnemyId = state.enemy?.defId;
  const enemyDef = getEnemyForEncounter(node.encounterDifficulty, lastEnemyId);
  const healAmount = Math.floor(state.player.maxHp * 0.10); // 10% heal between combats (less than before since we have rest)

  const encounter = state.encounter + 1;

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
    encounter,
    turn: 0,
    player: {
      ...state.player,
      hp: Math.min(state.player.hp + healAmount, state.player.maxHp),
      nextAttackBuff: 0,
      dodgeCount: 0,
      attackBuffTurn: 0,
    },
    deck: [...state.deck, ...state.discard, ...state.hand],
    discard: [],
    hand: [],
    log: [`--- Encuentro ${encounter}: ${enemyDef.name} ---`, ...state.log],
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

  p.energy = p.maxEnergy;
  p.attackBuffTurn = 0;

  const passive = getEvolutionNode(p.classPath).passive;
  if (passive.type === 'extra_energy') {
    p.energy += passive.value;
    logEntries.push(`Pasiva: +${passive.value} energía`);
  }

  let drawCount = p.drawPerTurn;
  if (passive.type === 'extra_draw') {
    drawCount += passive.value;
    if (passive.value > 0) logEntries.push(`Pasiva: +${passive.value} robo`);
  }

  // Deck size penalty: if deck > 15 cards, draw 1 less
  if (state.deck.length > 15) {
    drawCount = Math.max(1, drawCount - 1);
    logEntries.push('Mazo pesado: -1 robo');
  }

  // Handle vacuum curse: if player draws a vacuum card, they lose 1 energy
  let s: GameState = { ...state, turn, player: p, log: [...logEntries, ...state.log] };
  s = drawCards(s, drawCount);

  // Check for vacuum curse in hand
  for (const card of s.hand) {
    if (card.defId === 'vacuidad') {
      s.player.energy = Math.max(0, s.player.energy - 1);
      s.log = [`Vacuidad: -1 energía`, ...s.log];
    }
  }

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
  const effectiveDef = getEffectiveCardDef(card);
  if (state.player.energy < effectiveDef.cost) {
    return { ...state, log: ['No tienes suficiente energía.', ...state.log] };
  }

  let newState: GameState = {
    ...state,
    player: { ...state.player, energy: state.player.energy - effectiveDef.cost },
    hand: state.hand.filter(c => c.uid !== cardUid),
  };

  newState = applyCardEffect(newState, effectiveDef);
  newState = { ...newState, discard: [...newState.discard, card] };
  return newState;
}

// ─── Apply card effects ───────────────────────────────────
function applyCardEffect(state: GameState, card: ReturnType<typeof getEffectiveCardDef>): GameState {
  let s = { ...state };
  const p = { ...s.player };
  const e = s.enemy ? { ...s.enemy } : null;
  const logEntries: string[] = [];
  const passive = getEvolutionNode(p.classPath).passive;
  const passiveDamage = passive.type === 'bonus_damage' ? passive.value : 0;

  // ── Damage to single enemy ──
  if (card.damage && e && card.target === 'enemy') {
    let totalDmg = card.damage + p.strength + passiveDamage + p.nextAttackBuff + p.attackBuffTurn;

    if (card.executeThreshold && card.executeDamage) {
      const hpPercent = (e.hp / e.maxHp) * 100;
      if (hpPercent < card.executeThreshold) {
        totalDmg = card.executeDamage + p.strength + passiveDamage + p.attackBuffTurn;
        logEntries.push(`¡EJECUCIÓN!`);
      }
    }

    if (p.nextAttackBuff > 0) {
      p.nextAttackBuff = 0;
    }

    const enemyDef = getEnemyDef(e.defId);
    if (enemyDef.classWeakness && getClassLineage(p.classPath).includes(enemyDef.classWeakness)) {
      totalDmg = Math.floor(totalDmg * 1.5);
    }

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
    logEntries.push(`${card.name}: +${card.block} protección`);
  }

  // ── Self damage ──
  if (card.selfDamage) {
    p.hp -= card.selfDamage;
    logEntries.push(`${card.name}: -${card.selfDamage} HP propio`);
  }

  // ── Energy gain (can be negative for curse) ──
  if (card.energyGain) {
    p.energy = Math.max(0, p.energy + card.energyGain);
    logEntries.push(`${card.name}: ${card.energyGain > 0 ? '+' : ''}${card.energyGain} energía`);
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
    if (card.burn) { e.burn += card.burn; logEntries.push(`${card.name}: +${card.burn} quemadura`); }
    if (card.poison) { e.poison += card.poison; logEntries.push(`${card.name}: +${card.poison} veneno`); }
    if (card.freeze) { e.freeze += card.freeze; logEntries.push(`${card.name}: +${card.freeze} congelación`); }
    if (card.weaken) { e.weaken += card.weaken; logEntries.push(`${card.name}: -${card.weaken} daño enemigo`); }
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
  let s: GameState = { ...state, hand: [], discard: [...state.discard, ...state.hand] };

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

  if (e.burn > 0) { e.hp -= e.burn; logEntries.push(`Quemadura: ${e.burn} daño`); e.burn = Math.max(0, e.burn - 1); }
  if (e.poison > 0) { e.hp -= e.poison; logEntries.push(`Veneno: ${e.poison} daño`); e.poison = Math.max(0, e.poison - 1); }

  if (e.hp <= 0) {
    return { ...state, enemy: e, log: [...logEntries, ...state.log] };
  }

  if (e.freeze > 0) {
    e.freeze--;
    logEntries.push(`${e.name} está congelado! No ataca.`);
    return { ...state, enemy: e, player: p, log: [...logEntries, ...state.log] };
  }

  if (state.turn % 2 === 0) {
    e.block = Math.min(e.block + enemyDef.block, 15);
  }

  let dmg = Math.max(0, enemyDef.damage - e.weaken);

  // Apply next encounter damage bonus (from events)
  if (state.nextEncounterDamageBonus > 0) {
    dmg += state.nextEncounterDamageBonus;
    logEntries.push(`¡Maldición del altar: +${state.nextEncounterDamageBonus} daño!`);
  }

  if (p.dodgeCount > 0) {
    p.dodgeCount--;
    logEntries.push(`Esquivas el ataque!`);
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
  const node = state.map?.nodes.find(n => n.id === state.currentNodeId);
  const nodeType = node?.type || 'combat';

  const xpGain = state.enemy?.tier === 'boss' ? 25 : state.enemy?.tier === 'hard' ? 18 : state.enemy?.tier === 'medium' ? 12 : 8;
  const newXp = state.player.xp + xpGain;

  // Gold reward
  const goldReward = getCombatGoldReward(nodeType);

  // Check if evolution is available
  const choiceNodes = getEvolutionChoices(state.player.evolutionTier, state.player.classPath);
  const choiceIds: ClassPath[] = choiceNodes.map(n => n.id);

  // Generate reward cards
  const rewardPool = getRewardPool(state.player.classPath, state.deck);
  const rewardCards = generateRewardCards(rewardPool, 3);

  // Reset next encounter damage bonus
  const shouldEvolve = choiceIds.length > 0 && newXp >= getNextXpThreshold(state.player.evolutionTier);

  return {
    ...state,
    phase: shouldEvolve ? 'evolution_choice' : 'reward',
    player: { ...state.player, xp: newXp, gold: state.player.gold + goldReward },
    rewardCards,
    evolutionChoices: choiceIds,
    pendingEvolution: shouldEvolve,
    nextEncounterDamageBonus: 0, // reset after combat
    log: [`¡Victoria! +${xpGain} XP, +${goldReward} oro`, ...state.log],
  };
}

function getNextXpThreshold(tier: number): number {
  return [15, 40, 80][tier] ?? 999;
}

// ─── Choose evolution ─────────────────────────────────────
export function chooseEvolution(state: GameState, classPath: ClassPath): GameState {
  const node = getEvolutionNode(classPath);

  let newDeck = state.deck.map(card => {
    const newDefId = transformCard(card.defId, classPath);
    if (newDefId) {
      // Starter cards get FREE upgrade on evolution
      return { ...card, defId: newDefId, upgraded: true };
    }
    return card;
  });

  const newCards: CardInstance[] = node.unlockCardIds.map(defId => ({
    uid: uid(), defId, upgraded: false,
  }));
  newDeck = [...newDeck, ...newCards];

  const evolvedState: GameState = {
    ...state,
    phase: 'map',
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
    currentNodeId: null,
  };

  return evolvedState;
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
  return returnToMap({ ...state, pickedRewards: [] });
}

export function skipRewards(state: GameState): GameState {
  return returnToMap({ ...state, pickedRewards: [] });
}

// ─── Return to map ────────────────────────────────────────
export function returnToMap(state: GameState): GameState {
  const bossDefeated = state.map?.nodes.find(n => n.type === 'boss')?.visited;

  if (bossDefeated) {
    return { ...state, phase: 'victory', currentNodeId: null };
  }

  return { ...state, phase: 'map', currentNodeId: null };
}

// ─── REST ────────────────────────────────────────────────

export function chooseRest(state: GameState, choice: RestChoice): GameState {
  switch (choice) {
    case 'heal':
      return applyRestHeal(state);
    case 'remove':
      return { ...state, removingCard: true };
    case 'upgrade':
      return { ...state, upgradingCard: true };
    default:
      return state;
  }
}

function applyRestHeal(state: GameState): GameState {
  const healAmount = Math.floor(state.player.maxHp * 0.30); // 30% max HP
  return {
    ...state,
    player: {
      ...state.player,
      hp: Math.min(state.player.hp + healAmount, state.player.maxHp),
    },
    log: [`Descanso: +${healAmount} HP`, ...state.log],
    phase: 'map',
    currentNodeId: null,
  };
}

export function removeCardFromDeck(state: GameState, cardUid: string): GameState {
  const card = state.deck.find(c => c.uid === cardUid);
  if (!card) return state;
  // Minimum deck size: 3 cards
  if (state.deck.length <= 3) {
    return {
      ...state,
      log: ['Mínimo 3 cartas en el mazo', ...state.log],
    };
  }
  const def = getCardDef(card.defId);
  const nextPhase = (state.phase === 'event_result' || state.phase === 'shop') ? state.phase : 'map';
  return {
    ...state,
    deck: state.deck.filter(c => c.uid !== cardUid),
    removingCard: false,
    log: [`Eliminada ${def.name} del mazo`, ...state.log],
    phase: nextPhase,
    currentNodeId: nextPhase === 'map' ? null : state.currentNodeId,
  };
}

export function cancelRestAction(state: GameState): GameState {
  return { ...state, removingCard: false, upgradingCard: false, restChoice: null };
}

// ─── CARD UPGRADE ─────────────────────────────────────────

export function upgradeCardInDeck(state: GameState, cardUid: string): GameState {
  const card = state.deck.find(c => c.uid === cardUid);
  if (!card || card.upgraded) return state;
  const def = getCardDef(card.defId);
  if (!def.upgradeBonus) return state;

  const nextPhase = (state.phase === 'event_result' || state.phase === 'shop') ? state.phase : 'map';
  return {
    ...state,
    deck: state.deck.map(c => c.uid === cardUid ? { ...c, upgraded: true } : c),
    upgradingCard: false,
    log: [`¡${def.name} mejorada!`, ...state.log],
    phase: nextPhase,
    currentNodeId: nextPhase === 'map' ? null : state.currentNodeId,
  };
}

// ─── SHOP ─────────────────────────────────────────────────

function enterShop(state: GameState): GameState {
  // Generate shop cards based on player's class (respects max 2 copies)
  const shopCards: ShopItem[] = [];
  const shopCardIds = new Set<string>();
  for (let i = 0; i < 3; i++) {
    const card = getRandomClassCard(state.player.classPath, state.deck);
    if (card && !shopCardIds.has(card.id)) {
      const cost = card.rarity === 'rare' ? 100 : card.rarity === 'common' ? 60 : 80;
      shopCards.push({
        id: `shop_card_${i}`,
        type: 'card',
        cardDefId: card.id,
        cost,
        sold: false,
      });
      shopCardIds.add(card.id);
    }
  }

  const allItems: ShopItem[] = [
    ...shopCards,
    { id: 'shop_remove', type: 'remove', cost: 75, sold: false },
    { id: 'shop_upgrade', type: 'upgrade', cost: 60, sold: false },
  ];

  return {
    ...state,
    phase: 'shop',
    shopItems: allItems,
  };
}

export function buyShopItem(state: GameState, itemId: string): GameState {
  const item = state.shopItems.find(i => i.id === itemId);
  if (!item || item.sold || state.player.gold < item.cost) return state;

  const newState = {
    ...state,
    player: { ...state.player, gold: state.player.gold - item.cost },
    shopItems: state.shopItems.map(i => i.id === itemId ? { ...i, sold: true } : i),
  };

  switch (item.type) {
    case 'card': {
      if (!item.cardDefId) return state;
      const newCard: CardInstance = { uid: uid(), defId: item.cardDefId, upgraded: false };
      return {
        ...newState,
        deck: [...newState.deck, newCard],
        log: [`Compraste ${getCardDef(item.cardDefId).name} (-${item.cost}g)`, ...newState.log],
      };
    }
    case 'remove':
      return {
        ...newState,
        removingCard: true,
        log: [`Pago por eliminar carta (-${item.cost}g). Selecciona una carta.`, ...newState.log],
      };
    case 'upgrade':
      return {
        ...newState,
        upgradingCard: true,
        log: [`Pago por mejorar carta (-${item.cost}g). Selecciona una carta.`, ...newState.log],
      };
    default:
      return newState;
  }
}

export function leaveShop(state: GameState): GameState {
  return returnToMap({ ...state, shopItems: [], removingCard: false, upgradingCard: false });
}

// ─── EVENTS ──────────────────────────────────────────────

function enterEvent(state: GameState): GameState {
  const event = getRandomEvent(() => Math.random());
  return {
    ...state,
    phase: 'event',
    currentEvent: event,
    eventOutcome: null,
  };
}

export function chooseEventOption(state: GameState, optionId: string): GameState {
  const option = state.currentEvent?.options.find(o => o.id === optionId);
  if (!option) return state;

  const p = { ...state.player };
  const logEntries: string[] = [];

  // Apply option effects
  if (option.goldChange) {
    p.gold = Math.max(0, p.gold + option.goldChange);
    logEntries.push(`Oro: ${option.goldChange > 0 ? '+' : ''}${option.goldChange}`);
  }
  if (option.hpChange) {
    p.hp = Math.min(Math.max(1, p.hp + option.hpChange), p.maxHp);
    logEntries.push(`HP: ${option.hpChange > 0 ? '+' : ''}${option.hpChange}`);
  }
  if (option.maxHpChange) {
    p.maxHp = Math.max(10, p.maxHp + option.maxHpChange);
    if (option.maxHpChange < 0) {
      p.hp = Math.min(p.hp, p.maxHp);
    }
    logEntries.push(`HP máximo: ${option.maxHpChange > 0 ? '+' : ''}${option.maxHpChange}`);
  }
  if (option.nextEncounterDamageBonus) {
    logEntries.push(`Próximo combate: ${option.nextEncounterDamageBonus > 0 ? '+' : ''}${option.nextEncounterDamageBonus} daño`);
  }

  let newDeck = [...state.deck];

  // Add card reward
  if (option.cardReward) {
    const newCard: CardInstance = { uid: uid(), defId: option.cardReward, upgraded: false };
    newDeck = [...newDeck, newCard];
    try {
      logEntries.push(`Obtuviste: ${getCardDef(option.cardReward).name}`);
    } catch {
      logEntries.push(`Obtuviste una carta misteriosa`);
    }
  }

  // Add curse card
  if (option.curseCard) {
    const curseCard: CardInstance = { uid: uid(), defId: option.curseCard, upgraded: false };
    newDeck = [...newDeck, curseCard];
    try {
      logEntries.push(`Maldición: ${getCardDef(option.curseCard).name} añadida al mazo`);
    } catch {
      logEntries.push(`¡Maldición añadida al mazo!`);
    }
  }

  // If option allows removing a card, go to remove mode
  // But check if deck only has curses — can't remove those at events
  if (option.canRemoveCard) {
    const hasNonCurse = newDeck.some(c => getCardDef(c.defId).rarity !== 'curse');
    if (!hasNonCurse) {
      // Only curses in deck, can't remove at event — go straight to continue
      return {
        ...state,
        phase: 'event_result',
        player: p,
        deck: newDeck,
        eventOutcome: option,
        log: [...logEntries, 'Solo quedan maldiciones — ve a descanso para eliminarlas', ...state.log],
      };
    }
    return {
      ...state,
      phase: 'event_result',
      player: p,
      deck: newDeck,
      eventOutcome: option,
      log: [...logEntries, ...state.log],
    };
  }

  if (option.canUpgradeCard) {
    return {
      ...state,
      phase: 'event_result',
      player: p,
      deck: newDeck,
      eventOutcome: option,
      upgradingCard: true,
      log: [...logEntries, ...state.log],
    };
  }

  return {
    ...state,
    phase: 'event_result',
    player: p,
    deck: newDeck,
    eventOutcome: option,
    nextEncounterDamageBonus: state.nextEncounterDamageBonus + (option.nextEncounterDamageBonus || 0),
    log: [...logEntries, ...state.log],
  };
}

export function finishEvent(state: GameState): GameState {
  return returnToMap({
    ...state,
    currentEvent: null,
    eventOutcome: null,
    removingCard: false,
    upgradingCard: false,
  });
}

// ─── TREASURE ────────────────────────────────────────────

function resolveTreasure(state: GameState): GameState {
  const { gold, hp } = getTreasureReward();
  const p = { ...state.player };
  const logEntries: string[] = [];

  p.gold += gold;
  logEntries.push(`Tesoro: +${gold} oro`);

  if (hp) {
    p.hp = Math.min(p.hp + hp, p.maxHp);
    logEntries.push(`Tesoro: +${hp} HP`);
  }

  return {
    ...state,
    phase: 'event_result',
    player: p,
    eventOutcome: {
      id: 'treasure',
      text: 'Tesoro encontrado',
      narrative: `Encontrás un cofre escondido entre las rocas. Dentro hay ${gold} monedas de oro${hp ? ` y una poción que cura ${hp} HP` : ''}.`,
    },
    log: [...logEntries, ...state.log],
  };
}

// ─── Generate reward cards ───────────────────────────────
function generateRewardCards(pool: CardDef[], count: number): CardInstance[] {
  if (pool.length === 0) return [];
  const shuffled = shuffle([...pool]);
  return shuffled.slice(0, count).map(def => ({ uid: uid(), defId: def.id, upgraded: false }));
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
  return isMapComplete(state.map!);
}

// ─── Map state helpers ─────────────────────────────────────
export function getMapState(state: GameState) {
  return {
    nodes: state.map?.nodes || [],
    currentLayer: state.map?.currentLayer || 0,
    currentNodeId: state.currentNodeId,
    maxLayer: state.map?.maxLayer || 9,
    visitedNodeIds: state.map?.visitedNodeIds || new Set(),
  };
}
