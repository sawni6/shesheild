import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const CommunityReports = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await api.get('/sos/all');
      setIncidents(response.data.incidents || []);
    } catch (err) {
      console.error('Failed to load incidents');
    } finally {
      setLoading(false);
    }
  };

  const severityStyle = {
    high: 'bg-red-500/20 text-red-300 border-red-500/30',
    medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    low: 'bg-green-500/20 text-green-300 border-green-500/30',
  };

  return (
    <div className="min-h-screen bg-[#1a1625] text-white relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-pink-500/20 rounded-full blur-[120px]"></div>

      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-3xl mx-auto">
        <Link to="/dashboard" className="text-sm text-gray-300 hover:text-pink-300 transition">
          ← Back to Dashboard
        </Link>
        <span className="text-lg font-bold">
          Community <span className="text-pink-300">Reports</span>
        </span>
        <div className="w-24"></div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
        <p className="text-sm text-gray-400 mb-6 text-center">
          Anonymized incident reports from the SheShield community
        </p>

        {loading ? (
          <p className="text-center text-gray-500 text-sm py-8">Loading...</p>
        ) : incidents.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">No community reports yet.</p>
        ) : (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div
                key={incident._id}
                className={`bg-[#241f36] border rounded-xl p-4 flex items-center justify-between border-[#352f4a]`}
              >
                <div>
                  <p className="text-sm text-gray-300">
                    📍 {incident.location.address || `${incident.location.lat.toFixed(3)}, ${incident.location.lng.toFixed(3)}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(incident.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border ${severityStyle[incident.aiSeverity] || severityStyle.medium}`}>
                  {incident.aiSeverity?.toUpperCase() || 'PENDING'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityReports;