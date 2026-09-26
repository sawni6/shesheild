import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';

const NearbySafePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: '🛡️' },
    { id: 'police', name: 'Police', icon: '🚓' },
    { id: 'hospital', name: 'Hospital', icon: '🏥' },
    { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
    { id: 'fire', name: 'Fire Station', icon: '🚒' },
  ];

  const getPlaceType = (tags = {}) => {
    if (
      tags.amenity === 'police'
    ) {
      return 'police';
    }

    if (
      tags.amenity === 'hospital' ||
      tags.healthcare === 'hospital'
    ) {
      return 'hospital';
    }

    if (
      tags.amenity === 'pharmacy' ||
      tags.healthcare === 'pharmacy'
    ) {
      return 'pharmacy';
    }

    if (
      tags.amenity === 'fire_station'
    ) {
      return 'fire';
    }

    return 'other';
  };

  const getPlaceIcon = (type) => {
    switch (type) {
      case 'police':
        return '🚓';

      case 'hospital':
        return '🏥';

      case 'pharmacy':
        return '💊';

      case 'fire':
        return '🚒';

      default:
        return '📍';
    }
  };

  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    const R = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  };

  const fetchNearbyPlaces = (latitude, longitude) => {
    const query = `
      [out:json][timeout:25];

      (
        node["amenity"="police"](around:5000,${latitude},${longitude});
        way["amenity"="police"](around:5000,${latitude},${longitude});

        node["amenity"="hospital"](around:5000,${latitude},${longitude});
        way["amenity"="hospital"](around:5000,${latitude},${longitude});

        node["amenity"="pharmacy"](around:5000,${latitude},${longitude});
        way["amenity"="pharmacy"](around:5000,${latitude},${longitude});

        node["amenity"="fire_station"](around:5000,${latitude},${longitude});
        way["amenity"="fire_station"](around:5000,${latitude},${longitude});
      );

      out center;
    `;

    return fetch(
      'https://overpass-api.de/api/interpreter',
      {
        method: 'POST',
        body: query,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            'Failed to load nearby places'
          );
        }

        return response.json();
      })
      .then((data) => {
        const formattedPlaces =
          data.elements
            .map((place) => {
              const lat =
                place.lat ??
                place.center?.lat;

              const lng =
                place.lon ??
                place.center?.lon;

              if (
                !Number.isFinite(Number(lat)) ||
                !Number.isFinite(Number(lng))
              ) {
                return null;
              }

              const type =
                getPlaceType(place.tags);

              const distance =
                calculateDistance(
                  latitude,
                  longitude,
                  Number(lat),
                  Number(lng)
                );

              return {
                id: `${place.type}-${place.id}`,
                name:
                  place.tags?.name ||
                  place.tags?.['name:en'] ||
                  'Unnamed place',
                type,
                icon: getPlaceIcon(type),
                lat: Number(lat),
                lng: Number(lng),
                distance,
                address:
                  place.tags?.['addr:street'] ||
                  'Address not available',
                phone:
                  place.tags?.phone ||
                  null,
              };
            })
            .filter(Boolean)
            .sort(
              (a, b) =>
                a.distance - b.distance
            );

        setPlaces(formattedPlaces);
      });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(
        'Geolocation is not supported by your browser.'
      );
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await fetchNearbyPlaces(
            position.coords.latitude,
            position.coords.longitude
          );
        } catch (err) {
          console.error(err);

          setError(
            'Unable to load nearby safe places.'
          );
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError(
          'Location permission is required to find nearby safe places.'
        );
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const filteredPlaces =
    selectedType === 'all'
      ? places
      : places.filter(
          (place) =>
            place.type === selectedType
        );

  const openDirections = (place) => {
    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&destination=${place.lat},${place.lng}`;

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="min-h-screen bg-[#1a1625] text-white flex">

      <Sidebar />

      <main className="flex-1 px-10 py-8 overflow-y-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            📍 Nearby{' '}
            <span className="text-pink-300">
              Safe Places
            </span>
          </h1>

          <p className="text-gray-400 mt-2">
            Find emergency services near your
            current location.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedType(category.id)
              }
              className={`px-4 py-2 rounded-xl border transition ${
                selectedType === category.id
                  ? 'bg-pink-500/20 border-pink-400 text-pink-300'
                  : 'bg-[#241f36] border-[#352f4a] text-gray-300 hover:border-pink-400/50'
              }`}
            >
              {category.icon}{' '}
              {category.name}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-[#241f36] border border-[#352f4a] rounded-2xl p-8 max-w-xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin"></div>

              <p className="text-gray-400">
                Finding safe places near you...
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 max-w-xl">
            <p className="text-red-300 font-medium">
              ⚠️ {error}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Please allow location access and
              try again.
            </p>
          </div>
        )}

        {/* No places */}
        {!loading &&
          !error &&
          filteredPlaces.length === 0 && (
            <div className="bg-[#241f36] border border-[#352f4a] rounded-2xl p-8 max-w-xl text-center">
              <p className="text-4xl mb-3">
                🔍
              </p>

              <p className="text-gray-400">
                No nearby places found.
              </p>
            </div>
          )}

        {/* Places */}
        {!loading &&
          !error &&
          filteredPlaces.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl">

              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-[#241f36] border border-[#352f4a] hover:border-pink-400/40 rounded-2xl p-5 transition"
                >
                  <div className="flex items-start justify-between gap-4">

                    <div className="flex gap-4">

                      <div className="w-12 h-12 bg-[#2d2741] rounded-xl flex items-center justify-center text-2xl">
                        {place.icon}
                      </div>

                      <div>
                        <h2 className="font-semibold text-white">
                          {place.name}
                        </h2>

                        <p className="text-xs text-gray-500 mt-1 capitalize">
                          {place.type.replace(
                            '_',
                            ' '
                          )}
                        </p>

                        <p className="text-sm text-pink-300 mt-2">
                          {place.distance < 1
                            ? `${Math.round(
                                place.distance * 1000
                              )} m away`
                            : `${place.distance.toFixed(
                                1
                              )} km away`}
                        </p>

                        {place.address !==
                          'Address not available' && (
                          <p className="text-xs text-gray-500 mt-1">
                            {place.address}
                          </p>
                        )}
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        openDirections(place)
                      }
                      className="shrink-0 px-3 py-2 bg-pink-500/10 text-pink-300 border border-pink-400/20 rounded-lg text-xs hover:bg-pink-500/20 transition"
                    >
                      Directions
                    </button>

                  </div>
                </div>
              ))}

            </div>
          )}

      </main>
    </div>
  );
};

export default NearbySafePlaces;