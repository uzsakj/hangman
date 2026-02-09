import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import Game from './pages/Game';
import Home from './pages/Home';
import { fetchWords } from './store/slices/wordsSlice';
import { useAppDispatch } from './store/hooks';

function App() {
  const dispatch = useAppDispatch();

  // Sync words from Supabase on first load and when tab becomes visible again
  useEffect(() => {
    dispatch(fetchWords());
  }, [dispatch]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        dispatch(fetchWords());
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [dispatch]);

  return (
    <ThemeProvider>
    <BrowserRouter>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col" style={{ minHeight: 'calc(100vh - 2.5rem)' }}>
          <div className="flex-1 min-h-[calc(100vh-2.5rem)]">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
