import { create } from 'zustand';
import { type GameState, type ClassPath, type RestChoice } from '@/game/types';
import * as engine from '@/game/engine';
import { getCardDef, getEffectiveCardDef, getRewardPool } from '@/game/data/cards';

interface GameStore extends GameState {
  // Core
  startNewGame: () => void;
  playCard: (cardUid: string) => void;
  endTurn: () => void;
  isAnimating: boolean;
  setIsAnimating: (v: boolean) => void;

  // Deck viewer
  viewingDeck: boolean;
  setViewingDeck: (v: boolean) => void;

  // Map
  selectAndEnterNode: (nodeId: string) => void;

  // Rewards
  toggleRewardCard: (cardUid: string) => void;
  confirmRewards: () => void;
  skipRewards: () => void;

  // Evolution
  chooseEvolution: (classPath: ClassPath) => void;

  // Rest
  chooseRest: (choice: RestChoice) => void;
  removeCardFromDeck: (cardUid: string) => void;
  cancelRestAction: () => void;

  // Card Upgrade
  upgradeCardInDeck: (cardUid: string) => void;

  // Shop
  buyShopItem: (itemId: string) => void;
  leaveShop: () => void;

  // Event
  chooseEventOption: (optionId: string) => void;
  finishEvent: () => void;

  // Treasure / event result
  continueFromResult: () => void;
}

