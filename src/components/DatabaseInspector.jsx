import React, { useState } from 'react';
import { HardDrive, ShieldCheck, FileText, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export function DatabaseInspector({ files = [], people = [], locations = [], stats = null, onResetData = () => {} }) {
  const [filter, setFilter] = useState('all');

  const safeFiles = Array.isArray(files) ? files : [];
  const photos = safeFiles.filter(f => f?.media_category === 'photo' || f?.mime_type?.startsWith('image/'));
  const docs = safeFiles.filter(f => f?.media_category === 'document' || f?.mime_type?.includes('pdf') || f?.filename?.endsWith('.pdf'));

  const displayedFiles = filter === 'photos' ? photos : filter === 'docs' ? docs : safeFiles;

  return (
    <div className="flex flex-col gap-3 px-3.5 py-3 pb-6 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400 font-mono leading-none">
            ON-DEVICE INTEGRITY
          </span>
          <h2 className="font-display font-black text-base text-white uppercase mt-0.5 leading-none">
            Storage & Security
          </h2>
        </div>
      </div>

      {/* Hero Yellow Privacy & Storage Card */}
      <div className="iqoo-card-yellow p-3 flex flex-col justify-between gap-1.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold uppercase tracking-wider font-mono bg-black/10 px-1.5 py-0.2 rounded text-black leading-none">
            HARDWARE KEYSTORE
          </span>
          <span className="text-xs font-bold font-display text-black leading-none">
            AES-256
          </span>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-tight leading-tight uppercase font-display text-black">
            100% PRIVATE ON-DEVICE
          </h3>
          <p className="text-[9px] font-semibold text-black/85 mt-0.5 font-mono">
            Zero Cloud Uploads • Zero Telemetry
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-black/15 font-mono text-[8px] font-bold text-black leading-none">
          <span>STORAGE USED: {stats?.totalSizeFormatted || '367 KB'}</span>
          <span>{safeFiles.length} ITEMS</span>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono tracking-wider transition-all leading-none ${
            filter === 'all'
              ? 'bg-yellow-400 text-black'
              : 'iqoo-card text-slate-300 hover:text-white'
          }`}
        >
          All ({safeFiles.length})
        </button>
        <button
          onClick={() => setFilter('photos')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono tracking-wider transition-all leading-none ${
            filter === 'photos'
              ? 'bg-yellow-400 text-black'
              : 'iqoo-card text-slate-300 hover:text-white'
          }`}
        >
          Photos ({photos.length})
        </button>
        <button
          onClick={() => setFilter('docs')}
          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase font-mono tracking-wider transition-all leading-none ${
            filter === 'docs'
              ? 'bg-yellow-400 text-black'
              : 'iqoo-card text-slate-300 hover:text-white'
          }`}
        >
          Docs ({docs.length})
        </button>
      </div>

      {/* Files List */}
      <div className="flex flex-col gap-1.5">
        {displayedFiles.map(file => {
          const isPhoto = file?.media_category === 'photo' || file?.mime_type?.startsWith('image/');
          return (
            <div
              key={file?.id || Math.random()}
              className="iqoo-card p-2.5 flex items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    minWidth: '32px',
                    maxWidth: '32px',
                    minHeight: '32px',
                    maxHeight: '32px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#161822',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  {isPhoto ? (
                    <img
                      src={file?.uri}
                      alt={file?.filename}
                      style={{
                        width: '32px',
                        height: '32px',
                        minWidth: '32px',
                        maxWidth: '32px',
                        minHeight: '32px',
                        maxHeight: '32px',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                  ) : (
                    <FileText size={14} strokeWidth={1.75} className="text-yellow-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate leading-tight">
                    {file?.title || file?.filename}
                  </p>
                  <p className="text-[9px] text-slate-400 truncate mt-0.5 font-mono leading-none">
                    {file?.filename} • {((file?.size_bytes || 0) / 1024).toFixed(0)} KB
                  </p>
                </div>
              </div>

              <div className="iqoo-badge iqoo-badge-dark shrink-0 font-mono text-[8px] flex items-center gap-1">
                <CheckCircle2 size={10} strokeWidth={2} className="text-yellow-400" />
                <span>INDEXED</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
