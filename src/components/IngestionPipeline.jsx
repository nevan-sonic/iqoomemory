import React from 'react';
import { RefreshCw, FileText, CheckCircle2, UserCheck, MapPin } from 'lucide-react';
import { MemoryDatabase } from '../database/db.js';

function formatEntityName(id) {
  if (!id) return '';
  const cleaned = id.replace(/^(person-|loc-|file-)/, '').replace(/-/g, ' ');
  if (cleaned.toLowerCase() === 'cit campus') return 'CIT Campus';
  if (cleaned.toLowerCase() === 'iqoo event') return 'iQOO Meet';
  return cleaned.replace(/\b\w/g, c => c.toUpperCase());
}

export function IngestionPipeline({ files = [], onFilesUpdated = () => {}, onResetData = () => {}, onOpenViewer = () => {} }) {
  const safeFiles = Array.isArray(files) ? files : [];

  const handleReset = () => {
    MemoryDatabase.resetToDefault();
    onFilesUpdated();
  };

  const totalBytes = safeFiles.reduce((acc, f) => acc + (f?.size_bytes || 0), 0);
  const totalKb = (totalBytes / 1024).toFixed(0);

  return (
    <div className="flex flex-col gap-3 px-3.5 py-3 pb-6 max-w-md mx-auto w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400 font-mono leading-none">
            MEMORY STORAGE
          </span>
          <h2 className="font-display font-black text-base text-white uppercase mt-0.5 leading-none">
            Indexed Files
          </h2>
        </div>

        <button
          onClick={handleReset}
          className="iqoo-btn-secondary !text-[9px] !py-1 !px-2.5"
          title="Reset demo dataset"
        >
          <RefreshCw className="w-2.5 h-2.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Memory Allocation Card */}
      <div className="iqoo-card-yellow p-3 flex flex-col justify-between gap-1.5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-bold uppercase tracking-wider font-mono bg-black/10 px-1.5 py-0.2 rounded text-black leading-none">
            ALLOCATED STORAGE
          </span>
          <span className="text-xs font-bold font-display text-black leading-none">
            {totalKb} KB
          </span>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-tight leading-tight uppercase font-display text-black">
            4 / 4 DATASET ITEMS VERIFIED
          </h3>
          <p className="text-[9px] font-semibold text-black/85 mt-0.5 font-mono">
            AES256-GCM Hardware Encrypted
          </p>
        </div>

        <div className="w-full h-1 bg-black/20 rounded-full overflow-hidden">
          <div className="h-full bg-black rounded-full" style={{ width: '8%' }} />
        </div>
      </div>

      {/* 4 Demo Files List */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          CANONICAL RECORDS ({safeFiles.length})
        </span>

        <div className="flex flex-col gap-1.5">
          {safeFiles.map((file) => {
            const isPhoto = file?.media_category === 'photo' || file?.mime_type?.startsWith('image/');
            return (
              <div
                key={file?.id || Math.random()}
                onClick={() => onOpenViewer(file)}
                className="iqoo-card p-2.5 flex flex-col gap-1.5 cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      minWidth: '36px',
                      maxWidth: '36px',
                      minHeight: '36px',
                      maxHeight: '36px',
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
                          width: '36px',
                          height: '36px',
                          minWidth: '36px',
                          maxWidth: '36px',
                          minHeight: '36px',
                          maxHeight: '36px',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    ) : (
                      <FileText className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate hover:text-yellow-400 transition-colors leading-tight">
                      {file?.title || file?.filename}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate mt-0.5 font-mono leading-none">
                      {file?.filename} • {((file?.size_bytes || 0) / 1024).toFixed(0)} KB
                    </p>
                  </div>

                  <div className="iqoo-badge iqoo-badge-dark shrink-0 font-mono text-[8px] flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-yellow-400" />
                    <span>INDEXED</span>
                  </div>
                </div>

                {/* Horizontal Inline Details Bar */}
                <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-white/5">
                  {file?.person_ids?.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[8px] px-1.5 py-0.2 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/25 font-semibold font-sans leading-none">
                      <UserCheck className="w-2.5 h-2.5" />
                      <span>{file.person_ids.map(formatEntityName).join(', ')}</span>
                    </span>
                  )}
                  {file?.location_id && (
                    <span className="inline-flex items-center gap-1 text-[8px] px-1.5 py-0.2 rounded bg-white/8 text-slate-300 font-semibold font-sans leading-none">
                      <MapPin className="w-2.5 h-2.5 text-yellow-400" />
                      <span>{formatEntityName(file.location_id)}</span>
                    </span>
                  )}
                  <span className="text-[9px] text-slate-400 font-sans truncate max-w-[180px] leading-none ml-1">
                    {file?.summary?.substring(0, 48)}...
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
