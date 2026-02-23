
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateItinerary, searchTravelDeals } from '../services/geminiService';
import { Itinerary, SearchResults, Activity } from '../types';
import { COUNTRIES } from '../constants';

declare const L: any;

const Planner: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialDest = searchParams.get('destination') || '';

  const [formData, setFormData] = useState({
    destination: initialDest,
    startDate: '',
    endDate: '',
    budget: 1500,
    style: 'adventure'
  });
  
  const [loading, setLoading] = useState(false);
  const [searchingDeals, setSearchingDeals] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [travelDeals, setTravelDeals] = useState<SearchResults | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (itinerary && (viewMode === 'map' || window.innerWidth >= 1024)) {
      const allActivities = itinerary.dailyPlans.flatMap(day => day.activities);
      const locations = allActivities
        .filter(act => act.location)
        .map(act => [act.location!.lat, act.location!.lng]);

      if (locations.length > 0) {
        setTimeout(() => {
          if (!mapRef.current && mapContainerRef.current) {
            mapRef.current = L.map('itinerary-map').setView(locations[0], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);
          } else if (mapRef.current) {
            mapRef.current.eachLayer((layer: any) => {
              if (layer instanceof L.Marker) mapRef.current.removeLayer(layer);
            });
          }

          if (mapRef.current) {
            const markers: any[] = [];
            allActivities.forEach(act => {
              if (act.location) {
                const marker = L.marker([act.location.lat, act.location.lng])
                  .addTo(mapRef.current)
                  .bindPopup(`<b>${act.title}</b><br>${act.time}`);
                markers.push(marker);
              }
            });

            if (markers.length > 0) {
              const group = L.featureGroup(markers);
              mapRef.current.fitBounds(group.getBounds().pad(0.2));
            }
          }
        }, 200);
      }
    }
  }, [itinerary, viewMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setItinerary(null);
    setTravelDeals(null);
    try {
      const result = await generateItinerary(formData);
      setItinerary(result);
    } catch (err) {
      alert("My code had an error. Maybe try a different city?");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchDeals = async () => {
    if (!itinerary) return;
    setSearchingDeals(true);
    try {
      const result = await searchTravelDeals({
        destination: itinerary.destination,
        startDate: itinerary.startDate,
        endDate: itinerary.endDate,
        budget: itinerary.budget
      });
      setTravelDeals(result);
    } catch (err) {
      alert("My search script timed out. 😕");
    } finally {
      setSearchingDeals(false);
    }
  };

  const saveItinerary = () => {
    setSaveStatus('saving');
    const saved = JSON.parse(localStorage.getItem('saved_trips') || '[]');
    localStorage.setItem('saved_trips', JSON.stringify([...saved, itinerary]));
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Planner Sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white p-8 rounded-3xl shadow-lg border-4 border-sky-400">
            <h2 className="text-2xl font-bold mb-8 text-slate-800 flex items-center gap-2">
              <span>✍️</span> My Trip Planner
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Where to go?</label>
                <input 
                  type="text" 
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-sky-400 outline-none transition-all font-bold"
                  placeholder="e.g. Tokyo, Paris..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Start Date</label>
                  <input 
                    type="date" 
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">End Date</label>
                  <input 
                    type="date" 
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Budget ($)</label>
                  <span className="text-lg font-bold text-sky-600">${formData.budget}</span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="10000" 
                  step="500"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: parseInt(e.target.value)})}
                  className="w-full accent-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-2 block">Vibe</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Balanced', 'Adventure', 'Culture', 'Relaxing', 'City', 'Family'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({...formData, style: s.toLowerCase()})}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border-2 transition-all ${
                        formData.style === s.toLowerCase() 
                          ? 'bg-sky-500 text-white border-sky-500' 
                          : 'bg-white text-slate-400 border-slate-50 hover:border-sky-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 shadow-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? "Running script... ⏳" : "Build Itinerary! ✨"}
              </button>
            </form>
          </div>
        </div>

        {/* Display Panel */}
        <div className="w-full lg:w-2/3">
          {!itinerary && !loading && (
            <div className="h-full bg-white rounded-3xl border-4 border-dashed border-slate-100 flex flex-col items-center justify-center p-12 text-center">
              <div className="text-6xl mb-6">🏜️</div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Nothing planned yet...</h3>
              <p className="text-slate-400">Fill out the form and my app will find the coolest stuff for you!</p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="font-bold text-sky-600">Alex's code is working... hold on! 🪄</p>
            </div>
          )}

          {itinerary && (
            <div className="space-y-10">
              {/* Header */}
              <div className="bg-sky-500 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
                <h1 className="text-4xl font-bold mb-2">{itinerary.destination} 🌍</h1>
                <p className="opacity-90 font-bold">Trip from {itinerary.startDate} to {itinerary.endDate}</p>
                <div className="absolute top-1/2 right-8 -translate-y-1/2 bg-white/20 p-6 rounded-2xl backdrop-blur-md border border-white/20 text-center">
                   <p className="text-xs font-bold uppercase mb-1">Total Cost</p>
                   <p className="text-3xl font-bold">${itinerary.totalEstimatedCost}</p>
                </div>
              </div>

              {/* Flight */}
              {itinerary.suggestedFlight && (
                <div className="bg-yellow-50 border-4 border-yellow-200 rounded-3xl p-8">
                  <h3 className="text-sm font-bold text-yellow-800 mb-6 flex items-center gap-2 uppercase">
                    ✈️ Recommended Flight
                  </h3>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-xl font-bold">{itinerary.suggestedFlight.airline}</p>
                      <p className="text-xs opacity-60">#{itinerary.suggestedFlight.flightNumber}</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-4 px-8">
                      <div className="text-center font-bold">{itinerary.suggestedFlight.departureTime}</div>
                      <div className="flex-1 h-px bg-yellow-300 relative">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-50 px-2 text-xs">✈️</span>
                      </div>
                      <div className="text-center font-bold">{itinerary.suggestedFlight.arrivalTime}</div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-yellow-800">${itinerary.suggestedFlight.price}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl w-fit mx-auto border-2 border-slate-200">
                 <button onClick={() => setViewMode('list')} className={`px-6 py-2 rounded-lg text-xs font-bold ${viewMode === 'list' ? 'bg-white shadow text-sky-600' : 'text-slate-400'}`}>List View</button>
                 <button onClick={() => setViewMode('map')} className={`px-6 py-2 rounded-lg text-xs font-bold ${viewMode === 'map' ? 'bg-white shadow text-sky-600' : 'text-slate-400'}`}>Map View</button>
              </div>

              {viewMode === 'map' && (
                <div className="bg-white p-2 rounded-2xl shadow-lg border-2 border-sky-100">
                   <div id="itinerary-map" ref={mapContainerRef}></div>
                </div>
              )}

              {viewMode === 'list' && (
                <div className="space-y-12">
                  {itinerary.dailyPlans.map(day => (
                    <div key={day.day}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-sky-500 text-white rounded-xl flex items-center justify-center font-bold text-2xl shadow-lg">
                          {day.day}
                        </div>
                        <h3 className="text-2xl font-bold">{day.title}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {day.activities.map((act, i) => (
                          <div key={i} className="bg-white rounded-2xl shadow-md border-2 border-slate-50 overflow-hidden flex flex-col">
                            <img src={`https://loremflickr.com/600/400/${encodeURIComponent(act.title)},travel/all`} className="w-full h-40 object-cover" alt={act.title} />
                            <div className="p-5 flex-1 flex flex-col">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg">{act.title}</h4>
                                <span className="text-xs bg-sky-50 text-sky-600 px-2 py-1 rounded-md font-bold">{act.time}</span>
                              </div>
                              <p className="text-slate-500 text-sm mb-4 flex-1">{act.description}</p>
                              <div className="text-xs font-bold text-slate-300">Cost: ${act.cost}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Suite */}
              <div className="flex flex-col sm:flex-row gap-4 pt-10">
                 <button onClick={saveItinerary} className="flex-1 py-4 bg-white border-2 border-sky-400 rounded-xl font-bold text-sky-600 hover:bg-sky-50">
                   {saveStatus === 'saved' ? "Saved! 👍" : "Save Trip"}
                 </button>
                 <button onClick={handleSearchDeals} className="flex-1 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-black shadow-lg">
                   Check Real Prices
                 </button>
              </div>

              {travelDeals && (
                <div className="bg-white p-8 rounded-2xl shadow-xl border-4 border-sky-100">
                  <h3 className="text-xl font-bold mb-4">Real Deals I Found:</h3>
                  <div className="prose prose-sm text-slate-600 whitespace-pre-wrap">
                    {travelDeals.text}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Planner;
