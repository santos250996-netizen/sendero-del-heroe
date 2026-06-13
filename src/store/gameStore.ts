import { create } from 'zustand';
import { type GameState, type ClassPath, type RestChoice } from '@/game/types';
import * as engine from '@/game/engine';
import { getCardDef, getEffectiveCardDef } from '@/game/data/cards';

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
  selectNode: (nodeId: string) => void;
  enterNode: () => void;

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

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'menu',
  player: {
    hp: 0, maxHp: 0, energy: 0, maxEnergy: 0,
    drawPerTurn: 0, strength: 0, xp: 0,
    evolutionTier: 0, classPath: 'vagabundo',
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
      const result = engine.checkCombatEnd(cs);
      if (result === 'enemy_dead') {
        if (engine.checkFinalVictory(cs)) {
          // Check if it's a boss - always go to victory screen
          const node = cs.map?.nodes.find(n => n.id === cs.currentNodeId);
          if (node?.type === 'boss') {
            const victoryState = engine.handleVictory(cs);
            set({ ...victoryState, phase: 'victory', isAnimating: false });
          } else {
            const victoryState = engine.handleVictory(cs);
            set({ ...victoryState, isAnimating: false });
          }
        } else {
          const victoryState = engine.handleVictory(cs);
          set({ ...victoryState, isAnimating: false });
        }
      } else if (result === 'player_dead') {
        set({ phase: 'gameover', isAnimating: false });
      } else {
        set({ isAnimating: false });
      }
    }, 400);
  },

  endTurn: () => {
    const state = get();
    if (state.phase !== 'battle' || state.isAnimating) return;
    set({ isAnimating: true });

    const afterDiscard: GameState = { ...state, hand: [], discard: [...state.discard, ...state.hand] };
    let newState = engine.endPlayerTurn(afterDiscard);
    set(newState);

    setTimeout(() => {
      const cs = get();
      const result = engine.checkCombatEnd(cs);
      if (result === 'enemy_dead') {
        if (engine.checkFinalVictory(cs)) {
          const node = cs.map?.nodes.find(n => n.id === cs.currentNodeId);
          if (node?.type === 'boss') {
            const victoryState = engine.handleVictory(cs);
            set({ ...victoryState, phase: 'victory', isAnimating: false });
          } else {
            const victoryState = engine.handleVictory(cs);
            set({ ...victoryState, isAnimating: false });
          }
        } else {
          const victoryState = engine.handleVictory(cs);
          set({ ...victoryState, isAnimating: false });
        }
      } else if (result === 'player_dead') {
        set({ phase: 'gameover', isAnimating: false });
      } else {
        const nextTurn = engine.startTurn(cs);
        set({ ...nextTurn, isAnimating: false });
      }
    }, 600);
  },

  // ─── Map ─────────────────────────────────────────────

  selectNode: (nodeId: string) => {
    const state = get();
    if (state.phase !== 'map') return;
    const newState = engine.selectMapNode(state, nodeId);
    set(newState);
  },

  enterNode: () => {
    const state = get();
    if (state.phase !== 'map' || !state.currentNodeId) return;
    const newState = engine.enterNode(state);
    set(newState);
  },

  // ─── Rewards ─────────────────────────────────────────

  toggleRewardCard: (cardUid: string) => {
    const state = get();
    set({
      pickedRewards: state.pickedRewards.includes(cardUid)
        ? state.pickedRewards.filter(id => id !== cardUid)
        : [...state.pickedRewards, cardUid],
    });
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
}));
