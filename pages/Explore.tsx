
import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { COUNTRIES } from '../constants';

const Explore: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedContinent, setSelectedContinent] = useState('All');

  const continents = ['All', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];

  /**
   * Helper for Alex's photo search script. 
   * Uses specific landmarks for famous places and the country name for the rest.
   */
  const getBestPhotoKeyword = (country: string) => {
    const landmarks: Record<string, string> = {
      "France": "Eiffel Tower",
      "Italy": "Colosseum",
      "Japan": "Mount Fuji",
      "United Kingdom": "Big Ben",
      "USA": "Statue of Liberty",
      "Brazil": "Christ the Redeemer",
      "Egypt": "Pyramids",
      "China": "Great Wall",
      "Australia": "Sydney Opera House",
      "India": "Taj Mahal"
    };
    return landmarks[country] || `${country} travel landmark`;
  };

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(country => {
      const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           country.capital.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesContinent = selectedContinent === 'All' || country.continent === selectedContinent;
      return matchesSearch && matchesContinent;
    });
  }, [searchTerm, selectedContinent]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-800">
          Awesome Places I Found! 🗺️
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          I found all 195 countries and some cool photos for each one. Scroll down to see the world!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-12">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Search for a city or country..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-6 pr-6 py-4 bg-white border-4 border-sky-100 rounded-2xl shadow-sm focus:border-sky-400 outline-none font-bold text-slate-700 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {continents.map(continent => (
            <button
              key={continent}
              onClick={() => setSelectedContinent(continent)}
              className={`px-5 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                selectedContinent === continent 
                  ? 'bg-sky-500 text-white border-sky-500 shadow-md scale-105' 
                  : 'bg-white text-slate-400 border-slate-100 hover:border-sky-200 hover:text-sky-500'
              }`}
            >
              {continent}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCountries.map((country) => (
          <Link 
            to={`/country/${country.name.toLowerCase()}`} 
            key={country.code}
            className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all border-b-4 border-sky-400"
          >
            <div className="h-64 relative overflow-hidden bg-slate-100">
              <img 
                src={`https://loremflickr.com/600/800/${encodeURIComponent(getBestPhotoKeyword(country.name))}/all`} 
                alt={country.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=600&auto=format&fit=crop`;
                }}
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-sky-600 shadow-sm">
                {country.continent}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-1">{country.name}</h3>
              <p className="text-sm text-slate-400 font-medium">Capital: {country.capital}</p>
            </div>
          </Link>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-32 bg-white rounded-3xl border-4 border-dashed border-slate-100">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-slate-800">Oops, couldn't find that one!</h3>
          <p className="text-slate-400 mt-2">Maybe check your spelling or try another continent?</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedContinent('All'); }}
            className="mt-8 px-8 py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition-all shadow-lg"
          >
            Show All Again
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;
