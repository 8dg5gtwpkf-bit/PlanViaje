
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [search] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem('search') as HTMLInputElement;
    if (input.value.trim()) {
      navigate(`/explore?search=${encodeURIComponent(input.value)}`);
    }
  };

  const curatedDestinations = [
    { name: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', desc: 'Cool tech and amazing sushi!' },
    { name: 'Iceland', img: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=800&auto=format&fit=crop', desc: 'Real life volcanoes. So epic.' },
    { name: 'Italy', img: 'https://images.unsplash.com/photo-1529243856184-fd5465488984?q=80&w=800&auto=format&fit=crop', desc: 'Pizza and pasta every single day.' },
    { name: 'Kenya', img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=800&auto=format&fit=crop', desc: 'See a real safari with lions!' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-sky-500 py-20 px-4 text-center text-white relative overflow-hidden">
        {/* Some "doodle" like decorations */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 rotate-12">✈️</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-20 -rotate-12">📸</div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-md">
            Plan Your Epic <br />
            <span className="underline decoration-yellow-400">Next Trip!</span>
          </h1>
          <p className="text-xl mb-10 font-medium opacity-90 max-w-2xl mx-auto">
            I built this site to help you find awesome places and plan your whole journey. 
            No more boring spreadsheets!
          </p>
          
          <form onSubmit={handleSearch} className="max-w-xl mx-auto bg-white p-2 rounded-2xl shadow-xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4">
              <input 
                name="search"
                type="text" 
                placeholder="Where do you want to go?" 
                className="w-full bg-transparent border-none py-4 text-slate-800 focus:ring-0 placeholder:text-slate-400 font-bold"
              />
            </div>
            <button className="bg-sky-500 text-white px-10 py-4 rounded-xl font-bold hover:bg-sky-600 transition-all flex items-center justify-center gap-2">
              Go! 🚀
            </button>
          </form>
          
          <p className="mt-8 text-xs italic opacity-70">
            "Better than Google Maps" - My Mom
          </p>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 py-20 w-full">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Awesome Spots I Found 🌍</h2>
        <p className="text-slate-500 mb-10">Check out these cool countries for your next vacation.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {curatedDestinations.map((dest, i) => (
            <Link 
              to={`/country/${dest.name.toLowerCase()}`} 
              key={i} 
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all border-b-4 border-sky-400"
            >
              <div className="h-56 relative overflow-hidden">
                <img src={dest.img} alt={dest.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{dest.name}</h3>
                <p className="text-slate-500 text-sm">{dest.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Philosophy / Features */}
      <section className="bg-yellow-50 py-20 border-y-4 border-yellow-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 underline decoration-sky-400">Why Use My Site?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl mb-6">✏️</div>
              <h3 className="text-xl font-bold mb-4">I Handpicked Info</h3>
              <p className="text-slate-500 text-sm">I searched all over to find the best spots so you don't have to.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-6">🗓️</div>
              <h3 className="text-xl font-bold mb-4">Super Easy Plans</h3>
              <p className="text-slate-500 text-sm">My scripts generate a full day-by-day plan in seconds.</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-6">🗺️</div>
              <h3 className="text-xl font-bold mb-4">Custom Maps</h3>
              <p className="text-slate-500 text-sm">I integrated interactive maps so you can see where you're going.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-400 py-16 px-4 text-center">
        <p className="font-bold text-white mb-4">Thanks for visiting PlanViaje! ✌️</p>
        <p className="text-sm max-w-md mx-auto mb-8">
          Made with 🍕 and late night coding sessions. 
          Send me an email if you find any bugs!
        </p>
        <div className="text-xs opacity-50">
          © {new Date().getFullYear()} PlanViaje.
        </div>
      </footer>
    </div>
  );
};

export default Home;
