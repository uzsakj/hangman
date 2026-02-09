import { Link } from 'react-router-dom';
import attrectoLogo from '../assets/Attrecto_logo.png';

export default function Navbar() {
  return (
    <nav
      className="flex w-full h-10 min-h-10 items-center justify-between bg-white box-border m-0"
      style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 24, paddingRight: 24 }}
    >
      <Link to="/" className="flex items-center shrink-0">
        <img src={attrectoLogo} alt="Attrecto" className="h-[32px] max-h-[32px] w-auto object-contain" />
      </Link>
      <Link
        to="/admin"
        className="flex h-10 items-center px-2 text-[11px] font-medium leading-none text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
      >
        Admin
      </Link>
    </nav>
  );
}
