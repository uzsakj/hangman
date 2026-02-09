import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <nav>
        <Link to="/game">Game</Link>
        <span> · </span>
        <Link to="/admin">Admin</Link>
      </nav>
    </div>
  );
}
