
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ChatAssistant from './components/ChatAssistant';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Planner from './pages/Planner';
import CountryDetail from './pages/CountryDetail';
import { Itinerary } from './types';

// Functional Dashboard to show saved trips
const Dashboard = () => {
  const [trips, setTrips] = useState<Itinerary[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_trips') || '[]');
    setTrips(saved);
  }, []);

  const deleteTrip = (id: string) => {
    const updated = trips.filter(t => t.id !== id);
    localStorage.setItem('saved_trips', JSON.stringify(updated));
    setTrips(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">My Saved Trips</h1>
          <p className="text-gray-500">Manage and revisit your personalized travel plans.</p>
        </div>
        <Link to="/planner" className="px-6 py-3 bg-sky-600 text-white rounded-2xl font-bold hover:bg-sky-700 transition-all flex items-center gap-2 shadow-lg shadow-sky-100">
          <i className="fas fa-plus"></i>
          Plan New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 text-3xl mx-auto mb-6">
            <i className="fas fa-heart"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-900">No saved journeys yet</h3>
          <p className="text-gray-500 mt-2">Start exploring or planning to build your collection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-500">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={`https://loremflickr.com/600/400/${encodeURIComponent(trip.destination)},travel/all`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt={trip.destination}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-5 left-6 text-white">
                  <h3 className="text-xl font-bold">{trip.destination}</h3>
                  <p className="text-xs text-sky-300 font-bold uppercase tracking-widest">
                    {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <button 
                  onClick={() => deleteTrip(trip.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur rounded-full text-white hover:bg-red-500 transition-colors flex items-center justify-center"
                >
                  <i className="fas fa-trash-alt text-sm"></i>
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xs font-bold">
                      {trip.dailyPlans.length}
                    </span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Days</span>
                  </div>
                  <span className="text-lg font-black text-gray-900">${trip.totalEstimatedCost}</span>
                </div>
                <button className="w-full py-3 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-sky-50 hover:text-sky-600 transition-all">
                  View Full Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Login = () => <div className="p-12 text-center text-gray-500">Login Page Coming Soon...</div>;
const Signup = () => <div className="p-12 text-center text-gray-500">Signup Page Coming Soon...</div>;
const About = () => <div className="p-12 text-center text-gray-500">About PlanViaje Coming Soon...</div>;

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/country/:name" element={<CountryDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <ChatAssistant />
      </div>
    </Router>
  );
};

export default App;
