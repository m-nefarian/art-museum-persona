import { create } from 'zustand';
import { artworks } from '../data/artworks';
import { addScores, createEmptyScores, type DimensionScores } from '../utils/personality';

export type MuseumScene = 'intro' | 'hall' | 'choice' | 'companion' | 'result';

interface MuseumState {
  scene: MuseumScene;
  currentArtworkIndex: number;
  scores: DimensionScores;
  selectedCompanionId?: string;
  isPaused: boolean;
  finishIntro: () => void;
  goToChoice: () => void;
  answerChoice: (delta: Partial<DimensionScores>) => void;
  selectCompanion: (companionId: string) => void;
  setPaused: (paused: boolean) => void;
  reset: () => void;
}

export const useMuseumStore = create<MuseumState>((set) => ({
  scene: 'intro',
  currentArtworkIndex: 0,
  scores: createEmptyScores(),
  selectedCompanionId: undefined,
  isPaused: false,

  finishIntro: () => {
    set({ scene: 'hall', currentArtworkIndex: 0, isPaused: false });
  },

  goToChoice: () => {
    set({ scene: 'choice', isPaused: true });
  },

  answerChoice: (delta) => {
    set((state) => {
      const isLastArtwork = state.currentArtworkIndex >= artworks.length - 1;
      return {
        scores: addScores(state.scores, delta),
        currentArtworkIndex: isLastArtwork ? state.currentArtworkIndex : state.currentArtworkIndex + 1,
        scene: isLastArtwork ? 'companion' : 'hall',
        isPaused: false
      };
    });
  },

  selectCompanion: (companionId) => {
    set({ selectedCompanionId: companionId, scene: 'result', isPaused: false });
  },

  setPaused: (paused) => {
    set({ isPaused: paused });
  },

  reset: () => {
    set({
      scene: 'intro',
      currentArtworkIndex: 0,
      scores: createEmptyScores(),
      selectedCompanionId: undefined,
      isPaused: false
    });
  }
}));
