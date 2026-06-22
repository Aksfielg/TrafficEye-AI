import React from 'react';
import { getViolationCode } from '../constants';
import { API_BASE_URL } from '../config';

export default function EChallanModal({ isOpen, onClose, violation }) {
  if (!isOpen || !violation) return null;

  const getFineAmount = (type) => {
    switch (type) {
      case 'Helmet Violation': return '₹1000';
      case 'Triple Riding': return '₹1500';
      case 'Seatbelt Non-Compliance': return '₹1000';
      case 'Illegal Parking': return '₹500';
      default: return '₹0';
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  };

  const type = violation.type || violation.violation_type;
  const code = getViolationCode(type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-paper text-asphalt border-[4px] border-amber w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-amber p-4 flex justify-between items-center shrink-0">
          <h2 className="font-display text-2xl tracking-[0.2em] font-bold text-asphalt m-0 leading-none">
            BENGALURU TRAFFIC POLICE <br/><span className="text-sm">AUTOMATED E-CHALLAN</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-asphalt hover:text-white transition-colors bg-asphalt/10 p-2 border border-asphalt/20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-4 border-b-2 border-asphalt/10 pb-6">
            <div>
              <span className="block font-mono text-xs font-bold text-asphalt/50 tracking-widest uppercase mb-1">Notice Number</span>
              <span className="font-mono text-lg font-bold">TC-{Math.floor(Math.random()*10000000)}</span>
            </div>
            <div>
              <span className="block font-mono text-xs font-bold text-asphalt/50 tracking-widest uppercase mb-1">Timestamp</span>
              <span className="font-mono text-lg font-bold">
                {violation.timestamp ? new Date(violation.timestamp).toLocaleString() : new Date().toLocaleString()}
              </span>
            </div>
            <div>
              <span className="block font-mono text-xs font-bold text-asphalt/50 tracking-widest uppercase mb-1">Location</span>
              <span className="font-mono text-lg font-bold">{violation.location || "Unknown"}</span>
            </div>
            <div>
              <span className="block font-mono text-xs font-bold text-asphalt/50 tracking-widest uppercase mb-1">Target Vehicle</span>
              <span className="font-mono text-xl font-bold bg-asphalt text-amber px-2 py-1 tracking-[0.2em] inline-block">
                {violation.vehicle_number || "UNREADABLE"}
              </span>
            </div>
          </div>

          <div className="bg-asphalt/5 p-4 border border-asphalt/20 flex justify-between items-center">
            <div>
              <span className="block font-mono text-xs font-bold text-asphalt/50 tracking-widest uppercase mb-1">Offense Code</span>
              <span className="font-display text-2xl font-bold tracking-wider">{type} ({code})</span>
            </div>
            <div className="text-right">
              <span className="block font-mono text-xs font-bold text-asphalt/50 tracking-widest uppercase mb-1">Penalty Amount</span>
              <span className="font-display text-4xl font-bold text-violation">{getFineAmount(type)}</span>
            </div>
          </div>

          <div>
            <span className="block font-mono text-xs font-bold text-asphalt/50 tracking-widest uppercase mb-2">Photographic Evidence</span>
            <div className="border-[3px] border-asphalt/80 bg-black relative w-full">
              <img 
                src={getImageUrl(violation.image_url || violation.evidence_image_path || violation.evidenceUrl)} 
                alt="Evidence" 
                className="w-full h-auto object-cover opacity-90"
              />
              <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 border border-amber/30 text-amber font-mono text-[10px] tracking-widest">
                VERIFIED BY TRAFFICEYE AI
              </div>
            </div>
          </div>

        </div>
        
        {/* Footer */}
        <div className="bg-asphalt/5 p-4 border-t-2 border-asphalt/10 flex justify-end gap-4 shrink-0">
          <button onClick={onClose} className="font-mono font-bold uppercase tracking-widest px-6 py-2 border-2 border-asphalt/30 hover:bg-asphalt/10 transition-colors text-asphalt">
            Close
          </button>
          <button className="bg-violation text-white font-mono font-bold uppercase tracking-widest px-6 py-2 hover:bg-violation/80 transition-colors shadow-md">
            Issue Fine (Demo)
          </button>
        </div>

      </div>
    </div>
  );
}
