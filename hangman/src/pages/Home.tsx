import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { startGame } from '../store/slices/wordsSlice';
import { Button } from '../components/Button';

export default function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const gameWord = useAppSelector((s) => s.game.word);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If a game is in progress, redirect to game page to continue (declarative so it runs on first render)
  if (gameWord != null && gameWord !== '') {
    return <Navigate to="/game" replace />;
  }

  const handlePlay = async () => {
    if (!selected) return;
    setError(null);
    try {
      await dispatch(startGame(selected)).unwrap();
      navigate('/game');
    } catch (e) {
      setError(String(e));
    }
  };

  return (
    <div className="min-h-[calc(100vh-2.5rem)] w-full bg-[var(--bg-page)] overflow-auto md:overflow-visible">
      <div className="flex min-h-[calc(100vh-2.5rem)] items-start md:items-center justify-center py-2 md:py-0 overflow-auto md:overflow-visible">
        <div className="flex flex-col w-[95vw] md:w-[75vw] h-auto min-h-[50vh] md:h-[75vh] md:min-h-0 rounded-3xl bg-[var(--surface)] p-4 my-2 md:m-0 md:p-8 shadow-[var(--shadow)]">
          <h1 className="text-center text-2xl md:text-3xl font-bold text-[var(--text-primary)] m-0">
            Hangman Game
          </h1>
          <p className="mt-3 text-center text-[var(--text-secondary)] mb-0">
            Choose a difficulty level
          </p>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Button
                variant="default"
                selected={selected === 'easy'}
                onClick={() => setSelected('easy')}
              >
                Easy (6-8)
              </Button>
              <Button
                variant="default"
                selected={selected === 'medium'}
                onClick={() => setSelected('medium')}
              >
                Medium (9-11)
              </Button>
              <Button
                variant="default"
                selected={selected === 'hard'}
                onClick={() => setSelected('hard')}
              >
                Hard (12-14)
              </Button>
            </div>

            <div className="mt-8 md:mt-20 flex flex-col items-center">
              <Button
                variant="primary"
                size="lg"
                disabled={!selected}
                onClick={handlePlay}
              >
                Let&apos;s play
              </Button>
              {error && (
                <p className="mt-2 text-sm text-[var(--error)]">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
