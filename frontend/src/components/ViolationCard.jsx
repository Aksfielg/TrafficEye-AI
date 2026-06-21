import { Link } from 'react-router-dom';
import { getViolationCode } from '../constants';

export default function ViolationCard({ violation }) {
  const { type, confidence, vehicle_number } = violation;
  const code = getViolationCode(type);
  
  // Convert confidence to integer percentage
  const confPercent = Math.round(confidence * 100);

  // Digital gauge styling for confidence
  let confColor = 'text-concrete';
  if (confPercent > 90) confColor = 'text-violation';
  else if (confPercent >= 70) confColor = 'text-amber';

  return (
    <div className="bg-paper text-asphalt p-6 border-l-[6px] border-violation shadow-lg flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-1">
          {/* Eyebrow Label */}
          <span className="font-mono text-sm tracking-widest text-asphalt/60 font-bold uppercase">
            {code}
          </span>
          {/* Digital Gauge Confidence */}
          <span className={`font-mono text-2xl font-bold tracking-widest ${confColor}`}>
            {confPercent}%
          </span>
        </div>
        
        {/* Violation Name */}
        <h3 className="font-display text-4xl font-bold uppercase tracking-wider mb-6 leading-none">
          {type}
        </h3>
        
        {/* Vehicle Plate */}
        <div className="mb-6">
          <span className="block font-mono text-xs font-bold text-asphalt/50 tracking-widest uppercase mb-2">
            Target Vehicle
          </span>
          {vehicle_number ? (
            <div className="inline-block bg-asphalt text-amber font-mono text-2xl font-bold tracking-[0.25em] px-4 py-2 border border-asphalt rounded-sm">
              {vehicle_number.replace(/(.{2})(.{2})(.{2})(.{4})/, "$1 $2 $3 $4")}
            </div>
          ) : (
            <div className="inline-block bg-asphalt/10 text-asphalt/40 font-mono text-xl tracking-widest px-4 py-2 border border-asphalt/20 rounded-sm">
              UNREADABLE
            </div>
          )}
        </div>
      </div>

      {/* Footer Link */}
      <div className="mt-2 pt-4 border-t-2 border-asphalt/10">
        {vehicle_number ? (
          <Link 
            to={`/history?plate=${vehicle_number}`}
            className="font-mono text-sm font-bold uppercase tracking-wider text-asphalt hover:text-amber transition-colors underline decoration-asphalt/30 underline-offset-4"
          >
            Check History &rarr;
          </Link>
        ) : (
          <span className="font-mono text-sm uppercase tracking-wider text-asphalt/40">
            History unavailable
          </span>
        )}
      </div>
    </div>
  );
}
