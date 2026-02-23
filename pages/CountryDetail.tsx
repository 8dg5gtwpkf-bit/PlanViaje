
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { COUNTRIES } from '../constants';
import { getCountryDetails } from '../services/geminiService';
import { Country } from '../types';

const CountryDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [details, setDetails] = useState<Partial<Country>>({});
  const [loading, setLoading] = useState(true);

  const country = COUNTRIES.find(c => c.name.toLowerCase() === name?.toLowerCase());

  useEffect(() => {
    const fetchDetails = async () => {
      if (!name) return;
      setLoading(true);
      try {
        const data = await getCountryDetails(name);
        setDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [name]);

  if (!country) return <div className="p-12 text-center">Country not found.</div>;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-[65vh]">
        <img 
          src={`https://loremflickr.com/1920/1080/${encodeURIComponent(country.name + ' scenic landscape')}/all`} 
          alt={country.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1920&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 text-white max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="w-full md:w-2/3">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-yellow-400 text-blue-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                {country.continent}
              </span>
              <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold border border-white/20">
                Capital: {country.capital}
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter drop-shadow-2xl">
              {country.name}!
            </h1>
            <p className="text-xl md:text-2xl text-slate-200 mt-6 max-w-2xl font-medium leading-relaxed">
              Explore the hidden gems and world-famous landmarks of {country.name}. Your journey starts here.
            </p>
          </div>
          <Link 
            to={`/planner?destination=${country.name}`}
            className="bg-sky-500 text-white px-10 py-5 rounded-[2rem] font-black shadow-2xl hover:bg-sky-600 hover:scale-105 transition-all flex items-center gap-3 group whitespace-nowrap"
          >
            Start Planning
            <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-20">
            <section>
              <h2 className="text-4xl font-black mb-8 text-slate-800 flex items-center gap-3">
                <span className="text-yellow-400">✨</span> The Vibe
              </h2>
              <div className="text-slate-600 leading-relaxed text-xl">
                {loading ? (
                  <div className="space-y-6 animate-pulse">
                    <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
                    <div className="h-4 bg-slate-100 rounded-full w-4/6"></div>
                  </div>
                ) : (
                  <p className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-50 italic">
                    "{details.description}"
                  </p>
                )}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-4xl font-black text-slate-800">Must-Visit Spots! 📸</h2>
                  <p className="text-slate-400 mt-2 font-medium">I handpicked these 6 spots just for you.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  [1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-72 bg-slate-50 rounded-[2rem] animate-pulse"></div>
                  ))
                ) : (
                  details.attractions?.map((attr, idx) => (
                    <div 
                      key={idx} 
                      className="group relative h-72 rounded-[2rem] overflow-hidden shadow-xl bg-slate-100 hover:-translate-y-2 transition-all duration-500"
                    >
                      <img 
                        src={`https://loremflickr.com/800/800/${encodeURIComponent(attr + ' ' + country.name)}/all`} 
                        alt={attr} 
                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" 
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://loremflickr.com/800/800/landmark/all`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-2 border border-white/20">
                          Spot #{idx + 1}
                        </div>
                        <h3 className="text-xl font-black leading-tight group-hover:text-yellow-400 transition-colors">
                          {attr}
                        </h3>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section>
              <h2 className="text-4xl font-black mb-10 text-slate-800">Traveler Tips 🎒</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                  <div className="h-20 bg-slate-50 rounded-3xl animate-pulse"></div>
                ) : (
                  details.cultureTips?.map((tip, idx) => (
                    <div key={idx} className="flex gap-6 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 bg-sky-50 text-sky-500 rounded-2xl flex items-center justify-center text-xl shrink-0 font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-slate-600 font-bold text-lg leading-snug">{tip}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            <div className="sticky top-10 space-y-10">
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-50 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
                <h3 className="text-2xl font-black mb-8 text-slate-800">Quick Guide 📊</h3>
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 text-xl shadow-sm">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-400 text-xs uppercase tracking-widest">Best Time</h4>
                      <p className="text-lg font-bold text-slate-800">{details.bestTimeToVisit || 'Checking...'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 text-xl shadow-sm">
                      <i className="fas fa-wallet"></i>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-400 text-xs uppercase tracking-widest">Currency</h4>
                      <p className="text-lg font-bold text-slate-800">{details.currency || 'Checking...'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-sky-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <h3 className="text-2xl font-black mb-4">Pack Your Bags! ✈️</h3>
                <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                  Ready to see these spots in person? Let Alex's AI engine build your full itinerary in seconds.
                </p>
                <Link 
                  to={`/planner?destination=${country.name}`}
                  className="block w-full text-center py-5 bg-sky-500 text-white rounded-[1.5rem] font-black hover:bg-sky-400 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                >
                  Plan My Trip Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
