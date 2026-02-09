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
          className="page-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '75vh',
            width: '75vw',
            borderRadius: 24,
            backgroundColor: 'var(--surface)',
            padding: '2rem',
            boxShadow: 'var(--shadow)',
          }}
        >
          <h1
            className="home-title"
            style={{
              textAlign: 'center',
              fontSize: '1.875rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Hangman Game
          </h1>
          <p
            style={{
              marginTop: 12,
              textAlign: 'center',
              color: 'var(--text-secondary)',
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

            <div className="home-buttons-wrap" style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button
                variant="primary"
                disabled={!selected}
                onClick={handlePlay}
                style={{ padding: '22px 16px', fontSize: 16 }}
              >
                Let&apos;s play
              </Button>
              {error && (
                <p style={{ marginTop: 8, fontSize: 14, color: 'var(--error)' }}>
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
