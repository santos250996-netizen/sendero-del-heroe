import { type GameState, type CardInstance, type CardDef, type EnemyState, type PlayerState } from './types';
import { getCardDef, getEvolution, getNextEvolution, getAvailableCards } from './data/cards';
import { getEnemyForEncounter, getEnemyDef } from './data/enemies';
import { EVOLUTIONS } from './data/cards';

// ─── UID Generator ────────────────────────────────────────
let uidCounter = 0;
function uid(): string {
  return 'c' + (++uidCounter) + '_' + Date.now().toString(36);
}

// ─── Create new game ─────────────────────────────────────
export function createNewGame(): GameState {
  const evo = getEvolution(0);
  const starterCards: CardInstance[] = evo.unlockCards.map(defId => ({
    uid: uid(),
    defId,
  }));

  // Add 2 extra copies of starter cards
  for (let i = 0; i < 2; i++) {
    evo.unlockCards.forEach(defId => {
      starterCards.push({ uid: uid(), defId });
    });
  }

  const baseState: GameState = {
    phase: 'battle',
    player: {
      hp: evo.maxHp,
      maxHp: evo.maxHp,
      energy: evo.maxEnergy,
      maxEnergy: evo.maxEnergy,
      drawPerTurn: evo.drawPerTurn,
      strength: 0,
      xp: 0,
      evolutionTier: 0,
      nextAttackBuff: 0,
    },
    deck: starterCards,
    hand: [],
    discard: [],
    enemy: null,
    encounter: 0,
    turn: 0,
    log: ['Tu viaje comienza como Vagabundo...'],
    rewardCards: [],
    pendingEvolution: false,
  };

  // Start first encounter immediately
  return startEncounter({ ...baseState, encounter: 1 });
}

// ─── Start encounter ──────────────────────────────────────
export function startEncounter(state: GameState): GameState {
  const lastEnemyId = state.enemy?.defId;
  const enemyDef = getEnemyForEncounter(state.encounter, lastEnemyId);

  const enemy: EnemyState = {
    defId: enemyDef.id,
    hp: enemyDef.maxHp,
    maxHp: enemyDef.maxHp,
    block: enemyDef.block,
    name: enemyDef.name,
    tier: enemyDef.tier,
  };

  // Heal 15% of max hp between encounters
  const healAmount = Math.floor(state.player.maxHp * 0.15);

  const newState: GameState = {
    ...state,
    phase: 'battle',
    enemy,
    turn: 0,
    player: {
      ...state.player,
      hp: Math.min(state.player.hp + healAmount, state.player.maxHp),
      nextAttackBuff: 0,
    },
    deck: [...state.deck, ...state.discard],
    discard: [],
    hand: [],
    log: [`--- Encuentro ${state.encounter}: ${enemy.name} ---`, ...state.log],
  };

  return startTurn(newState);
}

// ─── Start turn ───────────────────────────────────────────
export function startTurn(state: GameState): GameState {
  const turn = state.turn + 1;

  // Reset energy
  const newState: GameState = {
    ...state,
    turn,
    player: {
      ...state.player,
      energy: state.player.maxEnergy,
    },
    hand: [],
  };

  // Draw cards
  return drawCards(newState, newState.player.drawPerTurn);
}

// ─── Draw cards ───────────────────────────────────────────
export function drawCards(state: GameState, count: number): GameState {
  let s = { ...state };
  for (let i = 0; i < count; i++) {
    if (s.hand.length >= 7) break; // max hand size
    if (s.deck.length === 0) {
      // Shuffle discard into deck
      s = { ...s, deck: shuffle([...s.discard]), discard: [] };
      if (s.deck.length === 0) break;
    }
    const card = s.deck[0];
    s = {
      ...s,
      deck: s.deck.slice(1),
      hand: [...s.hand, card],
    };
  }
  return s;
}

// ─── Play a card ──────────────────────────────────────────
export function playCard(state: GameState, cardUid: string): GameState {
  const card = state.hand.find(c => c.uid === cardUid);
  if (!card) return state;

  const def = getCardDef(card.defId);

  // Check energy
  if (state.player.energy < def.cost) {
    return { ...state, log: ['No tienes suficiente energía.', ...state.log] };
  }

  let newState: GameState = {
    ...state,
    player: {
      ...state.player,
      energy: state.player.energy - def.cost,
    },
    hand: state.hand.filter(c => c.uid !== cardUid),
  };

  // Apply card effects
  newState = applyCardEffect(newState, def);

  // Move card to discard
  newState = {
    ...newState,
    discard: [...newState.discard, card],
  };

  return newState;
}

