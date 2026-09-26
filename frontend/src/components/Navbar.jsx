import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ backLink }) => {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-4xl mx-auto w-full">
      {backLink ? (
        <Link to={backLink} className="text-sm text-gray-300 hover:text-pink-300 transition">
          ← Back to Dashboard
        </Link>
      ) : (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-pink-300 flex items-center justify-center">
            <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
          </div>
          <span className="text-xl font-bold">
            She<span className="text-pink-300">Shield</span>
          </span>
        </div>
      )}

      {!backLink && (
        <div className="flex items-center gap-6">
          <Link to="/legal-chat" className="text-sm text-gray-300 hover:text-pink-300 transition">
            Legal Chat
          </Link>
          <Link to="/emergency-contacts" className="text-sm text-gray-300 hover:text-pink-300 transition">
            Emergency Contacts
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-300 hover:text-white transition"
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;