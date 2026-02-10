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

  const pageWrap = 'min-h-[calc(100vh-2.5rem)] w-full bg-[var(--bg-page)] overflow-auto md:overflow-visible';
  const centerWrap = 'flex min-h-[calc(100vh-2.5rem)] items-start md:items-center justify-center py-2 md:py-0 overflow-auto md:overflow-visible';
  const card = 'flex flex-col w-[95vw] md:w-[75vw] h-auto min-h-[50vh] md:h-[75vh] md:min-h-0 rounded-3xl bg-[var(--surface)] p-4 my-2 md:m-0 md:p-8 shadow-[var(--shadow)]';

  if (loading) {
    return (
      <div className={pageWrap}>
        <div className={centerWrap}>
          <p className="m-0 text-[var(--text-secondary)]">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={pageWrap}>
        <div className={centerWrap}>
          <div className={card}>
            <h1 className="text-center text-2xl md:text-3xl font-bold text-[var(--text-primary)] m-0">
              Admin login
            </h1>
            <p className="text-center text-[var(--text-secondary)] mt-2 mb-6">
              Sign in to manage words
            </p>
            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-3 max-w-xs mx-auto"
            >
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                autoComplete="email"
                className="px-3 py-2.5 rounded-lg border border-[var(--border)] text-base bg-[var(--surface)] text-[var(--text-primary)]"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="px-3 py-2.5 rounded-lg border border-[var(--border)] text-base bg-[var(--surface)] text-[var(--text-primary)]"
              />
              {loginError && (
                <p className="m-0 text-sm text-[var(--error)]">{loginError}</p>
              )}
              <Button type="submit" variant="primary" size="sm" disabled={signingIn}>
                {signingIn ? 'Signing in…' : 'Sign in'}
              </Button>
              <Button variant="outline" size="sm" as={Link} to="/" className="inline-block text-center no-underline">
                Back to home
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={pageWrap}>
      <div className={centerWrap}>
        <div className={card}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="m-0 text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Admin
            </h1>
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          </div>

          <div className="flex flex-col md:flex-row flex-1 gap-6 md:gap-8 mt-6 min-h-0">
            {/* Left: word adding section */}
            <div className="flex-none w-full md:w-[280px] flex flex-col gap-3">
              <p className="m-0 text-sm text-[var(--text-muted)]">
                Words you would like to add to the list
              </p>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="New word"
                className="px-3 py-2.5 rounded-lg border border-[var(--border)] text-base bg-[var(--surface)] text-[var(--text-primary)]"
              />
              <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
              <Button variant="outline" size="sm" as={Link} to="/" className="inline-block text-center no-underline">
                Back
              </Button>
              {message && (
                <p className={`m-0 text-sm ${message.type === 'ok' ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                  {message.text}
                </p>
              )}
            </div>

            {/* Right: list of words in columns */}
            <div className="flex-1 overflow-auto columns-2 md:columns-3 gap-6 [column-fill:balance]">
              {words.length === 0 ? (
                <p className="m-0 text-sm text-[var(--text-secondary)]">No words yet.</p>
              ) : (
                words.map((word) => (
                  <div key={word} className="break-inside-avoid py-1 text-sm text-[var(--text-muted)]">
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
