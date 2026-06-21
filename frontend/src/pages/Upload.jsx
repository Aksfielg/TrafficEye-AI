import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const STATUS_MESSAGES = [
  "DETECTING VEHICLES...",
  "CHECKING HELMET COMPLIANCE...",
  "READING PLATE..."
];

export default function Upload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle', 'analyzing', 'error'
  const [statusText, setStatusText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Handle the faux-loading text cycling effect
  useEffect(() => {
    let interval;
    if (status === 'analyzing') {
      let index = 0;
      setStatusText(STATUS_MESSAGES[0]);
      interval = setInterval(() => {
        index = (index + 1) % STATUS_MESSAGES.length;
        setStatusText(STATUS_MESSAGES[index]);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      handleFileSelection(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelection(selectedFile);
    }
  };

  const handleFileSelection = (selectedFile) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
    setStatus('idle');
    setErrorMsg('');
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setStatus('analyzing');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Send POST request to backend
      const res = await fetch(`${API_BASE_URL}/api/analyze/`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Analysis failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      
      // On success, navigate to /results and pass the data via router state
      navigate('/app/results', { state: { results: data, originalImage: previewUrl } });
    } catch (err) {
      console.error("Analyze error:", err);
      setStatus('error');
      setErrorMsg(err.message || 'Failed to analyze the image. Is the backend running?');
    }
  };

  return (
    <div className="h-full min-h-[75vh] flex flex-col items-center justify-center">
      {!previewUrl ? (
        // Drop Zone State
        <div 
          className={`w-full max-w-4xl h-[60vh] border-[3px] border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
            isDragging 
              ? 'border-amber bg-amber/10' 
              : 'border-concrete/30 hover:border-amber hover:bg-amber/5 bg-asphalt/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          <svg className="w-16 h-16 text-concrete mb-6 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p className="font-display text-4xl tracking-widest text-paper mb-3">DRAG & DROP FOOTAGE</p>
          <p className="font-mono text-sm text-concrete">OR CLICK TO BROWSE LOCAL FILES</p>
        </div>
      ) : (
        // Preview State
        <div className="w-full max-w-5xl flex flex-col items-center gap-10">
          <div className="relative w-full border border-concrete/20 bg-black overflow-hidden shadow-2xl">
            {/* Stenciled Translucent Strip */}
            <div className="absolute top-0 left-0 w-full bg-asphalt/90 backdrop-blur-md border-b border-concrete/20 z-10 p-3 flex justify-center items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-radar animate-pulse"></div>
              <h2 className="font-display text-2xl tracking-[0.3em] text-paper">
                TRAFFICEYE — LIVE VIOLATION SCAN
              </h2>
            </div>
            
            {/* Image Preview */}
            <img 
              src={previewUrl} 
              alt="Upload preview" 
              className="w-full max-h-[65vh] object-contain opacity-80"
            />
            
            {/* Horizontal Scan-line Animation */}
            {/* Hides if user prefers reduced motion (motion-safe) */}
            <div className="absolute left-0 w-full h-[3px] bg-radar/80 shadow-[0_0_20px_4px_rgba(63,193,201,0.7)] motion-safe:animate-scanline z-20 pointer-events-none"></div>
          </div>

          {/* Bottom Action Area */}
          <div className="h-20 flex items-center justify-center w-full">
            {status === 'idle' && (
              <button 
                onClick={handleAnalyze}
                className="bg-amber text-asphalt font-display font-bold text-3xl tracking-widest px-16 py-4 hover:bg-paper transition-colors duration-200"
              >
                ANALYZE
              </button>
            )}

            {status === 'analyzing' && (
              <div className="flex items-center gap-4 px-10 py-4 border border-radar/30 bg-radar/10">
                <div className="w-4 h-4 bg-radar animate-pulse"></div>
                <p className="font-mono text-radar text-xl tracking-wider uppercase">
                  {statusText}
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-3">
                <p className="font-mono text-violation text-lg tracking-wider uppercase bg-violation/10 px-6 py-2 border border-violation/30">
                  {errorMsg}
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="text-concrete hover:text-amber font-mono text-sm underline tracking-widest uppercase transition-colors"
                >
                  Clear and Retry
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
