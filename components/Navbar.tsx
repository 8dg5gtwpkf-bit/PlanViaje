import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Epic Places', path: '/explore' },
    { name: 'Trip Planner', path: '/planner' },
    { name: 'My List', path: '/dashboard' },
  ];

  return (
    <nav className="bg-white border-b-4 border-yellow-400 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-sky-400 rounded-full flex items-center justify-center text-white shadow-md group-hover:rotate-12 transition-transform">
            <i className="fas fa-plane"></i>
          </div>
          <span className="text-2xl font-bold text-sky-500 tracking-tighter">PlanViaje!</span>
        </Link>
        
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-bold transition-all hover:text-sky-500 hover:scale-105 ${
                location.pathname === item.path ? 'text-sky-500 underline decoration-2' : 'text-slate-400'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors">Login</Link>
          <Link to="/signup" className="px-5 py-2 bg-yellow-400 text-blue-900 rounded-full text-xs font-bold hover:bg-yellow-300 shadow-md transition-all">Join PlanViaje</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;