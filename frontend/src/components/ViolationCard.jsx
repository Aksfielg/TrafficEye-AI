import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getViolationCode, getViolationColor } from '../constants';
import EChallanModal from './EChallanModal';

export default function ViolationCard({ violation }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { type, confidence, vehicle_number, vehicle_type } = violation;
  const code = getViolationCode(type);
  
  // Convert confidence to integer percentage
  const confPercent = Math.round(confidence * 100);

  // Digital gauge styling for confidence
  let confColor = 'text-concrete';
  if (confPercent > 90) confColor = 'text-violation';
  else if (confPercent >= 70) confColor = 'text-amber';

  return (
    <div 
      className="bg-paper text-asphalt p-6 border-l-[6px] shadow-lg flex flex-col justify-between h-full"
      style={{ borderColor: getViolationColor(type) }}
    >
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
          {(!vehicle_number || vehicle_number.toUpperCase() === 'UNREADABLE' || vehicle_number.includes('No Plate Detected')) ? (
             <div className="inline-flex flex-col items-start gap-1">
               <span className="bg-asphalt text-concrete font-mono text-xl font-bold tracking-widest px-4 py-2 border border-asphalt rounded-sm">
                 {vehicle_type || 'VEHICLE DETECTED'}
               </span>
               <span className="bg-violation/10 text-violation font-bold text-[10px] uppercase tracking-widest px-2 py-0.5 border border-violation/30">
                 Plate Unclear
               </span>
             </div>
          ) : (
            <div className="inline-block bg-asphalt text-amber font-mono text-2xl font-bold tracking-[0.25em] px-4 py-2 border border-asphalt rounded-sm">
              {vehicle_number.replace(/(.{2})(.{2})(.{2})(.{4})/, "$1 $2 $3 $4")}
            </div>
          )}
          {type === 'Triple Riding' && (
            <div className="mt-3 font-mono text-sm font-bold text-violation tracking-widest uppercase">
              3+ Riders Detected
            </div>
          )}
          {type === 'Helmet Violation' && (
            <div className="mt-3 font-mono text-sm font-bold text-violation tracking-widest uppercase">
              No Helmet Detected
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
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full mt-4 bg-amber/10 border-2 border-amber text-amber font-mono font-bold uppercase tracking-widest px-4 py-3 hover:bg-amber hover:text-asphalt transition-colors"
        >
          [ GENERATE E-CHALLAN ]
        </button>
      </div>

      <EChallanModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        violation={violation} 
      />
    </div>
  );
}
