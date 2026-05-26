import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Layout, Code2 } from 'lucide-react';
import useStore from '../../store';
import UserAvatar from './UserAvatar';
import logo from '../../assets/logo.svg';

function Navbar() {
  const navigate = useNavigate();
  const { user, clearAuth, userColor } = useStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <nav className="h-14 bg-dark-800/80 backdrop-blur-xl border-b border-dark-600/30 flex items-center justify-between px-4 z-50 relative">
      <Link to="/dashboard" className="flex items-center gap-2.5 group">
        <img src={logo} alt="CollabWrite" className="w-8 h-8 transition-transform group-hover:scale-110" />
        <span className="text-lg font-bold gradient-text hidden sm:inline">
          CollabWrite
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-dark-300 hover:text-dark-100 transition-colors text-sm"
        >
          <Layout size={16} />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>

        <div className="h-5 w-px bg-dark-600" />

        <div className="flex items-center gap-3">
          <UserAvatar username={user?.username} color={userColor} size="sm" />
          <span className="text-sm font-medium text-dark-200 hidden sm:inline">
            {user?.username}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-dark-400 hover:text-danger hover:bg-danger/10 transition-all"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
