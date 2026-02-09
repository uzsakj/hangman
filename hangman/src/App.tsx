import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Admin from './pages/Admin';
import Game from './pages/Game';
import Home from './pages/Home';

function App() {
  return (
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
  );
}

export default App;
