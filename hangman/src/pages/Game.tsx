import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addGuess, clearGame } from '../store/slices/gameSlice';
import { startGame } from '../store/slices/wordsSlice';
import { HangmanSVG } from '../components/HangmanSVG';
import { Button } from '../components/Button';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
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
      <div style={{ minHeight: 'calc(100vh - 2.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-page)' }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 2.5rem)',
        width: '100%',
        backgroundColor: 'var(--bg-page)',
      }}
    >
      <div
        className="page-wrapper"
        style={{
          display: 'flex',
          minHeight: 'calc(100vh - 2.5rem)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="page-card game-card-inner"
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '2rem',
            height: '75vh',
            width: '75vw',
            borderRadius: 24,
            backgroundColor: 'var(--surface)',
            padding: '2rem',
            boxShadow: 'var(--shadow)',
          }}
        >
          {/* Left section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <h1
              style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
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
                  color: won ? 'var(--success)' : 'var(--error)',
                }}
              >
                {won ? 'You have won!' : 'You have lost!'}
              </p>
            )}

            <div
              className="game-display-word"
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

            <div
              className="game-keyboard"
              style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}
            >
              {ALPHABET.map((letter) => {
                const used = guessed.has(letter);
                return (
                  <button
                    key={letter}
                    type="button"
                    className="game-letter-btn"
                    onClick={() => guess(letter)}
                    disabled={used}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      backgroundColor: used ? 'var(--muted-bg)' : 'var(--surface)',
                      color: used ? 'var(--text-secondary)' : 'var(--text-muted)',
                      fontWeight: 600,
                      cursor: used ? 'default' : 'pointer',
                    }}
                  >
                    {letter.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <p style={{ marginTop: 20, marginBottom: 0, fontSize: 14, color: 'var(--text-muted)' }}>
              remaining possibility of failures: <strong>{remaining}</strong>
            </p>

            <div className="game-actions" style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button variant="outline" size="sm" onClick={endGame}>
                End game
              </Button>
              <Button variant="primary" size="sm" onClick={startNewGame}>
                Start new game
              </Button>
            </div>
          </div>

          {/* Right section: hangman SVG */}
          <div
            className="game-svg-section"
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
