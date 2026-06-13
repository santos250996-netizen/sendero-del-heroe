import { create } from 'zustand';
import { type GameState, type ClassPath } from '@/game/types';
import * as engine from '@/game/engine';
import { getCardDef } from '@/game/data/cards';

interface GameStore extends GameState {
  startNewGame: () => void;
  playCard: (cardUid: string) => void;
  endTurn: () => void;
  toggleRewardCard: (cardUid: string) => void;
  confirmRewards: () => void;
  skipRewards: () => void;
  chooseEvolution: (classPath: ClassPath) => void;
  isAnimating: boolean;
  setIsAnimating: (v: boolean) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  phase: 'menu',
  player: {
    hp: 0, maxHp: 0, energy: 0, maxEnergy: 0,
    drawPerTurn: 0, strength: 0, xp: 0,
    evolutionTier: 0, classPath: 'vagabundo',
    nextAttackBuff: 0, dodgeCount: 0, attackBuffTurn: 0,
  },
  deck: [], hand: [], discard: [],
  enemy: null, encounter: 0, turn: 0,
  log: [], rewardCards: [], pendingEvolution: false,
  evolutionChoices: [], pickedRewards: [],
  isAnimating: false,

  setIsAnimating: (v) => set({ isAnimating: v }),

  startNewGame: () => {
    const state = engine.createNewGame();
    set({ ...state });
  },

  playCard: (cardUid: string) => {
    const state = get();
    if (state.phase !== 'battle' || state.isAnimating) return;
    const card = state.hand.find(c => c.uid === cardUid);
    if (!card) return;
    const def = getCardDef(card.defId);
    if (def && state.player.energy < def.cost) return;
    if (!def) return;

    set({ isAnimating: true });
    let newState = engine.playCard(state, cardUid);
    set(newState);

    setTimeout(() => {
      const cs = get();
      const result = engine.checkCombatEnd(cs);
      if (result === 'enemy_dead') {
        if (engine.checkFinalVictory(cs)) {
          set({ phase: 'victory', isAnimating: false });
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
      // Check if enemy died from DOTs during enemy turn
      const result = engine.checkCombatEnd(cs);
      if (result === 'enemy_dead') {
        if (engine.checkFinalVictory(cs)) {
          set({ phase: 'victory', isAnimating: false });
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

  chooseEvolution: (classPath: ClassPath) => {
    const state = get();
    const newState = engine.chooseEvolution(state, classPath);
    set(newState);
  },
}));


