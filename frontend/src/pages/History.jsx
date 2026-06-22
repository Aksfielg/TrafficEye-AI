import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getViolationCode, getViolationColor } from '../constants';
import { API_BASE_URL } from '../config';
import EChallanModal from '../components/EChallanModal';

export default function History() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPlate = searchParams.get('plate') || '';
  
  const [plateInput, setPlateInput] = useState(initialPlate);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedViolation, setSelectedViolation] = useState(null);
  
  // Sort state
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

  const fetchViolations = async (plate) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch specific plate history or general paginated history
      const endpoint = plate 
        ? `${API_BASE_URL}/api/violations/${encodeURIComponent(plate)}`
        : `${API_BASE_URL}/api/violations`;
        
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Failed to retrieve history records.');
      const data = await res.json();
      setViolations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViolations(initialPlate);
    setPlateInput(initialPlate);
  }, [initialPlate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (plateInput.trim()) {
      setSearchParams({ plate: plateInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setPlateInput('');
    setSearchParams({});
  };

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  // Sort violations client-side (backend returns desc by default)
  const sortedViolations = [...violations].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  const getImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  };

  return (
    <>
    <div className="flex flex-col gap-8 w-full max-w-7xl">
      <div className="flex items-center gap-4 border-b-2 border-asphalt/50 pb-4">
        <div className="w-4 h-4 bg-radar rounded-none shadow-[0_0_10px_rgba(63,193,201,0.5)]"></div>
        <h2 className="font-display text-4xl text-paper tracking-[0.25em] uppercase leading-none">
          Violation History Log
        </h2>
      </div>

      {/* Plate Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-4 items-center bg-asphalt p-4 border border-concrete/20 shadow-lg">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-concrete/60 font-mono font-bold">
            IND
          </span>
          <input 
            type="text" 
            value={plateInput}
            onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
            placeholder="ENTER PLATE NUMBER"
            className="w-full bg-black border-2 border-concrete/20 text-paper font-mono text-3xl tracking-[0.3em] uppercase py-4 pl-16 pr-4 focus:outline-none focus:border-amber transition-colors"
          />
        </div>
        <button 
          type="submit"
          className="bg-amber text-asphalt font-display font-bold text-3xl tracking-widest px-12 py-4 border-2 border-amber hover:bg-paper transition-colors"
        >
          QUERY
        </button>
        {initialPlate && (
          <button 
            type="button"
            onClick={handleClear}
            className="bg-transparent text-concrete border-2 border-concrete/40 font-mono font-bold text-xl tracking-widest px-8 py-4 hover:border-concrete hover:text-paper transition-colors uppercase"
          >
            Clear
          </button>
        )}
      </form>

      {/* Data Table */}
      <div className="bg-asphalt border border-concrete/20 flex flex-col shadow-xl overflow-hidden">
        {loading ? (
           <div className="flex flex-col items-center justify-center py-32">
             <div className="w-10 h-10 border-[4px] border-radar border-t-transparent rounded-full animate-spin mb-6"></div>
             <p className="font-mono text-radar text-lg tracking-widest uppercase">Querying Database...</p>
           </div>
        ) : error ? (
           <div className="py-24 text-center border-t-[4px] border-violation">
             <p className="font-mono text-violation text-xl tracking-wider uppercase font-bold">{error}</p>
           </div>
        ) : sortedViolations.length === 0 ? (
           <div className="py-32 text-center bg-black/20">
             <p className="font-mono text-concrete/60 text-2xl tracking-widest uppercase border border-concrete/10 inline-block px-8 py-4">
               {initialPlate 
                 ? `No violations on record for plate [ ${initialPlate} ]`
                 : "No violation records found in system."}
             </p>
           </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/40 border-b-[3px] border-concrete/20 text-concrete font-mono text-sm uppercase tracking-widest">
                  <th className="p-5 w-28">Evidence</th>
                  <th 
                    className="p-5 cursor-pointer hover:text-amber transition-colors select-none group" 
                    onClick={toggleSort}
                  >
                    Timestamp 
                    <span className="ml-2 text-concrete/50 group-hover:text-amber">
                      {sortOrder === 'desc' ? '▼' : '▲'}
                    </span>
                  </th>
                  <th className="p-5">Target Plate</th>
                  <th className="p-5">Violation Offense</th>
                  <th className="p-5 text-right">Confidence</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-concrete/10">
                {sortedViolations.map((v, i) => {
                  const confPercent = Math.round(v.confidence * 100);
                  let confColor = 'text-concrete';
                  if (confPercent > 90) confColor = 'text-violation';
                  else if (confPercent >= 70) confColor = 'text-amber';

                  return (
                    <tr key={i} className="hover:bg-concrete/5 transition-colors group">
                      {/* Thumbnail */}
                      <td className="p-4">
                        <div className="w-24 h-14 bg-black border border-concrete/20 overflow-hidden relative group-hover:border-amber transition-colors shadow-inner">
                          <img 
                            src={getImageUrl(v.image_url || v.evidence_image_path)} 
                            alt="Evidence Thumbnail" 
                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                          />
                        </div>
                      </td>
                      
                      {/* Timestamp */}
                      <td className="p-5 font-mono text-sm text-paper/80 whitespace-nowrap">
                        <span className="block">{new Date(v.timestamp).toLocaleDateString()}</span>
                        <span className="block text-concrete/70 mt-1">{new Date(v.timestamp).toLocaleTimeString()}</span>
                      </td>
                      
                      {/* Plate */}
                      <td className="p-5">
                        {(!v.vehicle_number || v.vehicle_number.toUpperCase() === 'UNREADABLE' || v.vehicle_number.includes('No Plate Detected')) ? (
                          <div className="flex flex-col items-start gap-1">
                            <span className="inline-block bg-black/60 text-concrete/80 font-mono font-bold tracking-[0.1em] px-4 py-2 border border-concrete/20">
                              {v.vehicle_type || "VEHICLE DETECTED"}
                            </span>
                            <span className="bg-violation/20 text-violation text-[10px] uppercase tracking-widest px-2 py-0.5 border border-violation/30">
                              Plate Unclear
                            </span>
                          </div>
                        ) : (
                          <span className="inline-block bg-black/60 text-amber font-mono font-bold tracking-[0.2em] px-4 py-2 border border-concrete/20">
                            {v.vehicle_number}
                          </span>
                        )}
                      </td>
                      
                      {/* Violation Code & Name */}
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span 
                            className="font-display text-2xl uppercase tracking-wider leading-none"
                            style={{ color: getViolationColor(v.violation_type) }}
                          >
                            {v.violation_type}
                          </span>
                          <span className="font-mono text-xs text-concrete uppercase tracking-widest mt-2 font-bold">
                            CODE: {getViolationCode(v.violation_type)}
                          </span>
                        </div>
                      </td>
                      
                      {/* Confidence Score */}
                      <td className={`p-5 text-right font-mono font-bold text-2xl tracking-widest ${confColor}`}>
                        {confPercent}%
                      </td>
                      
                      {/* Actions */}
                      <td className="p-5 text-right">
                        <button
                          onClick={() => setSelectedViolation(v)}
                          className="bg-amber/10 text-amber border border-amber font-mono font-bold uppercase tracking-widest text-xs px-4 py-2 hover:bg-amber hover:text-asphalt transition-colors whitespace-nowrap"
                        >
                          [ GENERATE E-CHALLAN ]
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
    <EChallanModal 
      isOpen={!!selectedViolation} 
      onClose={() => setSelectedViolation(null)} 
      violation={selectedViolation} 
    />
    </>
  );
}
