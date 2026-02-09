import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addWord } from '../store/slices/wordsSlice';

export default function Admin() {
  const dispatch = useAppDispatch();
  const words = useAppSelector((s) => s.words.words);
  const [inputValue, setInputValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const handleSave = async () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (!trimmed) {
      setMessage({ type: 'err', text: 'Enter a word' });
      return;
    }
    if (trimmed.length < 6 || trimmed.length > 14) {
      setMessage({ type: 'err', text: 'Word must be between 6 and 14 characters' });
      return;
    }
    if (words.includes(trimmed)) {
      setMessage({ type: 'err', text: `"${trimmed}" is already in the list` });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await dispatch(addWord(trimmed)).unwrap();
      setMessage({ type: 'ok', text: `Added "${trimmed}"` });
      setInputValue('');
    } catch (err) {
      setMessage({ type: 'err', text: String(err) });
    } finally {
      setSaving(false);
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
            Admin
          </h1>

          <div
            style={{
              display: 'flex',
              flex: 1,
              gap: '2rem',
              marginTop: '1.5rem',
              minHeight: 0,
            }}
          >
            {/* Left: word adding section */}
            <div
              style={{
                flex: '0 0 280px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <p style={{ margin: 0, color: '#4b5563', fontSize: 14 }}>
                Words you would like to add to the list
              </p>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="New word"
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  fontSize: 16,
                }}
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
              <Link
                to="/"
                style={{
                  display: 'inline-block',
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: '2px solid #2563eb',
                  backgroundColor: '#ffffff',
                  color: '#2563eb',
                  fontWeight: 600,
                  textAlign: 'center' as const,
                  textDecoration: 'none',
                }}
              >
                Back
              </Link>
              {message && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: message.type === 'ok' ? '#059669' : '#dc2626',
                  }}
                >
                  {message.text}
                </p>
              )}
            </div>

            {/* Right: list of words in columns */}
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                columnCount: 3,
                columnGap: '1.5rem',
                columnFill: 'balance' as const,
              }}
            >
              {words.length === 0 ? (
                <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>No words yet.</p>
              ) : (
                words.map((word) => (
                  <div
                    key={word}
                    style={{
                      breakInside: 'avoid' as const,
                      padding: '4px 0',
                      fontSize: 14,
                      color: '#374151',
                    }}
                  >
                    {word}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
