import React, { useState, useRef } from 'react';
import { Search, Mic, ArrowRight, X, AlertCircle, Sparkles, User, MapPin, FileText, Tag, Image as ImageIcon, Users, MapPin as LocationIcon } from 'lucide-react';
import { ResultCard } from './ResultCard.jsx';

export function SearchHub({
  searchQuery = '',
  setSearchQuery = () => {},
  onExecuteSearch = () => {},
  isSearching = false,
  queryResults = null,
  parsedIntent = null,
  aiAnswer = null,
  airplaneMode = false,
  onOpenViewer = () => {},
  allPeople = [],
  allLocations = [],
  files = [],
  onNavigateTab = () => {}
}) {
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);

  const safeFiles = Array.isArray(files) ? files : [];
  const safePeople = Array.isArray(allPeople) ? allPeople : [];
  const safeLocations = Array.isArray(allLocations) ? allLocations : [];

  // Suggested Prompts with Micro Lucide Icons
  const suggestedQueries = [
    { label: 'Photos of Prithiv', query: 'Show me photos of Prithiv', Icon: User },
    { label: 'Marina Beach trip', query: 'Photos at Marina Beach', Icon: MapPin },
    { label: 'My software resume', query: 'Find my software engineering resume', Icon: FileText },
    { label: "Prithiv's resume", query: "Find Prithiv's resume", Icon: FileText },
    { label: 'Friend in orange shirt', query: 'Photos of friend in orange shirt', Icon: Tag }
  ];

  const handleToggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice search is supported on Chrome and Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        onExecuteSearch(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onExecuteSearch(searchQuery);
    }
  };

  const handlePromptClick = (query) => {
    setSearchQuery(query);
    onExecuteSearch(query);
  };

  const photoCount = safeFiles.filter(f => f?.media_category === 'photo' || f?.mime_type?.startsWith('image/')).length;
  const docCount = safeFiles.filter(f => f?.media_category === 'document' || f?.mime_type?.includes('pdf')).length;

  return (
    <div className="flex flex-col gap-3 px-3.5 py-3 pb-6 max-w-md mx-auto w-full">
      {/* Search Input Card */}
      <form onSubmit={handleFormSubmit} className="w-full">
        <div className="iqoo-card p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400 font-mono flex items-center gap-1 leading-none">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span>SEARCH MEMORY</span>
            </span>
            <span className="text-[8px] font-bold text-slate-400 font-mono uppercase bg-[#161822] px-1.5 py-0.5 rounded leading-none">
              {safeFiles.length} ITEMS
            </span>
          </div>

          {/* Inset Search Input Box */}
          <div className="iqoo-well px-2 py-1.5 flex items-center gap-2">
            <Search size={14} strokeWidth={1.75} className="text-yellow-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask anything... (e.g. 'Photos of Prithiv')"
              className="w-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  if (inputRef.current) inputRef.current.focus();
                }}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-0.5">
            <button
              type="button"
              onClick={handleToggleVoice}
              className={`iqoo-btn-secondary !text-[9px] !py-1 !px-2.5 font-mono ${
                isListening ? 'bg-yellow-400 !text-black animate-pulse' : ''
              }`}
            >
              <Mic size={11} strokeWidth={2} className="text-yellow-400" />
              <span>{isListening ? 'LISTENING' : 'VOICE'}</span>
            </button>

            <button
              type="submit"
              disabled={!searchQuery.trim() || isSearching}
              className={`iqoo-btn-primary !text-[10px] !py-1 !px-3.5 ${
                !searchQuery.trim() || isSearching ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              {isSearching ? (
                <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>SEARCH</span>
                  <ArrowRight size={11} strokeWidth={2} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Suggested Search Chips */}
      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          SUGGESTED SEARCHES
        </span>
        <div className="flex flex-wrap gap-1">
          {suggestedQueries.map((item, idx) => {
            const Icon = item.Icon;
            return (
              <button
                key={idx}
                onClick={() => handlePromptClick(item.query)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#11131A] hover:bg-[#181A24] text-[10px] font-medium text-slate-300 hover:text-yellow-400 transition-colors border border-white/8"
              >
                <Icon size={10} strokeWidth={2} className="text-yellow-400 shrink-0" />
                <span className="leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI Grounded Synthesis Result */}
      {aiAnswer && (
        <div className="iqoo-card p-3 flex items-start gap-2.5 border-l-2 border-l-yellow-400 animate-fadeIn">
          <div className="iqoo-icon-box text-yellow-400 shrink-0">
            <Sparkles size={13} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[8px] font-bold text-yellow-400 uppercase font-mono tracking-wider block leading-none">
              MEMORY SYNTHESIS
            </span>
            <p className="text-[11px] text-white leading-normal mt-1 font-sans">{aiAnswer}</p>
          </div>
        </div>
      )}

      {/* Active Search Results */}
      {queryResults && queryResults.length > 0 && (
        <div className="flex flex-col gap-2 mt-0.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              MATCHED EVIDENCE ({queryResults.length})
            </span>
          </div>

          {queryResults.map((result, idx) => (
            <ResultCard
              key={result.file?.id || idx}
              result={result}
              onOpenViewer={onOpenViewer}
              rank={idx + 1}
            />
          ))}
        </div>
      )}

      {/* If Search Returned Empty */}
      {queryResults && queryResults.length === 0 && (
        <div className="iqoo-card p-5 text-center flex flex-col items-center justify-center gap-2 my-1">
          <div className="iqoo-icon-box !w-8 !h-8 text-slate-400">
            <AlertCircle size={15} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wide font-sans">
              No Memories Found
            </h3>
            <p className="text-[10px] text-slate-400 max-w-xs mt-0.5 font-sans">
              No matching evidence found in your personal memory.
            </p>
          </div>
        </div>
      )}

      {/* Default State: Compact Overview & Carousel */}
      {!queryResults && (
        <div className="flex flex-col gap-2.5">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className="iqoo-card p-2 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-mono text-slate-400 uppercase">Files</span>
              <span className="text-xs font-bold text-white mt-0.5 font-sans">4 Items</span>
            </div>
            <div className="iqoo-card p-2 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-mono text-slate-400 uppercase">Privacy</span>
              <span className="text-xs font-bold text-yellow-400 mt-0.5 font-sans">100% Local</span>
            </div>
            <div className="iqoo-card p-2 flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-mono text-slate-400 uppercase">Storage</span>
              <span className="text-xs font-bold text-white mt-0.5 font-sans">367 KB</span>
            </div>
          </div>

          {/* Featured Hero Banner */}
          <div className="iqoo-card-yellow p-3 flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-bold tracking-wider uppercase font-mono bg-black/10 px-1.5 py-0.2 rounded text-black leading-none">
                PERSONAL MEMORY LAYER
              </span>
              <span className="text-xs font-bold font-display text-black leading-none">
                4 / 4 READY
              </span>
            </div>

            <div>
              <h2 className="text-xs font-black tracking-tight leading-tight uppercase font-display text-black">
                YOUR PHONE REMEMBERS.
              </h2>
              <p className="text-[10px] font-semibold text-black/85 mt-0.5 font-sans">
                2 resumes & 2 personal photos securely indexed on-device.
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-black/15">
              <span className="text-[8px] font-bold uppercase font-mono text-black">
                ZERO CLOUD TELEMETRY
              </span>
              <span className="text-[8px] font-bold bg-black text-yellow-400 px-2 py-0.2 rounded font-mono">
                SECURE
              </span>
            </div>
          </div>

          {/* Recent Memories Carousel (Compact 96px Cards) */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                RECENT MEMORY ITEMS
              </span>
              <span className="text-[8px] font-mono text-yellow-400 font-bold">
                {safeFiles.length} ITEMS
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {safeFiles.map((file) => {
                const isPhoto = file?.media_category === 'photo' || file?.mime_type?.startsWith('image/');
                return (
                  <div
                    key={file?.id || Math.random()}
                    onClick={() => onOpenViewer(file)}
                    className="iqoo-memory-card"
                  >
                    <div className="w-full h-14 bg-[#08090C] relative flex items-center justify-center overflow-hidden">
                      {isPhoto ? (
                        <img
                          src={file?.uri}
                          alt={file?.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-yellow-400">
                          <FileText size={16} strokeWidth={1.75} />
                        </div>
                      )}
                    </div>
                    <div className="p-1.5 flex flex-col justify-between flex-1">
                      <p className="text-[10px] font-medium text-white truncate leading-tight font-sans">
                        {file?.title || file?.filename}
                      </p>
                      <p className="text-[8px] text-slate-400 truncate font-mono mt-0.5 leading-none">
                        {((file?.size_bytes || 0) / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Quick Tiles Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            <div
              onClick={() => onNavigateTab && onNavigateTab('files')}
              className="iqoo-category-card"
            >
              <div className="iqoo-icon-box text-yellow-400">
                <ImageIcon size={13} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-semibold text-white leading-tight font-sans">Photos</h4>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">{photoCount} photos</p>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab && onNavigateTab('files')}
              className="iqoo-category-card"
            >
              <div className="iqoo-icon-box text-yellow-400">
                <FileText size={13} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-semibold text-white leading-tight font-sans">Documents</h4>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">{docCount} resumes</p>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab && onNavigateTab('people')}
              className="iqoo-category-card"
            >
              <div className="iqoo-icon-box text-yellow-400">
                <Users size={13} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-semibold text-white leading-tight font-sans">People</h4>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">{safePeople.length} profiles</p>
              </div>
            </div>

            <div
              onClick={() => onNavigateTab && onNavigateTab('places')}
              className="iqoo-category-card"
            >
              <div className="iqoo-icon-box text-yellow-400">
                <LocationIcon size={13} strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-[11px] font-semibold text-white leading-tight font-sans">Places</h4>
                <p className="text-[9px] text-slate-400 font-mono mt-0.5">{safeLocations.length} tags</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