export const useGameStore = create<GameStore>((set, get) => {
  // Helper: resolve combat end after player action
  function resolveCombatEnd(cs: GameState, fromEndTurn: boolean = false) {
    // Idempotency guard: if we're already past the battle phase, do nothing.
    // This prevents double-firing of handleVictory when multiple state updates
    // happen in quick succession (React strict mode, animation callbacks, etc.)
    if (cs.phase !== 'battle') {
      set({ isAnimating: false });
      return;
    }
    const result = engine.checkCombatEnd(cs);
    if (result === 'enemy_dead') {
      const victoryState = engine.handleVictory(cs);
      // Don't override phase: let handleVictory flow (evolution_choice → reward → returnToMap → victory)
      set({ ...victoryState, isAnimating: false });
    } else if (result === 'player_dead') {
      set({ phase: 'gameover', isAnimating: false });
    } else if (fromEndTurn) {
      // New player turn starts ONLY after end of turn (enemy acted)
      const nextTurn = engine.startTurn(cs);
      set({ ...nextTurn, isAnimating: false });
    } else {
      // Mid-turn (after playing a card): just unlock UI
      set({ isAnimating: false });
    }
  }

  return {
  phase: 'menu',
  player: {
    hp: 0, maxHp: 0, energy: 0, maxEnergy: 0,
    drawPerTurn: 0, strength: 0, xp: 0,
    evolutionTier: 0, classPath: 'vagabundo',
    block: 0,
    nextAttackBuff: 0, dodgeCount: 0, attackBuffTurn: 0,
    gold: 0,
  },
  deck: [], hand: [], discard: [],
  enemy: null, encounter: 0, turn: 0,
  log: [], rewardCards: [], pendingEvolution: false,
  evolutionChoices: [], pickedRewards: [],
  map: null, currentNodeId: null,
  restChoice: null, removingCard: false, upgradingCard: false,
  currentEvent: null, eventOutcome: null,
  shopItems: [],
  nextEncounterDamageBonus: 0,
  isAnimating: false,
  viewingDeck: false,

  setViewingDeck: (v: boolean) => set({ viewingDeck: v }),
  setIsAnimating: (v) => set({ isAnimating: v }),

  // ─── Core ────────────────────────────────────────────

  startNewGame: () => {
    const state = engine.createNewGame();
    set({ ...state, isAnimating: false });
  },

  playCard: (cardUid: string) => {
    const state = get();
    if (state.phase !== 'battle' || state.isAnimating) return;
    const card = state.hand.find(c => c.uid === cardUid);
    if (!card) return;
    const def = getEffectiveCardDef(card);
    if (state.player.energy < def.cost) return;

    set({ isAnimating: true });
    let newState = engine.playCard(state, cardUid);
    set(newState);

    setTimeout(() => {
      const cs = get();
      resolveCombatEnd(cs, false);
    }, 400);
  },

  endTurn: () => {
    const state = get();
    if (state.phase !== 'battle' || state.isAnimating) return;
    set({ isAnimating: true });

    // engine.endPlayerTurn handles the discard internally
    let newState = engine.endPlayerTurn(state);
    set(newState);

    setTimeout(() => {
      const cs = get();
      resolveCombatEnd(cs, true);
    }, 600);
  },

  // ─── Map ─────────────────────────────────────────────

  selectAndEnterNode: (nodeId: string) => {
    const state = get();
    if (state.phase !== 'map') return;
    let s = engine.selectMapNode(state, nodeId);
    s = engine.enterNode(s);
    set(s);
  },

  // ─── Rewards ─────────────────────────────────────────

  toggleRewardCard: (cardUid: string) => {
    const state = get();
    const alreadyPicked = state.pickedRewards.includes(cardUid);
    if (alreadyPicked) {
      set({ pickedRewards: state.pickedRewards.filter(id => id !== cardUid) });
    } else if (state.pickedRewards.length < 1) {
      set({ pickedRewards: [...state.pickedRewards, cardUid] });
    }
  },

  confirmRewards: () => {
    const state = get();
    let ns: GameState = { ...state };
    for (const uid of state.pickedRewards) {
      ns = engine.addRewardCard(ns, uid);
    }
    const after = engine.confirmRewards({ ...ns, pickedRewards: [] });
    set(after);
  },

  skipRewards: () => {
    const state = get();
    // If we came from evolution_choice, regenerate rewards based on current
    // (un-evolved) class so the player still gets a fresh, varied reward screen.
    if (state.phase === 'evolution_choice') {
      const allPlayerCards = [...state.deck, ...state.hand, ...state.discard];
      const rewardPool = getRewardPool(state.player.classPath, allPlayerCards);
      const newRewardCards = engine.regenerateRewardCards(rewardPool, 3);
      set({
        ...state,
        phase: 'reward',
        pendingEvolution: false,
        evolutionChoices: [],
        rewardCards: newRewardCards,
        pickedRewards: [],
      });
      return;
    }
    const newState = engine.skipRewards(state);
    set(newState);
  },

  // ─── Evolution ───────────────────────────────────────

  chooseEvolution: (classPath: ClassPath) => {
    const state = get();
    const newState = engine.chooseEvolution(state, classPath);
    set(newState);
  },

  // ─── Rest ─────────────────────────────────────────────

  chooseRest: (choice: RestChoice) => {
    const state = get();
    const newState = engine.chooseRest(state, choice);
    set(newState);
  },

  removeCardFromDeck: (cardUid: string) => {
    const state = get();
    const newState = engine.removeCardFromDeck(state, cardUid);
    set(newState);
  },

  cancelRestAction: () => {
    const state = get();
    const newState = engine.cancelRestAction(state);
    set(newState);
  },

  // ─── Card Upgrade ────────────────────────────────────

  upgradeCardInDeck: (cardUid: string) => {
    const state = get();
    const newState = engine.upgradeCardInDeck(state, cardUid);
    set(newState);
  },

  // ─── Shop ─────────────────────────────────────────────

  buyShopItem: (itemId: string) => {
    const state = get();
    const newState = engine.buyShopItem(state, itemId);
    set(newState);
  },

  leaveShop: () => {
    const state = get();
    const newState = engine.leaveShop(state);
    set(newState);
  },

  // ─── Events ───────────────────────────────────────────

  chooseEventOption: (optionId: string) => {
    const state = get();
    const newState = engine.chooseEventOption(state, optionId);
    set(newState);
  },

  finishEvent: () => {
    const state = get();
    const newState = engine.finishEvent(state);
    set(newState);
  },

  // ─── Continue from result (treasure, etc) ─────────────

  continueFromResult: () => {
    const state = get();
    if (state.phase === 'event_result') {
      // If we're in event_result with removingCard or upgradingCard, we need to finish those first
      if (state.removingCard || state.upgradingCard) return;
      set(engine.finishEvent(state));
    } else {
      set(engine.returnToMap(state));
    }
  },
  };
});