function applyCardEffect(state: GameState, card: CardDef): GameState {
  let s = { ...state };
  const p = { ...s.player };
  let e = s.enemy ? { ...s.enemy } : null;
  const logEntries: string[] = [];

  // Damage
  if (card.damage) {
    let totalDamage = card.damage + p.strength;

    // Apply next attack buff
    if (p.nextAttackBuff > 0 && (card.target === 'enemy')) {
      totalDamage += p.nextAttackBuff;
      p.nextAttackBuff = 0;
      logEntries.push(`Bandera: +${card.nextAttackBuff || ''} daño`);
    }

    // Force salvaje scaling
    if (card.damageMultiplier && card.hpThreshold && card.target === 'enemy') {
      const hpMissing = p.maxHp - p.hp;
      const missingPercent = hpMissing / p.maxHp;
      totalDamage += Math.floor(card.damage * card.damageMultiplier * missingPercent);
    }

    // Golpe de leyenda: multiply strength by 3
    if (card.id === 'golpe_leyenda') {
      totalDamage = card.damage + (p.strength * 3);
    }

    if (e && card.target === 'enemy') {
      if (card.armorPierce) {
        e.hp -= totalDamage;
        logEntries.push(`${card.name}: ${totalDamage} daño (ignora bloque)`);
      } else {
        let remaining = totalDamage - e.block;
        if (remaining > 0) {
          e.hp -= remaining;
          e.block = 0;
          logEntries.push(`${card.name}: ${totalDamage} daño (${e.block || 0} bloqueado, ${remaining} recibido)`);
        } else {
          e.block -= totalDamage;
          logEntries.push(`${card.name}: ${totalDamage} daño (todo bloqueado)`);
        }
      }
    }
  }

  // AOE damage
  if (card.aoeDamage && e) {
    const aoe = card.aoeDamage + Math.floor(p.strength * 0.5);
    if (card.armorPierce) {
      e.hp -= aoe;
    } else {
      let remaining = aoe - e.block;
      if (remaining > 0) {
        e.hp -= remaining;
        e.block = 0;
      } else {
        e.block -= aoe;
      }
    }
    logEntries.push(`${card.name}: ${aoe} daño a todos los enemigos`);
  }

  // Heal
  if (card.heal) {
    p.hp = Math.min(p.hp + card.heal, p.maxHp);
    logEntries.push(`${card.name}: +${card.heal} HP`);
  }

  // Block
  if (card.block) {
    p.nextAttackBuff = p.nextAttackBuff; // keep buff
    logEntries.push(`${card.name}: +${card.block} bloque`);
    // We'll track player block via nextAttackBuff name but actually store separately
  }

  // Strength buff
  if (card.strengthBuff) {
    p.strength += card.strengthBuff;
    logEntries.push(`${card.name}: +${card.strengthBuff} Fuerza`);
  }

  // Draw cards
  if (card.drawCards) {
    // Will draw after returning
    logEntries.push(`${card.name}: roba ${card.drawCards} cartas`);
  }

  // Next attack buff
  if (card.nextAttackBuff && card.target === 'passive') {
    p.nextAttackBuff += card.nextAttackBuff;
    logEntries.push(`${card.name}: +${card.nextAttackBuff} al próximo ataque`);
  }

  s.player = p;
  s.enemy = e;
  s.log = [...logEntries, ...s.log];

  // Draw cards after effects
  if (card.drawCards) {
    s = drawCards(s, card.drawCards);
  }

  return s;
}

// ─── End player turn ──────────────────────────────────────
export function endPlayerTurn(state: GameState): GameState {
  if (!state.enemy) return state;

  // Discard hand
  const newState: GameState = {
    ...state,
    hand: [],
    discard: [...state.discard, ...state.hand],
  };

  // Enemy turn
  return enemyAction(newState);
}

