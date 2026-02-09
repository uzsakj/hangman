import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addGuess, clearGame } from '../store/slices/gameSlice';
import { startGame } from '../store/slices/wordsSlice';
import { HangmanSVG } from '../components/HangmanSVG';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const ROW1 = ALPHABET.slice(0, 13);
const ROW2 = ALPHABET.slice(13, 26);
const MAX_WRONG = 6;

export default function Game() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const word = useAppSelector((s) => s.game.word);
  const difficulty = useAppSelector((s) => s.game.difficulty);
  const guessedList = useAppSelector((s) => s.game.guessed);
  const guessed = useMemo(() => new Set(guessedList), [guessedList]);

  // Redirect to home if no game started (e.g. opened /game directly)
  useEffect(() => {
    if (word === null && difficulty === null) {
      const t = setTimeout(() => navigate('/', { replace: true }), 0);
      return () => clearTimeout(t);
    }
  }, [word, difficulty, navigate]);

  const wrongCount = useMemo(() => {
    return guessedList.filter((l) => word != null && !word.includes(l)).length;
  }, [guessedList, word]);

  const remaining = MAX_WRONG - wrongCount;
  const won = word != null && word.length > 0 && [...word].every((c) => guessed.has(c));
  const lost = wrongCount >= MAX_WRONG;
  const gameOver = won || lost;

  const guess = useCallback(
    (letter: string) => {
      if (gameOver || guessed.has(letter)) return;
      dispatch(addGuess(letter.toLowerCase()));
    },
    [gameOver, guessed, dispatch]
  );

  const startNewGame = useCallback(() => {
    if (difficulty) dispatch(startGame(difficulty));
  }, [difficulty, dispatch]);

  const endGame = useCallback(() => {
    dispatch(clearGame());
    navigate('/', { replace: true });
  }, [dispatch, navigate]);

  const displayWord = word
    ? [...word].map((c) => (guessed.has(c) ? c.toUpperCase() : '_')).join(' ')
    : '';

  if (word === null) {
    return (
      <div style={{ minHeight: 'calc(100vh - 2.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
        <p style={{ margin: 0, color: '#6b7280' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 2.5rem)',
        width: '100%',
        backgroundColor: '#f3f4f6',
      }}
    >
      <div
        style={{
          display: 'flex',
          minHeight: 'calc(100vh - 2.5rem)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '2rem',
            height: '75vh',
            width: '75vw',
            borderRadius: 24,
            backgroundColor: '#ffffff',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
        >
          {/* Left section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <h1
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#111827',
              }}
            >
              Hangman game
            </h1>

            {gameOver && (
              <p
                style={{
                  margin: '12px 0 0',
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: won ? '#059669' : '#dc2626',
                }}
              >
                {won ? 'You have won!' : 'You have lost!'}
              </p>
            )}

            <div
              style={{
                marginTop: 16,
                fontSize: 24,
                letterSpacing: 4,
                fontFamily: 'monospace',
                minHeight: 36,
              }}
            >
              {displayWord || '...'}
            </div>

            <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ROW1.map((letter) => {
                const used = guessed.has(letter);
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => guess(letter)}
                    disabled={used}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      backgroundColor: used ? '#e5e7eb' : '#ffffff',
                      color: used ? '#9ca3af' : '#374151',
                      fontWeight: 600,
                      cursor: used ? 'default' : 'pointer',
                    }}
                  >
                    {letter.toUpperCase()}
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ROW2.map((letter) => {
                const used = guessed.has(letter);
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => guess(letter)}
                    disabled={used}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: '1px solid #d1d5db',
                      backgroundColor: used ? '#e5e7eb' : '#ffffff',
                      color: used ? '#9ca3af' : '#374151',
                      fontWeight: 600,
                      cursor: used ? 'default' : 'pointer',
                    }}
                  >
                    {letter.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <p style={{ marginTop: 20, marginBottom: 0, fontSize: 14, color: '#4b5563' }}>
              remaining possibility of failures: <strong>{remaining}</strong>
            </p>

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button
                type="button"
                onClick={endGame}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: '2px solid #2563eb',
                  backgroundColor: '#ffffff',
                  color: '#2563eb',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                End game
              </button>
              <button
                type="button"
                onClick={startNewGame}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Start new game
              </button>
            </div>
          </div>

          {/* Right section: hangman SVG */}
          <div
            style={{
              flex: '0 0 220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HangmanSVG wrongCount={wrongCount} />
          </div>
        </div>
      </div>
    </div>
  );
}
