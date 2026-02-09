import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addWord } from '../store/slices/wordsSlice';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

export default function Admin() {
  const { user, loading, signIn, signOut } = useAuth();
  const dispatch = useAppDispatch();
  const words = useAppSelector((s) => s.words.words);
  const [inputValue, setInputValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setSigningIn(true);
    const { error } = await signIn(loginEmail.trim(), loginPassword);
    setSigningIn(false);
    if (error) setLoginError(error);
  };

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

  const pageWrapStyle = {
    minHeight: 'calc(100vh - 2.5rem)' as const,
    width: '100%' as const,
    backgroundColor: 'var(--bg-page)',
  };
  const centerWrapStyle = {
    display: 'flex' as const,
    minHeight: 'calc(100vh - 2.5rem)' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
  const cardStyle = {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    height: '75vh' as const,
    width: '75vw' as const,
    borderRadius: 24,
    backgroundColor: 'var(--surface)',
    padding: '2rem',
    boxShadow: 'var(--shadow)',
  };

  if (loading) {
    return (
      <div style={pageWrapStyle}>
        <div style={centerWrapStyle}>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={pageWrapStyle}>
        <div style={centerWrapStyle}>
          <div className="page-card" style={cardStyle}>
            <h1
              style={{
                textAlign: 'center',
                fontSize: '1.875rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              Admin login
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 8, marginBottom: 24 }}>
              Sign in to manage words
            </p>
            <form
              onSubmit={handleLogin}
              style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320, margin: '0 auto' }}
            >
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  fontSize: 16,
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  fontSize: 16,
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                }}
              />
              {loginError && (
                <p style={{ margin: 0, fontSize: 14, color: 'var(--error)' }}>{loginError}</p>
              )}
              <Button type="submit" variant="primary" disabled={signingIn} style={{ padding: '12px 16px' }}>
                {signingIn ? 'Signing in…' : 'Sign in'}
              </Button>
              <Button variant="outline" as={Link} to="/" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center', padding: '12px 16px' }}>
                Back to home
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageWrapStyle}>
      <div
        className="page-wrapper"
        style={centerWrapStyle}
      >
        <div
          className="page-card"
          style={cardStyle}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <h1
              style={{
                margin: 0,
                fontSize: '1.875rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}
            >
              Admin
            </h1>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>

          <div
            className="admin-card-inner"
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
              className="admin-form-section"
              style={{
                flex: '0 0 280px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>
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
                  border: '1px solid var(--border)',
                  fontSize: 16,
                  backgroundColor: 'var(--surface)',
                  color: 'var(--text-primary)',
                }}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={saving}
                style={{ padding: '12px 16px' }}
              >
                {saving ? 'Saving…' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" as={Link} to="/" style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}>
                Back
              </Button>
              {message && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    color: message.type === 'ok' ? 'var(--success)' : 'var(--error)',
                  }}
                >
                  {message.text}
                </p>
              )}
            </div>

            {/* Right: list of words in columns */}
            <div
              className="admin-words-list"
              style={{
                flex: 1,
                overflow: 'auto',
                columnCount: 3,
                columnGap: '1.5rem',
                columnFill: 'balance' as const,
              }}
            >
              {words.length === 0 ? (
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>No words yet.</p>
              ) : (
                words.map((word) => (
                  <div
                    key={word}
                    style={{
                      breakInside: 'avoid' as const,
                      padding: '4px 0',
                      fontSize: 14,
                      color: 'var(--text-muted)',
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
