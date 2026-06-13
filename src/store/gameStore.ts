import { create } from 'zustand';
import {
  type GameState,
  type CardInstance,
  type GamePhase,
} from '@/game/types';
import * as engine from '@/game/engine';
import { getCardDef } from '@/game/data/cards';

interface GameStore extends GameState {
  // Actions
  startNewGame: () => void;
  playCard: (cardUid: string) => void;
  endTurn: () => void;
  addRewardCard: (cardUid: string) => void;
  skipRewards: () => void;
  proceedAfterReward: () => void;
  proceedAfterEvolution: () => void;
  // Helpers
  getCardDef: (id: string) => ReturnType<typeof getCardDef>;
  isAnimating: boolean;
  setIsAnimating: (v: boolean) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state (menu)
  phase: 'menu',
  player: {
    hp: 0,
    maxHp: 0,
    energy: 0,
    maxEnergy: 0,
    drawPerTurn: 0,
    strength: 0,
    xp: 0,
    evolutionTier: 0,
    nextAttackBuff: 0,
  },
  deck: [],
  hand: [],
  discard: [],
  enemy: null,
  encounter: 0,
  turn: 0,
  log: [],
  rewardCards: [],
  pendingEvolution: false,
  isAnimating: false,

  setIsAnimating: (v) => set({ isAnimating: v }),

  getCardDef: (id) => getCardDef(id),

  startNewGame: () => {
    const state = engine.createNewGame();
    set({
      ...state,
      phase: 'battle',
    });
  },

  playCard: (cardUid: string) => {
    const state = get();
    if (state.phase !== 'battle' || state.isAnimating) return;

    const card = state.hand.find(c => c.uid === cardUid);
    if (!card) return;
    const def = getCardDef(card.defId);
    if (state.player.energy < def.cost) return;

    set({ isAnimating: true });

    let newState = engine.playCard(state, cardUid);
    set(newState);

    // Check combat end after a short delay
    setTimeout(() => {
      const currentState = get();
      const result = engine.checkCombatEnd(currentState);

      if (result === 'enemy_dead') {
        if (engine.checkFinalVictory(currentState)) {
          set({ phase: 'victory', isAnimating: false });
        } else {
          const victoryState = engine.handleVictory(currentState);
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

    // Discard hand
    const afterDiscard: GameState = {
      ...state,
      hand: [],
      discard: [...state.discard, ...state.hand],
    };

    let newState = engine.endPlayerTurn(afterDiscard);
    set(newState);

    // Check if player died from enemy attack
    setTimeout(() => {
      const currentState = get();
      const result = engine.checkCombatEnd(currentState);

      if (result === 'player_dead') {
        set({ phase: 'gameover', isAnimating: false });
      } else {
        // Start new turn
        const nextTurn = engine.startTurn(currentState);
        set({ ...nextTurn, isAnimating: false });
      }
    }, 600);
  },

  addRewardCard: (cardUid: string) => {
    const state = get();
    const newState = engine.addRewardCard(state, cardUid);
    set(newState);
  },

  skipRewards: () => {
    const state = get();
    const newState = engine.skipRewards(state);
    set(newState);
  },

  proceedAfterReward: () => {
    const state = get();
    const newState = engine.proceedAfterReward(state);
    set(newState);
  },

  proceedAfterEvolution: () => {
    const state = get();
    const newState = engine.proceedAfterEvolution(state);
    set(newState);
  },
}));
