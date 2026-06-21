import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getViolationCode } from '../constants';
import { API_BASE_URL } from '../config';

const COLORS = ['#E2462F', '#FFB627', '#3FC1C9', '#9CA3AF']; // violation, amber, radar, concrete

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/analytics`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to connect to analytics feed.');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    fetch(`${API_BASE_URL}/api/analytics/insights`)
      .then(res => res.json())
      .then(json => {
        setInsights(json.insights);
        setInsightsLoading(false);
      })
      .catch(err => {
        setInsights("AI engine temporarily unavailable. Could not generate automated insights at this time.");
        setInsightsLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-12 h-12 bg-radar animate-pulse mb-6 rounded-none shadow-[0_0_15px_rgba(63,193,201,0.5)]"></div>
        <p className="font-mono text-radar text-xl tracking-widest uppercase">Initializing Command Center Readouts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-[3px] border-violation/50 bg-violation/10 p-8 max-w-2xl mx-auto mt-20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-4 h-4 bg-violation"></div>
          <h3 className="font-display text-4xl text-violation tracking-widest uppercase">Telemetry Error</h3>
        </div>
        <p className="font-mono text-concrete text-lg tracking-wider uppercase">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 text-amber font-mono underline underline-offset-4 tracking-widest uppercase hover:text-paper"
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  // Process data for charts
  let mostCommonType = "NONE";
  let maxCount = 0;
  
  // Format Pie Chart Data
  const pieData = [];
  if (data?.violations_by_type) {
    Object.entries(data.violations_by_type).forEach(([type, count]) => {
      pieData.push({ name: `${getViolationCode(type)} - ${type}`, value: count });
      if (count > maxCount) {
        maxCount = count;
        mostCommonType = getViolationCode(type);
      }
    });
  }

  // Format Bar Chart Data
  const barData = [];
  if (data?.violations_by_hour) {
    Object.entries(data.violations_by_hour).forEach(([hour, count]) => {
      // Format hour as "0800"
      const label = hour.padStart(2, '0') + "00";
      barData.push({ time: label, count });
    });
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl">
      <div className="flex items-center gap-4 border-b-2 border-asphalt/50 pb-4">
        <div className="w-4 h-4 bg-radar rounded-none shadow-[0_0_10px_rgba(63,193,201,0.5)]"></div>
        <h2 className="font-display text-4xl text-paper tracking-[0.25em] uppercase leading-none">
          Operations Overview
        </h2>
      </div>

      {/* Top Summary Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-asphalt border border-concrete/20 p-6 flex flex-col shadow-lg border-t-4 border-t-concrete/50">
          <span className="font-mono text-sm font-bold text-concrete tracking-widest uppercase mb-2">
            Total Logged Violations
          </span>
          <span className="font-display text-7xl font-bold text-paper leading-none">
            {data.total_violations}
          </span>
        </div>
        <div className="bg-asphalt border border-concrete/20 p-6 flex flex-col shadow-lg border-t-4 border-t-amber">
          <span className="font-mono text-sm font-bold text-concrete tracking-widest uppercase mb-2">
            24H Rolling Count
          </span>
          <span className="font-display text-7xl font-bold text-amber leading-none">
            {data.today_count !== undefined ? data.today_count : data.total_violations}
          </span>
        </div>
        <div className="bg-asphalt border border-concrete/20 p-6 flex flex-col shadow-lg border-t-4 border-t-violation">
          <span className="font-mono text-sm font-bold text-concrete tracking-widest uppercase mb-2">
            Primary Offense Code
          </span>
          <span className="font-display text-7xl font-bold text-violation leading-none">
            {mostCommonType}
          </span>
        </div>
      </div>

      {/* AI Tactical Insight Card */}
      <div className="bg-asphalt border border-amber/30 p-6 shadow-lg border-l-[6px] border-l-amber relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
           <svg className="w-24 h-24 text-amber" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.2L18.8 19H5.2L12 6.2zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-amber animate-pulse rounded-full shadow-[0_0_8px_rgba(255,182,39,0.8)]"></div>
          <h3 className="font-mono text-sm font-bold text-amber tracking-[0.2em] uppercase">
            AI Tactical Insight
          </h3>
        </div>
        <div className="relative z-10">
          {insightsLoading ? (
             <div className="flex items-center gap-4">
               <div className="w-4 h-4 border-[3px] border-amber border-t-transparent rounded-full animate-spin"></div>
               <span className="font-mono text-concrete/70 uppercase tracking-widest text-sm font-bold">Processing telemetry...</span>
             </div>
          ) : (
             <p className="font-body text-paper/90 text-lg leading-relaxed max-w-6xl">
               {insights}
             </p>
          )}
        </div>
      </div>

      {/* Main Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pie Chart: Violations by Type */}
        <div className="bg-asphalt border border-concrete/20 p-6 flex flex-col col-span-1 lg:col-span-1 h-[400px] shadow-lg">
          <h3 className="font-mono text-sm font-bold text-concrete tracking-widest uppercase mb-6 border-b border-concrete/10 pb-3">
            Violation Distribution
          </h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={65}
                  outerRadius={100} 
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#14171B', borderColor: '#3FC1C9', borderRadius: 0, borderWidth: 2 }}
                  itemStyle={{ fontFamily: '"IBM Plex Mono", monospace', color: '#F2F1ED', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="font-mono text-concrete/40 tracking-widest border border-concrete/10 px-4 py-2">
                NO DATA AWAITING SCANS
              </span>
            </div>
          )}
        </div>

        {/* Bar Chart: Violations by Hour */}
        <div className="bg-asphalt border border-concrete/20 p-6 flex flex-col col-span-1 lg:col-span-2 h-[400px] shadow-lg">
          <h3 className="font-mono text-sm font-bold text-concrete tracking-widest uppercase mb-6 border-b border-concrete/10 pb-3">
            Hourly Incident Volume
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF" 
                tick={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#9CA3AF', strokeWidth: 1, opacity: 0.3 }}
              />
              <YAxis 
                stroke="#9CA3AF" 
                tick={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                contentStyle={{ backgroundColor: '#14171B', borderColor: '#FFB627', borderRadius: 0, borderWidth: 2 }}
                itemStyle={{ fontFamily: '"IBM Plex Mono", monospace', color: '#FFB627', fontWeight: 'bold' }}
                labelStyle={{ fontFamily: '"IBM Plex Mono", monospace', color: '#9CA3AF' }}
              />
              <Bar dataKey="count" fill="#FFB627" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Repeat Offenders Watch-List */}
      <div className="bg-asphalt border border-concrete/20 p-6 shadow-lg">
        <h3 className="font-mono text-sm font-bold text-concrete tracking-widest uppercase mb-6 border-b border-concrete/10 pb-3">
          Watch-List: High Frequency Repeat Offenders
        </h3>
        
        {data.top_repeat_offenders && data.top_repeat_offenders.length > 0 ? (
          <div className="flex flex-col gap-3">
            {data.top_repeat_offenders.map((offender, idx) => (
              <Link 
                key={idx}
                to={`/history?plate=${offender.vehicle_number}`}
                className="flex items-center justify-between p-4 border-l-4 border-transparent hover:border-violation hover:bg-concrete/5 transition-colors group"
              >
                <div className="flex items-center gap-6">
                  <span className="font-mono text-concrete/40 w-6 font-bold">{idx + 1}.</span>
                  <span className="font-mono text-2xl font-bold tracking-[0.25em] text-paper group-hover:text-amber transition-colors">
                    {offender.vehicle_number.replace(/(.{2})(.{2})(.{2})(.{4})/, "$1 $2 $3 $4")}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs font-bold text-concrete/70 uppercase tracking-widest hidden sm:inline">
                    Violations
                  </span>
                  <span className="bg-violation/10 text-violation border-[2px] border-violation/40 font-mono font-bold text-xl px-4 py-1">
                    {offender.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 border-[2px] border-dashed border-concrete/10 flex justify-center">
            <span className="font-mono text-concrete/50 tracking-widest uppercase font-bold">
              No multiple-offense vehicles registered in current window.
            </span>
          </div>
        )}
      </div>

    </div>
  );
}
