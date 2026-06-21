import { useLocation, Link, Navigate } from 'react-router-dom';
import ViolationCard from '../components/ViolationCard';
import { API_BASE_URL } from '../config';

export default function Results() {
  const location = useLocation();
  const state = location.state;

  // Protect the route from direct navigation without data
  if (!state || !state.results) {
    return <Navigate to="/app/upload" replace />;
  }

  const { violations, evidence_image_path } = state.results;
  const { originalImage } = state;

  // Handle both local static paths and Supabase public URLs gracefully
  const evidenceUrl = evidence_image_path 
    ? (evidence_image_path.startsWith('http') ? evidence_image_path : `${API_BASE_URL}${evidence_image_path}`)
    : originalImage;

  return (
    <div className="flex flex-col items-center pt-4">
      
      {/* Hero Evidence Image */}
      <div className="w-full max-w-6xl mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-3 h-3 bg-radar rounded-none"></div>
          <h2 className="font-display text-2xl text-paper tracking-[0.2em] uppercase">
            Scan Complete
          </h2>
        </div>
        
        <div className="relative w-full bg-black border-[3px] border-amber p-1 shadow-[0_0_20px_rgba(255,182,39,0.15)]">
          <img 
            src={evidenceUrl} 
            alt="Annotated Evidence" 
            className="w-full h-auto max-h-[65vh] object-contain opacity-95"
          />
        </div>
      </div>

      {/* Violations Area */}
      <div className="w-full max-w-6xl">
        {violations && violations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {violations.map((v, i) => (
              <ViolationCard key={i} violation={v} />
            ))}
          </div>
        ) : (
          <div className="w-full border-t border-b border-concrete/20 bg-asphalt py-12 text-center">
            <p className="font-mono text-concrete text-xl tracking-widest uppercase">
              No violations detected in this frame.
            </p>
          </div>
        )}
      </div>

      {/* Navigation Actions */}
      <div className="mt-20 w-full max-w-6xl flex justify-center">
        <Link 
          to="/app/dashboard"
          className="bg-transparent text-amber border-[3px] border-amber font-display font-bold text-2xl tracking-widest px-16 py-4 hover:bg-amber hover:text-asphalt transition-colors duration-200 uppercase"
        >
          View Dashboard
        </Link>
      </div>
      
    </div>
  );
}
