import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import wordsReducer from './slices/wordsSlice';

const GAME_STORAGE_KEY = 'hangman-game';

function loadGameFromStorage(): { word: string | null; difficulty: string | null; guessed: string[] } | undefined {
  try {
    const raw = localStorage.getItem(GAME_STORAGE_KEY);
    if (!raw) return undefined;
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== 'object') return undefined;
    const o = data as Record<string, unknown>;
    const word = o.word;
    const difficulty = o.difficulty;
    const guessed = o.guessed;
    if (
      (word !== null && word !== undefined && typeof word !== 'string') ||
      (difficulty !== null && difficulty !== undefined && typeof difficulty !== 'string') ||
      !Array.isArray(guessed) ||
      guessed.some((x) => typeof x !== 'string')
    ) {
      return undefined;
    }
    return {
      word: word == null ? null : String(word),
      difficulty: difficulty == null ? null : String(difficulty),
      guessed: guessed as string[],
    };
  } catch {
    return undefined;
  }
}

const persistedGame = loadGameFromStorage();

export const store = configureStore({
  reducer: {
    words: wordsReducer,
    game: gameReducer,
  },
  preloadedState: persistedGame ? { game: persistedGame } : undefined,
});

// Persist game state so it survives full page load (e.g. user typing / in address bar)
store.subscribe(() => {
  const game = store.getState().game;
  try {
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(game));
  } catch {
    // ignore quota / private mode
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
