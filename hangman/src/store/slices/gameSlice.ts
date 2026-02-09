import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { startGame } from './wordsSlice';

type GameState = {
  word: string | null;
  difficulty: string | null;
  guessed: string[];
};

const initialState: GameState = {
  word: null,
  difficulty: null,
  guessed: [],
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addGuess: (state, action: PayloadAction<string>) => {
      const letter = action.payload.toLowerCase();
      if (!state.word || state.guessed.includes(letter)) return;
      state.guessed.push(letter);
    },
    clearGame: (state) => {
      state.word = null;
      state.difficulty = null;
      state.guessed = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(startGame.fulfilled, (state, action) => {
      state.word = action.payload.word;
      state.difficulty = action.payload.difficulty;
      state.guessed = [];
    });
  },
});

export const { addGuess, clearGame } = gameSlice.actions;
export default gameSlice.reducer;
