import { Link } from 'react-router-dom';
import attrectoLogo from '../assets/Attrecto_logo.png';
import { useTheme } from '../contexts/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="navbar flex w-full h-10 min-h-10 items-center justify-between box-border m-0"
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: 'var(--navbar-bg)',
      }}
    >
      <Link to="/" className="flex items-center shrink-0">
        <img src={attrectoLogo} alt="Attrecto" className="h-[32px] max-h-[32px] w-auto object-contain" />
      </Link>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md border-0 bg-[var(--surface)] text-[var(--text-primary)] outline-none hover:bg-[var(--muted-bg)] transition-colors focus:outline-none"
          style={{ border: 'none' }}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
        <Link
          to="/admin"
          className="flex h-10 items-center px-2 text-[11px] font-medium leading-none rounded transition-colors hover:opacity-90"
          style={{
            color: 'var(--text-secondary)',
            backgroundColor: 'var(--muted-bg)',
          }}
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}
