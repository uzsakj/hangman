import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addGuess, clearGame } from '../store/slices/gameSlice';
import { startGame } from '../store/slices/wordsSlice';
import { HangmanSVG } from '../components/HangmanSVG';
import { Button } from '../components/Button';
import { playCorrectGuess, playWrongGuess } from '../lib/sounds';

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
      const lower = letter.toLowerCase();
      const correct = word != null && word.includes(lower);
      dispatch(addGuess(lower));
      if (correct) playCorrectGuess();
      else playWrongGuess();
    },
    [gameOver, guessed, word, dispatch]
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
      <div className="min-h-[calc(100vh-2.5rem)] flex items-center justify-center bg-[var(--bg-page)]">
        <p className="m-0 text-[var(--text-secondary)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-2.5rem)] w-full bg-[var(--bg-page)] overflow-auto md:overflow-visible">
      <div className="flex min-h-[calc(100vh-2.5rem)] items-start md:items-center justify-center py-2 md:py-0 overflow-auto md:overflow-visible">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-[95vw] md:w-[75vw] h-auto min-h-[50vh] md:h-[75vh] rounded-3xl bg-[var(--surface)] p-4 my-2 md:m-0 md:p-8 shadow-[var(--shadow)]">
          {/* Left section */}
          <div className="flex-1 flex flex-col min-w-0">
            <h1 className="m-0 text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Hangman game
            </h1>

            {gameOver && (
              <p className={`mt-3 text-lg font-semibold ${won ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                {won ? 'You have won!' : 'You have lost!'}
              </p>
            )}

            <div className="mt-4 text-2xl md:text-2xl tracking-widest font-mono min-h-9 break-all">
              {displayWord || '...'}
            </div>

            <div className="mt-6 flex flex-wrap gap-1.5 md:gap-1.5 justify-center">
              {ALPHABET.map((letter) => {
                const used = guessed.has(letter);
                return (
                  <button
                    key={letter}
                    type="button"
                    className="w-7 h-7 md:w-9 md:h-9 rounded-lg border border-[var(--border)] font-semibold text-xs md:text-base disabled:cursor-default disabled:bg-[var(--muted-bg)] disabled:text-[var(--text-secondary)] bg-[var(--surface)] text-[var(--text-muted)] cursor-pointer enabled:hover:opacity-90"
                    onClick={() => guess(letter)}
                    disabled={used}
                  >
                    {letter.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <p className="mt-5 mb-0 text-sm text-[var(--text-muted)]">
              remaining possibility of failures: <strong>{remaining}</strong>
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={endGame}>
                End game
              </Button>
              <Button variant="primary" size="sm" onClick={startNewGame}>
                Start new game
              </Button>
            </div>
          </div>

          {/* Right section: hangman SVG */}
          <div className="flex-none flex items-center justify-center min-h-40 md:min-h-0 md:w-[220px]">
            <HangmanSVG wrongCount={wrongCount} />
          </div>
        </div>
      </div>
    </div>
  );
}
