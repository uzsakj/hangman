import { Link } from 'react-router-dom';
import attrectoLogo from '../assets/Attrecto_logo.png';

export default function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between bg-white px-4 py-2 sm:px-4 md:px-6">
      <Link to="/" className="flex items-center shrink-0">
        <img src={attrectoLogo} alt="Attrecto" className="h-[32px] max-h-[32px] w-auto object-contain" />
      </Link>
      <Link
        to="/admin"
        className="px-2 py-1 text-[11px] font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
      >
        Admin
      </Link>
    </nav>
  );
}