// ─── Enemy action ─────────────────────────────────────────
function enemyAction(state: GameState): GameState {
  if (!state.enemy) return state;

  const enemyDef = getEnemyDef(state.enemy.defId);
  const e = { ...state.enemy };

  // Enemy gains some block sometimes
  if (state.turn % 2 === 0) {
    e.block = Math.min(e.block + enemyDef.block, 15);
  }

  // Enemy attacks
  const damage = enemyDef.damage;
  let actualDamage = damage;

  // Apply damage to player
  const p = { ...state.player };
  p.hp -= actualDamage;
  const logEntry = `${e.name} ataca por ${actualDamage} daño`;

  return {
    ...state,
    player: p,
    enemy: e,
    log: [logEntry, ...state.log],
  };
}

// ─── Check combat end ─────────────────────────────────────
export function checkCombatEnd(state: GameState): 'enemy_dead' | 'player_dead' | 'continue' {
  if (state.player.hp <= 0) return 'player_dead';
  if (state.enemy && state.enemy.hp <= 0) return 'enemy_dead';
  return 'continue';
}

// ─── Victory - go to reward ──────────────────────────────
export function handleVictory(state: GameState): GameState {
  const evo = getEvolution(state.player.evolutionTier);
  const xpGain = state.enemy?.tier === 'boss' ? 25 : state.enemy?.tier === 'hard' ? 18 : state.enemy?.tier === 'medium' ? 12 : 8;

  const newXp = state.player.xp + xpGain;
  const nextEvo = getNextEvolution(state.player.evolutionTier);
  const canEvolve = nextEvo ? newXp >= nextEvo.requiredXp : false;

  // Generate reward cards
  const available = getAvailableCards(state.player.evolutionTier);
  const rewardCards = generateRewardCards(available, 3);

  return {
    ...state,
    phase: 'reward',
    player: {
      ...state.player,
      xp: newXp,
    },
    rewardCards,
    log: [`¡Victoria! +${xpGain} XP`, ...state.log],
    pendingEvolution: canEvolve,
  };
}

// ─── Add reward card to deck ──────────────────────────────
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

// ─── Skip rewards ────────────────────────────────────────
export function skipRewards(state: GameState): GameState {
  if (state.pendingEvolution) {
    return evolvePlayer({ ...state, phase: 'evolution' });
  }
  return nextEncounter({ ...state, phase: 'battle' });
}

// ─── After reward, proceed ────────────────────────────────
export function proceedAfterReward(state: GameState): GameState {
  if (state.pendingEvolution) {
    return evolvePlayer({ ...state, phase: 'evolution' });
  }
  return nextEncounter({ ...state, phase: 'battle' });
}

// ─── Evolve player ───────────────────────────────────────
export function evolvePlayer(state: GameState): GameState {
  const currentTier = state.player.evolutionTier;
  const nextEvo = getNextEvolution(currentTier);
  if (!nextEvo) return state;

  const newTier = (currentTier + 1) as 0 | 1 | 2 | 3 | 4;
  const newEvo = getEvolution(newTier);

  // Unlock new cards - add 1 copy of each
  const newCards: CardInstance[] = nextEvo.unlockCards.map(defId => ({
    uid: uid(),
    defId,
  }));

  return {
    ...state,
    phase: 'evolution',
    player: {
      ...state.player,
      evolutionTier: newTier,
      maxHp: newEvo.maxHp,
      hp: Math.min(state.player.hp + 20, newEvo.maxHp), // heal on evolution
      maxEnergy: newEvo.maxEnergy,
      energy: newEvo.maxEnergy,
      drawPerTurn: newEvo.drawPerTurn,
      strength: state.player.strength + newEvo.bonusStrength,
    },
    deck: [...state.deck, ...newCards],
    log: [`¡Evolucionaste a ${newEvo.name}!`, ...state.log],
    pendingEvolution: false,
  };
}

// ─── After evolution, next encounter ────────────────────
export function proceedAfterEvolution(state: GameState): GameState {
  return nextEncounter({ ...state, phase: 'battle' });
}

// ─── Next encounter ──────────────────────────────────────
function nextEncounter(state: GameState): GameState {
  return startEncounter({
    ...state,
    encounter: state.encounter + 1,
    rewardCards: [],
  });
}

// ─── Generate reward cards ───────────────────────────────
function generateRewardCards(available: CardDef[], count: number): CardInstance[] {
  const shuffled = shuffle([...available]);
  return shuffled.slice(0, count).map(def => ({
    uid: uid(),
    defId: def.id,
  }));
}

// ─── Shuffle ──────────────────────────────────────────────
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// ─── Check for final victory (after defeating encounter 10) ──
export function checkFinalVictory(state: GameState): boolean {
  return state.encounter >= 10;
}
