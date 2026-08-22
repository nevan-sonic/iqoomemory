import React, { useState } from 'react';
import { X, Download, FileText, Image as ImageIcon, MapPin, UserCheck } from 'lucide-react';

export function FileViewerModal({ file, onClose, allPeople = [], allLocations = [] }) {
  const [activeTab, setActiveTab] = useState('preview');
  if (!file) return null;

  const isPhoto = file.media_category === 'photo' || file.mime_type?.startsWith('image/');
  const location = allLocations?.find(l => l.id === file.location_id);
  const matchedPeople = allPeople?.filter(p => file.person_ids?.includes(p.id)) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="iqoo-card w-full max-w-sm max-h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 bg-[#0F1118]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="iqoo-icon-box text-yellow-400">
              {isPhoto ? <ImageIcon size={13} strokeWidth={2} /> : <FileText size={13} strokeWidth={2} />}
            </div>
            <div className="min-w-0">
              <h2 className="text-xs font-semibold text-white truncate font-sans leading-tight">
                {file.title || file.filename}
              </h2>
              <p className="text-[9px] text-slate-400 font-mono truncate leading-none mt-0.5">
                {file.filename} • {((file.size_bytes || 0) / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={file.uri}
              download={file.filename}
              className="p-1 rounded bg-white/5 hover:bg-yellow-400/20 text-slate-300 hover:text-yellow-400 flex items-center justify-center"
              title="Download File"
            >
              <Download size={12} strokeWidth={2} />
            </a>
            <button
              onClick={onClose}
              className="p-1 rounded bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center"
            >
              <X size={12} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center px-3 py-1.5 border-b border-white/5 bg-[#08090C] gap-1.5 font-mono text-[10px] font-bold uppercase">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-0.5 rounded-full transition-all leading-none ${
              activeTab === 'preview' ? 'bg-yellow-400 text-black' : 'text-slate-400'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-2.5 py-0.5 rounded-full transition-all leading-none ${
              activeTab === 'text' ? 'bg-yellow-400 text-black' : 'text-slate-400'
            }`}
          >
            Extracted Content
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
          {activeTab === 'preview' && (
            <div className="flex flex-col gap-2 items-center">
              {isPhoto ? (
                <div className="relative rounded-lg overflow-hidden bg-black border border-white/10 flex justify-center max-h-[40vh] w-full">
                  <img
                    src={file.uri}
                    alt={file.filename}
                    style={{ maxHeight: '40vh', maxWidth: '100%', objectFit: 'contain', display: 'block', margin: '0 auto' }}
                  />

                  {/* Face Bounding Boxes */}
                  {file.visual_features?.faces?.map((face, index) => (
                    <div
                      key={face.id || index}
                      style={{
                        position: 'absolute',
                        left: `${face.box.x}%`,
                        top: `${face.box.y}%`,
                        width: `${face.box.w}%`,
                        height: `${face.box.h}%`,
                        border: '1.5px solid #FFDE00',
                        backgroundColor: 'rgba(255, 222, 0, 0.2)',
                        borderRadius: '4px'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '-16px',
                          left: '0',
                          backgroundColor: '#08090C',
                          border: '1px solid #FFDE00',
                          color: '#FFDE00',
                          fontSize: '8px',
                          fontWeight: 'bold',
                          padding: '1px 4px',
                          borderRadius: '9999px',
                          whiteSpace: 'nowrap',
                          textTransform: 'uppercase',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {face.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full">
                  <div className="iqoo-well p-2.5 text-xs text-slate-200 leading-normal max-h-[40vh] overflow-y-auto whitespace-pre-wrap font-mono">
                    {file.ocr_text || file.summary}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="w-full flex flex-wrap gap-1 pt-0.5">
                {matchedPeople.map(p => (
                  <span key={p.id} className="iqoo-badge iqoo-badge-yellow text-[8px] leading-none">
                    <UserCheck size={9} strokeWidth={2} />
                    <span>{p.fullName || p.name}</span>
                  </span>
                ))}
                {location && (
                  <span className="iqoo-badge iqoo-badge-dark text-[8px] flex items-center gap-1 leading-none">
                    <MapPin size={9} strokeWidth={2} className="text-yellow-400" />
                    <span>{location.coarse_name}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="flex flex-col gap-2 text-xs">
              <div className="text-slate-300 leading-normal font-sans">
                <strong className="text-yellow-400">SUMMARY:</strong> {file.summary}
              </div>

              {file.chunks && file.chunks.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="font-bold text-white uppercase font-mono text-[10px]">Indexed Sections:</span>
                  {file.chunks.map((chunk, idx) => (
                    <div key={idx} className="iqoo-well p-2 text-slate-300 leading-normal font-mono text-[10px]">
                      <p>{chunk.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-3 py-2 border-t border-white/5 bg-[#0F1118] flex items-center justify-end">
          <button onClick={onClose} className="iqoo-btn-secondary !py-1 !px-3 text-[10px]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
