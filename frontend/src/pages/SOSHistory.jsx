import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const SOSHistory = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/sos/history');
      setIncidents(response.data.incidents || []);
    } catch (err) {
      console.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const severityStyle = {
    high: 'bg-red-500/20 text-red-300',
    medium: 'bg-amber-500/20 text-amber-300',
    low: 'bg-green-500/20 text-green-300',
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
          SOS <span className="text-pink-300">History</span>
        </span>
        <div className="w-24"></div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
        {loading ? (
          <p className="text-center text-gray-500 text-sm py-8">Loading...</p>
        ) : incidents.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-8">
            No SOS incidents recorded yet.
          </p>
        ) : (
          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident._id}
                className="bg-[#241f36] border border-[#352f4a] rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">
                    {new Date(incident.createdAt).toLocaleString('en-IN')}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      severityStyle[incident.aiSeverity] || severityStyle.medium
                    }`}
                  >
                    {incident.aiSeverity?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{incident.aiSummary}</p>
                <p className="text-xs text-gray-500">
                   {incident.location.address || `${incident.location.lat}, ${incident.location.lng}`}
                </p>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                    incident.status === 'active'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {incident.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSHistory;