import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '⌂' },
    { path: '/sos-history', label: 'SOS History', icon: '⏱' },
    { path: '/legal-chat', label: 'Legal Chat', icon: '💬' },
    { path: '/emergency-contacts', label: 'Emergency Contacts', icon: '☎' },
    { path: '/community-reports', label: 'Community Reports', icon: '◎' },
    { path: '/nearby-safe-places', label: 'Nearby Safe Places', icon: '📍' },

  ];

  return (
    <aside className="w-64 min-h-screen bg-[#1f1a2e] border-r border-[#352f4a] flex flex-col relative z-10">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#352f4a]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-pink-300 flex items-center justify-center">
            <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
          </div>
          <span className="text-lg font-bold">
            She<span className="text-pink-300">Shield</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 px-3 mb-3">
          Overview
        </p>
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? 'bg-gradient-to-r from-purple-300/20 to-pink-300/20 text-pink-300 border-l-2 border-pink-300'
                    : 'text-gray-400 hover:text-white hover:bg-[#241f36]'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-[#352f4a]">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-300 to-pink-300 flex items-center justify-center text-xs font-semibold text-[#26215C]">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-red-300 transition flex items-center gap-2"
        >
          ← Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;