import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function Layout({ children }) {
  const location = useLocation();
  
  const navLinks = [
    { name: 'UPLOAD / SCAN', path: '/app/upload' },
    { name: 'DASHBOARD', path: '/app/dashboard' },
    { name: 'HISTORY', path: '/app/history' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-asphalt border-b-[3px] border-amber sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo className="w-10 h-10" />
            <div>
              <h1 className="font-display text-3xl font-bold tracking-wider text-paper leading-none">
                TRAFFIC <span className="text-amber">EYE</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-radar animate-pulse"></div>
                <span className="text-radar font-mono text-[10px] tracking-widest uppercase">
                  BTP Command Center
                </span>
              </div>
            </div>
          </div>
          
          <nav className="flex gap-8">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path || (link.path === '/app/history' && location.pathname === '/app/results');
              return (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`font-display text-xl tracking-wide transition-colors duration-200 border-b-2 pb-1 ${
                    isActive ? 'text-amber border-amber' : 'text-concrete border-transparent hover:text-paper hover:border-paper/30'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}
