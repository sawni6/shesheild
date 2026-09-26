import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import socket from '../services/socket';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { user } = useAuth();

  // ---------------------------------------
  // Safety Timer
  // ---------------------------------------
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [safetyCheck, setSafetyCheck] = useState(false);

  const timerRef = useRef(null);

  // ---------------------------------------
  // SOS States
  // ---------------------------------------
  const [triggering, setTriggering] = useState(false);
  const [sosResult, setSosResult] = useState(null);
  const [error, setError] = useState('');
  const [nearbyAlert, setNearbyAlert] = useState(null);
  const [liveTracking, setLiveTracking] = useState(false);

  const trackingIntervalRef = useRef(null);
  const alertTimeoutRef = useRef(null);

  // ---------------------------------------
  // Socket.IO connection
  // ---------------------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn('No authentication token found');
      return;
    }

    socket.auth = {
      token,
    };

    socket.connect();

    const handleSOSAlert = (data) => {
      console.log('SOS alert received:', data);

      setNearbyAlert(data);

      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }

      alertTimeoutRef.current = setTimeout(() => {
        setNearbyAlert(null);
      }, 10000);
    };

    const handleConnect = () => {
      console.log('Socket connected:', socket.id);
    };

    const handleConnectError = (err) => {
      console.error('Socket connection error:', err.message);
    };

    socket.on('connect', handleConnect);
    socket.on('connect_error', handleConnectError);
    socket.on('sos-alert', handleSOSAlert);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('sos-alert', handleSOSAlert);

      if (alertTimeoutRef.current) {
        clearTimeout(alertTimeoutRef.current);
      }

      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, []);

  // ---------------------------------------
  // Cleanup live tracking
  // ---------------------------------------
  useEffect(() => {
    return () => {
      if (trackingIntervalRef.current) {
        clearInterval(trackingIntervalRef.current);
      }
    };
  }, []);

  // ---------------------------------------
  // Safety Timer Countdown
  // ---------------------------------------
  useEffect(() => {
    if (!timerActive) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          setSafetyCheck(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive]);

  // ---------------------------------------
  // Start Safety Timer
  // ---------------------------------------
  const startSafetyTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(timerMinutes * 60);
    setTimerActive(true);
    setSafetyCheck(false);
  };

  // ---------------------------------------
  // I'm Safe
  // ---------------------------------------
  const confirmSafe = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimerActive(false);
    setSafetyCheck(false);
    setTimeLeft(0);
  };

  // ---------------------------------------
  // Cancel Safety Timer
  // ---------------------------------------
  const cancelSafetyTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimerActive(false);
    setSafetyCheck(false);
    setTimeLeft(0);
  };

  // ---------------------------------------
  // Format Timer
  // ---------------------------------------
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      secs
    ).padStart(2, '0')}`;
  };

  // ---------------------------------------
  // Trigger SOS
  // ---------------------------------------
  const handleSOS = () => {
    setError('');
    setSosResult(null);

    if (!navigator.geolocation) {
      setError(
        'Geolocation is not supported by your browser.'
      );
      return;
    }

    setTriggering(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          console.log('Current location:', {
            latitude,
            longitude,
          });

          const response = await api.post('/sos/trigger', {
            lat: latitude,
            lng: longitude,
            address: 'Current Location',
          });

          console.log('SOS response:', response.data);

          setSosResult(response.data);

          const incidentId = response.data?.incident?._id;

          if (incidentId) {
            startLiveTracking(incidentId);
          } else {
            console.warn(
              'Incident ID not found in SOS response'
            );
          }
        } catch (err) {
          console.error('SOS trigger error:', err);

          setError(
            err.response?.data?.message ||
              'Failed to trigger SOS'
          );
        } finally {
          setTriggering(false);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);

        if (err.code === 1) {
          setError(
            'Location permission denied. Please allow location access.'
          );
        } else if (err.code === 2) {
          setError(
            'Unable to determine your current location.'
          );
        } else if (err.code === 3) {
          setError(
            'Location request timed out. Please try again.'
          );
        } else {
          setError(
            'Unable to get your location. Please try again.'
          );
        }

        setTriggering(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ---------------------------------------
  // Start Live Tracking
  // ---------------------------------------
  const startLiveTracking = (incidentId) => {
    if (!incidentId) {
      console.error('Incident ID is missing');
      return;
    }

    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
    }

    setLiveTracking(true);

    const updateLocation = () => {
      if (!navigator.geolocation) {
        console.error(
          'Geolocation is not supported'
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            console.log(
              'Sending live location:',
              lat,
              lng
            );

            await api.post('/sos/update-location', {
              incidentId,
              lat,
              lng,
            });
          } catch (err) {
            console.error(
              'Location update failed:',
              err.response?.data || err.message
            );
          }
        },
        (err) => {
          console.error(
            'Failed to get current position:',
            err
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    updateLocation();

    trackingIntervalRef.current = setInterval(
      updateLocation,
      10000
    );
  };

  // ---------------------------------------
  // Stop Live Tracking
  // ---------------------------------------
  const stopLiveTracking = () => {
    if (trackingIntervalRef.current) {
      clearInterval(trackingIntervalRef.current);
      trackingIntervalRef.current = null;
    }

    setLiveTracking(false);

    console.log('Live location tracking stopped');
  };

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <div className="min-h-screen bg-[#1a1625] text-white flex relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-100px] left-[300px] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Sidebar */}
      <Sidebar />

      <main className="flex-1 relative z-10 px-10 py-8 overflow-y-auto">

        {/* AI Monitoring */}
        <div className="flex items-center justify-end mb-6">
          <span className="text-xs bg-teal-500/10 text-green-300 border border-green-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            AI monitoring active
          </span>
        </div>

        {/* Community Alert */}
        {nearbyAlert && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-200 text-sm px-5 py-3 rounded-xl flex items-center justify-between mb-6">

            <span>
              ⚠️ Community alert —{' '}
              {nearbyAlert.severity?.toUpperCase() ||
                'UNKNOWN'}{' '}
              severity incident reported nearby
            </span>

            <button
              onClick={() => setNearbyAlert(null)}
              className="text-red-300 hover:text-white ml-4"
            >
              ✕
            </button>

          </div>
        )}

        {/* ======================================
            MAIN HERO / SOS
        ====================================== */}
        <div className="bg-gradient-to-br from-[#2a2340] to-[#241f36] border border-[#352f4a] rounded-2xl p-8 mb-8 relative overflow-hidden">

          <div className="inline-block text-xs text-pink-300 bg-pink-300/10 border border-pink-300/20 px-3 py-1 rounded-full mb-4">
            ✨ AI-powered safety companion
          </div>

          <h1 className="text-3xl font-bold mb-1">
            Good evening,{' '}
            <span className="text-pink-300">
              {user?.name || 'there'}
            </span>
          </h1>

          <p className="text-gray-400 mb-6">
            Your safety network is active and monitoring.
          </p>

          {/* SOS Button */}
          <div className="flex gap-3">

            <button
              onClick={handleSOS}
              disabled={triggering}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 font-semibold hover:opacity-90 transition disabled:opacity-60 flex items-center gap-2"
            >
              {triggering
                ? 'Sending alert...'
                : '🆘 Trigger SOS'}
            </button>

          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-sm max-w-md">
              {error}
            </div>
          )}

          {/* SOS Result */}
          {sosResult?.incident && (
            <div className="mt-5 bg-[#1a1625] border border-[#352f4a] rounded-xl p-5 max-w-md">

              <div className="flex items-center justify-between mb-2">

                <span className="text-sm font-semibold">
                  Alert sent
                </span>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    sosResult.incident.aiSeverity ===
                    'high'
                      ? 'bg-red-500/20 text-red-300'
                      : sosResult.incident.aiSeverity ===
                        'medium'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-green-500/20 text-green-300'
                  }`}
                >
                  {sosResult.incident.aiSeverity?.toUpperCase() ||
                    'UNKNOWN'}
                </span>

              </div>

              <p className="text-sm text-gray-400">
                {sosResult.incident.aiSummary ||
                  'SOS alert has been sent successfully.'}
              </p>

              {/* Live Tracking */}
              {liveTracking && (
                <div className="mt-4 flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">

                  <span className="text-xs text-red-300 flex items-center gap-2">

                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></span>

                    Live location tracking active

                  </span>

                  <button
                    onClick={stopLiveTracking}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Stop
                  </button>

                </div>
              )}

            </div>
          )}

        </div>

        {/* ======================================
            SAFETY TIMER
        ====================================== */}
        <div className="bg-[#241f36] border border-[#352f4a] rounded-2xl p-6 mb-8">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-lg font-semibold">
                🛡️ Safety Timer
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Set a timer and confirm that you are safe.
              </p>
            </div>

            {timerActive && (
              <span className="text-xs bg-green-500/10 text-green-300 border border-green-500/20 px-3 py-1.5 rounded-full">
                Timer Active
              </span>
            )}

          </div>

          {/* Timer Selection */}
          {!timerActive && !safetyCheck && (
            <>
              <div className="flex gap-3 mb-5">

                {[15, 30, 60].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => setTimerMinutes(minutes)}
                    className={`px-5 py-2.5 rounded-xl border transition ${
                      timerMinutes === minutes
                        ? 'bg-pink-500/15 border-pink-400 text-pink-300'
                        : 'bg-[#1a1625] border-[#352f4a] text-gray-400 hover:text-white'
                    }`}
                  >
                    {minutes} min
                  </button>
                ))}

              </div>

              <button
                onClick={startSafetyTimer}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold hover:opacity-90 transition"
              >
                🛡️ Start Safety Timer
              </button>
            </>
          )}

          {/* Active Timer */}
          {timerActive && (
            <div className="text-center py-5">

              <p className="text-xs text-gray-500 mb-2">
                Safety check in
              </p>

              <p className="text-5xl font-bold text-pink-300 tracking-wider">
                {formatTime(timeLeft)}
              </p>

              <div className="flex justify-center gap-3 mt-6">

                <button
                  onClick={confirmSafe}
                  className="px-5 py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 hover:bg-green-500/20 transition"
                >
                  ✓ I'm Safe
                </button>

                <button
                  onClick={cancelSafetyTimer}
                  className="px-5 py-2.5 rounded-xl bg-gray-500/10 border border-gray-500/20 text-gray-400 hover:text-white transition"
                >
                  Cancel
                </button>

              </div>

            </div>
          )}

          {/* Safety Check After Timer */}
          {safetyCheck && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">

              <div className="text-center">

                <p className="text-3xl mb-2">
                  ⚠️
                </p>

                <h3 className="text-lg font-semibold text-red-300">
                  Safety Check
                </h3>

                <p className="text-sm text-gray-400 mt-1 mb-5">
                  Your safety timer has ended. Are you safe?
                </p>

                <div className="flex justify-center gap-3">

                  <button
                    onClick={confirmSafe}
                    className="px-5 py-2.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-300 hover:bg-green-500/20 transition"
                  >
                    ✓ I'm Safe
                  </button>

                  <button
                    onClick={handleSOS}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 font-semibold hover:opacity-90 transition"
                  >
                    🆘 Trigger SOS
                  </button>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* ======================================
            DASHBOARD STATS
        ====================================== */}
        <div className="grid grid-cols-4 gap-4">

          {/* Emergency Contacts */}
          <div className="bg-[#241f36] border-t-2 border-pink-400 rounded-xl p-5">

            <p className="text-2xl font-bold text-pink-300">
              {user?.emergencyContacts?.length || 0}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Emergency Contacts
            </p>

          </div>

          {/* Safety Status */}
          <div className="bg-[#241f36] border-t-2 border-purple-400 rounded-xl p-5">

            <p className="text-2xl font-bold text-purple-300">
              {liveTracking ? 'Tracking' : 'Active'}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Safety Status
            </p>

          </div>

          {/* AI Model */}
          <div className="bg-[#241f36] border-t-2 border-teal-400 rounded-xl p-5">

            <p className="text-2xl font-bold text-teal-300">
              Llama 3.3
            </p>

            <p className="text-xs text-gray-500 mt-1">
              AI Model
            </p>

          </div>

          {/* Monitoring */}
          <div className="bg-[#241f36] border-t-2 border-amber-400 rounded-xl p-5">

            <p className="text-2xl font-bold text-amber-300">
              24/7
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Monitoring
            </p>

          </div>

        </div>

        {/* ======================================
            EMERGENCY HELPLINES
        ====================================== */}
        <div className="mt-8">

          <p className="text-xs text-gray-500 mb-3">
            Emergency helplines
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-md">

            {/* National Emergency */}
            <a
              href="tel:112"
              className="bg-[#241f36] border border-[#352f4a] hover:border-pink-300/50 rounded-xl p-4 transition flex items-center justify-between"
            >

              <div>
                <p className="text-sm font-semibold">
                  National Emergency
                </p>

                <p className="text-xs text-gray-500">
                  112
                </p>
              </div>

              <span className="text-pink-300">
                📞
              </span>

            </a>

            {/* Women Helpline */}
            <a
              href="tel:1091"
              className="bg-[#241f36] border border-[#352f4a] hover:border-pink-300/50 rounded-xl p-4 transition flex items-center justify-between"
            >

              <div>
                <p className="text-sm font-semibold">
                  Women Helpline
                </p>

                <p className="text-xs text-gray-500">
                  1091
                </p>
              </div>

              <span className="text-pink-300">
                📞
              </span>

            </a>

          </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;