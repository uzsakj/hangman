import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

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

type WordsState = {
  words: string[];
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
};

const initialState: WordsState = {
  words: [],
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
        if (!state.words.includes(action.payload)) {
          state.words.push(action.payload);
        }
      })
      .addCase(addWord.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearWordsError } = wordsSlice.actions;
export default wordsSlice.reducer;
