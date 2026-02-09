import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { supabase } from '../../lib/supabase';

export const DIFFICULTY_RANGES: Record<string, [number, number]> = {
  easy: [6, 8],
  medium: [9, 11],
  hard: [12, 14],
};

function getWordsByDifficulty(words: string[], difficulty: string): string[] {
  const [min, max] = DIFFICULTY_RANGES[difficulty] ?? [6, 8];
  return words.filter((w) => w.length >= min && w.length <= max);
}

export const fetchWords = createAsyncThunk(
  'words/fetchWords',
  async (_, { rejectWithValue }) => {
    if (!supabase) {
      return rejectWithValue('Supabase not configured');
    }
    const { data, error } = await supabase.from('words').select('word');
    if (error) {
      return rejectWithValue(error.message);
    }
    const words = (data ?? [])
      .map((row: { word?: string }) => row.word?.trim().toLowerCase())
      .filter((w): w is string => typeof w === 'string' && w.length > 0);
    return words;
  }
);

export const addWord = createAsyncThunk(
  'words/addWord',
  async (word: string, { rejectWithValue }) => {
    const trimmed = word.trim().toLowerCase();
    if (!trimmed) {
      return rejectWithValue('Word is required');
    }
    if (trimmed.length < 6 || trimmed.length > 14) {
      return rejectWithValue('Word must be between 6 and 14 characters');
    }
    if (!supabase) {
      return rejectWithValue('Supabase not configured');
    }
    const { error } = await supabase.from('words').insert({ word: trimmed });
    if (error) {
      return rejectWithValue(error.message);
    }
    return trimmed;
  }
);

export const startGame = createAsyncThunk(
  'words/startGame',
  async (difficulty: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const words = getWordsByDifficulty(state.words.words, difficulty);
    if (words.length === 0) {
      return rejectWithValue(`No words available for ${difficulty}`);
    }
    const word = words[Math.floor(Math.random() * words.length)] ?? '';
    return { word, difficulty };
  }
);

type WordsState = {
  words: string[];
  easyWords: string[];
  mediumWords: string[];
  hardWords: string[];
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
};

const initialState: WordsState = {
  words: [],
  easyWords: [],
  mediumWords: [],
  hardWords: [],
  loading: false,
  error: null,
  lastFetchedAt: null,
};

const wordsSlice = createSlice({
  name: 'words',
  initialState,
  reducers: {
    clearWordsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWords.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.words = action.payload;
        state.lastFetchedAt = Date.now();
        state.easyWords = action.payload.filter(
          (w) => w.length >= 6 && w.length <= 8
        );
        state.mediumWords = action.payload.filter(
          (w) => w.length >= 9 && w.length <= 11
        );
        state.hardWords = action.payload.filter(
          (w) => w.length >= 12 && w.length <= 14
        );
      })
      .addCase(fetchWords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addWord.pending, (state) => {
        state.error = null;
      })
      .addCase(addWord.fulfilled, (state, action) => {
        state.error = null;
        const w = action.payload;
        if (!state.words.includes(w)) {
          state.words.push(w);
          if (w.length >= 6 && w.length <= 8) state.easyWords.push(w);
          if (w.length >= 9 && w.length <= 11) state.mediumWords.push(w);
          if (w.length >= 12 && w.length <= 14) state.hardWords.push(w);
        }
      })
      .addCase(addWord.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearWordsError } = wordsSlice.actions;
export default wordsSlice.reducer;
