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
            flexDirection: 'column',
            height: '75vh',
            width: '75vw',
            borderRadius: 24,
            backgroundColor: '#ffffff',
            padding: '2rem',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }}
        >
          <h1
            style={{
              textAlign: 'center',
              fontSize: '1.875rem',
              fontWeight: 700,
              color: '#111827',
              margin: 0,
            }}
          >
            Hangman Game
          </h1>
          <p
            style={{
              marginTop: 12,
              textAlign: 'center',
              color: '#6b7280',
              marginBottom: 0,
            }}
          >
            Choose a difficulty level
          </p>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <button
                type="button"
                onClick={() => setSelected('easy')}
                style={{
                  minWidth: 220,
                  padding: '18px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 12,
                  border: '2px solid',
                  backgroundColor: selected === 'easy' ? '#2563eb' : '#ffffff',
                  color: selected === 'easy' ? '#ffffff' : '#1f2937',
                  borderColor: selected === 'easy' ? '#1d4ed8' : '#d1d5db',
                  cursor: 'pointer',
                }}
              >
                Easy (6-8)
              </button>
              <button
                type="button"
                onClick={() => setSelected('medium')}
                style={{
                  minWidth: 220,
                  padding: '18px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 12,
                  border: '2px solid',
                  backgroundColor: selected === 'medium' ? '#2563eb' : '#ffffff',
                  color: selected === 'medium' ? '#ffffff' : '#1f2937',
                  borderColor: selected === 'medium' ? '#1d4ed8' : '#d1d5db',
                  cursor: 'pointer',
                }}
              >
                Medium (9-11)
              </button>
              <button
                type="button"
                onClick={() => setSelected('hard')}
                style={{
                  minWidth: 220,
                  padding: '18px 16px',
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 12,
                  border: '2px solid',
                  backgroundColor: selected === 'hard' ? '#2563eb' : '#ffffff',
                  color: selected === 'hard' ? '#ffffff' : '#1f2937',
                  borderColor: selected === 'hard' ? '#1d4ed8' : '#d1d5db',
                  cursor: 'pointer',
                }}
              >
                Hard (12-14)
              </button>
            </div>

            <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handlePlay}
                disabled={!selected}
                style={{
                  minWidth: 220,
                  padding: '22px 16px',
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 12,
                  border: '2px solid',
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
