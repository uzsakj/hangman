import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { startGame } from '../store/slices/wordsSlice';

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
    <div className="min-h-[calc(100vh-2.5rem)] w-full bg-gray-100">
      <div className="flex min-h-[calc(100vh-2.5rem)] items-center justify-center">
        <div className="flex h-[75vh] w-[75vw] flex-col rounded-[1.5rem] bg-white p-6 shadow-md sm:p-8">
          <h1 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Hangman Game
          </h1>
          <p className="mt-3 text-center text-gray-600">Choose a difficulty level</p>

          <div className="mt-6 flex flex-1 flex-col items-center justify-center">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <button
                type="button"
                onClick={() => setSelected('easy')}
                className="min-w-[220px] border-2 px-4 py-[18px] text-sm font-semibold"
                style={{
                  borderRadius: 12,
                  backgroundColor: selected === 'easy' ? '#2563eb' : '#ffffff',
                  color: selected === 'easy' ? '#ffffff' : '#1f2937',
                  borderColor: selected === 'easy' ? '#1d4ed8' : '#d1d5db',
                }}
              >
                Easy (6-8)
              </button>
              <button
                type="button"
                onClick={() => setSelected('medium')}
                className="min-w-[220px] border-2 px-4 py-[18px] text-sm font-semibold"
                style={{
                  borderRadius: 12,
                  backgroundColor: selected === 'medium' ? '#2563eb' : '#ffffff',
                  color: selected === 'medium' ? '#ffffff' : '#1f2937',
                  borderColor: selected === 'medium' ? '#1d4ed8' : '#d1d5db',
                }}
              >
                Medium (9-11)
              </button>
              <button
                type="button"
                onClick={() => setSelected('hard')}
                className="min-w-[220px] border-2 px-4 py-[18px] text-sm font-semibold"
                style={{
                  borderRadius: 12,
                  backgroundColor: selected === 'hard' ? '#2563eb' : '#ffffff',
                  color: selected === 'hard' ? '#ffffff' : '#1f2937',
                  borderColor: selected === 'hard' ? '#1d4ed8' : '#d1d5db',
                }}
              >
                Hard (12-14)
              </button>
            </div>

            <div style={{ marginTop: '5rem', display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={handlePlay}
                disabled={!selected}
                className="min-w-[220px] border-2 px-4 py-[22px] text-base font-semibold"
                style={{
                  borderRadius: 12,
                  backgroundColor: selected ? '#2563eb' : '#e5e7eb',
                  color: selected ? '#ffffff' : '#6b7280',
                  borderColor: selected ? '#1d4ed8' : '#d1d5db',
                  cursor: selected ? 'pointer' : 'not-allowed',
                }}
              >
                Let&apos;s play
              </button>
              {error && (
                <p style={{ marginTop: 8, fontSize: 14, color: '#dc2626' }}>
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
