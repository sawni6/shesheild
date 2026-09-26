import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', phone: '', relation: '' });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/user/emergency-contacts');
      setContacts(response.data.emergencyContacts || []);
    } catch (err) {
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setAdding(true);
    try {
      const response = await api.post('/user/emergency-contacts', formData);
      setContacts(response.data.emergencyContacts);
      setFormData({ name: '', phone: '', relation: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add contact');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (contactId) => {
    try {
      const response = await api.delete(`/user/emergency-contacts/${contactId}`);
      setContacts(response.data.emergencyContacts);
    } catch (err) {
      setError('Failed to delete contact');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1625] text-white relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-pink-500/20 rounded-full blur-[120px]"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-3xl mx-auto">
        <Link to="/dashboard" className="text-sm text-gray-300 hover:text-pink-300 transition">
          ← Back to Dashboard
        </Link>
        <span className="text-lg font-bold">
          Emergency <span className="text-pink-300">Contacts</span>
        </span>
        <div className="w-24"></div>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto px-6 pb-16">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Add Contact Form */}
        <div className="bg-[#241f36] border border-[#352f4a] rounded-xl p-6 mb-8">
          <h2 className="text-sm font-semibold mb-4">Add a Trusted Contact</h2>
          <form onSubmit={handleAdd} className="grid md:grid-cols-3 gap-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="px-4 py-2.5 bg-[#1a1625] border border-[#352f4a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="px-4 py-2.5 bg-[#1a1625] border border-[#352f4a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            />
            <input
              type="text"
              name="relation"
              placeholder="Relation (e.g. Mother)"
              value={formData.relation}
              onChange={handleChange}
              className="px-4 py-2.5 bg-[#1a1625] border border-[#352f4a] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm"
            />
            <button
              type="submit"
              disabled={adding}
              className="md:col-span-3 bg-gradient-to-r from-purple-300 to-pink-300 text-[#26215C] font-semibold py-2.5 rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm"
            >
              {adding ? 'Adding...' : '+ Add Contact'}
            </button>
          </form>
        </div>

        {/* Contacts List */}
        <div>
          <h2 className="text-sm font-semibold mb-4 text-gray-400">
            Your Contacts ({contacts.length})
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 text-sm">Loading...</p>
          ) : contacts.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">
              No emergency contacts yet. Add one above.
            </p>
          ) : (
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact._id}
                  className="bg-[#241f36] border border-[#352f4a] rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-sm">{contact.name}</p>
                    <p className="text-xs text-gray-500">
                      {contact.phone} {contact.relation && `• ${contact.relation}`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="text-xs text-red-400 hover:text-red-300 transition px-3 py-1.5 border border-red-400/30 rounded-lg"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyContacts;