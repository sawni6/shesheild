import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#1a1625] text-white overflow-hidden relative">
      {/* Floating gradient orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute top-[300px] right-[-150px] w-[350px] h-[350px] bg-pink-500/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-100px] left-[30%] w-[300px] h-[300px] bg-purple-700/20 rounded-full blur-[120px]"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-pink-300 flex items-center justify-center">
            <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
          </div>
          <span className="text-xl font-bold">
            She<span className="text-pink-300">Shield</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-gray-300">
          <a href="#features" className="hover:text-pink-300 transition">Features</a>
          <a href="#workflow" className="hover:text-pink-300 transition">How it Works</a>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition">
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm bg-gradient-to-r from-purple-300 to-pink-300 hover:opacity-90 text-[#26215C] font-semibold rounded-lg transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative z-10 max-w-5xl mx-auto text-center px-6 pt-16 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-400/30 bg-pink-400/10 text-pink-300 text-xs font-medium mb-6">
          ✨ AI-Powered Safety Companion
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Your Safety, <span className="text-purple-300">Always Guarded</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          Instant SOS alerts, AI-powered incident assessment, and 24/7 legal guidance —
          all in one app built to keep you and your loved ones informed and protected.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/signup"
            className="px-6 py-3 bg-gradient-to-r from-purple-300 to-pink-300 hover:opacity-90 text-[#26215C] font-semibold rounded-lg transition flex items-center gap-2"
          >
            Get Started Free →
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-gray-700 hover:border-pink-300 rounded-lg transition"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 bg-[#241f36] border border-[#352f4a] rounded-2xl p-6 max-w-3xl mx-auto shadow-2xl shadow-purple-500/10">
          <div className="flex gap-2 mb-6">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="w-3 h-3 rounded-full bg-pink-300"></span>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="bg-[#1a1625] border border-[#352f4a] rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold">Good evening, Sawni</p>
                  <p className="text-sm text-gray-500">Your safety network is active</p>
                </div>
                <span className="text-xs bg-purple-300/20 text-purple-200 px-2 py-1 rounded-full">
                  All Safe
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#241f36] rounded-lg p-3 text-center">
                  <p className="text-pink-300 font-bold text-lg">2</p>
                  <p className="text-xs text-gray-500">Contacts</p>
                </div>
                <div className="bg-[#241f36] rounded-lg p-3 text-center">
                  <p className="text-purple-300 font-bold text-lg">0</p>
                  <p className="text-xs text-gray-500">Active SOS</p>
                </div>
                <div className="bg-[#241f36] rounded-lg p-3 text-center">
                  <p className="text-pink-300 font-bold text-lg">5</p>
                  <p className="text-xs text-gray-500">Chat Sessions</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1a1625] border border-[#352f4a] rounded-xl p-5 flex flex-col justify-center items-center">
              <div className="text-4xl font-bold text-purple-300 mb-1">AI</div>
              <p className="text-sm text-gray-500 text-center">Severity Detection Active</p>
              <p className="text-xs text-gray-600 mt-2 text-center">Powered by Llama 3.3</p>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Built for Real Emergencies</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Every feature is designed around one goal — getting you help, fast, with intelligence baked in.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'One-Tap SOS Alert', desc: 'Trigger an emergency alert instantly with your live location shared to trusted contacts.', color: 'pink' },
            { title: 'AI Severity Detection', desc: 'Groq-powered AI instantly classifies incident severity and generates a responder summary.', color: 'purple' },
            { title: 'Legal Rights Chatbot', desc: 'Get instant, empathetic guidance on Indian law — harassment, workplace rights, and more.', color: 'pink' },
            { title: 'Emergency Contacts', desc: 'Add trusted contacts who get notified the moment an SOS is triggered.', color: 'purple' },
            { title: 'Real-time Alerts', desc: 'Socket-powered live broadcasting ensures no delay when every second counts.', color: 'pink' },
            { title: 'Incident History', desc: 'Review past incidents with AI-generated summaries for your records or reports.', color: 'purple' },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-[#241f36] border border-[#352f4a] rounded-xl p-6 hover:border-pink-300/50 transition group"
            >
              <div
                className={`w-10 h-10 rounded-lg mb-4 flex items-center justify-center ${
                  f.color === 'pink' ? 'bg-pink-300/10 text-pink-300' : 'bg-purple-300/10 text-purple-300'
                }`}
              >
                ●
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-14">How SheShield Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { num: '01', title: 'Sign Up', desc: 'Create your account and add trusted emergency contacts.' },
            { num: '02', title: 'Trigger SOS', desc: 'One tap shares your location and raises the alert.' },
            { num: '03', title: 'AI Assesses', desc: 'Severity and summary generated instantly for responders.' },
            { num: '04', title: 'Help Arrives', desc: 'Contacts are notified and can act immediately.' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-4xl font-bold text-pink-300/30 mb-2">{s.num}</div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 text-center px-6 py-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Your Safety Shouldn't Wait</h2>
        <p className="text-gray-400 mb-8">
          Join SheShield today and have an AI-powered safety net always by your side.
        </p>
        <Link
          to="/signup"
          className="inline-block px-8 py-3 bg-gradient-to-r from-purple-300 to-pink-300 hover:opacity-90 text-[#26215C] font-semibold rounded-lg transition"
        >
          Create Free Account
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#352f4a] px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 max-w-7xl mx-auto text-sm text-gray-500">
        <p>© 2026 SheShield • Built by Sawni Rajak</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-pink-300 transition">Privacy Policy</a>
          <a href="#" className="hover:text-pink-300 transition">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;