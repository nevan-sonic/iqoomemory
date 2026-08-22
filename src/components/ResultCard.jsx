import React from 'react';
import { FileText, ArrowRight, UserCheck, MapPin, Eye } from 'lucide-react';

function formatEntityName(id) {
  if (!id) return '';
  const cleaned = id.replace(/^(person-|loc-|file-)/, '').replace(/-/g, ' ');
  if (cleaned.toLowerCase() === 'cit campus') return 'CIT Campus';
  if (cleaned.toLowerCase() === 'iqoo event') return 'iQOO Meet';
  return cleaned.replace(/\b\w/g, c => c.toUpperCase());
}

export function ResultCard({ result, onOpenViewer, rank }) {
  const { file, score, evidence } = result;

  const isPhoto = file?.media_category === 'photo' || file?.mime_type?.startsWith('image/');
  const confidencePercent = Math.round(score * 100);

  return (
    <div className="iqoo-card p-2.5 flex flex-col gap-2">
      {/* Top Row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          {/* Media Thumbnail */}
          <div
            onClick={() => onOpenViewer(file)}
            className="cursor-pointer relative group shrink-0"
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
                alt={file?.title}
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
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Eye size={12} strokeWidth={2} className="text-white" />
            </div>
          </div>

          {/* Title & Metadata */}
          <div className="flex-1 min-w-0">
            <h3
              onClick={() => onOpenViewer(file)}
              className="text-xs font-semibold text-white hover:text-yellow-400 transition-colors cursor-pointer truncate leading-tight"
            >
              {file?.title || file?.filename}
            </h3>
            <p className="text-[9px] text-slate-400 font-mono truncate mt-0.5 leading-none">
              {file?.filename} • {((file?.size_bytes || 0) / 1024).toFixed(0)} KB
            </p>

            {/* Quick Evidence Chips (Horizontal Inline) */}
            <div className="flex flex-wrap items-center gap-1 mt-1">
              {evidence?.matchedPerson && (
                <span className="inline-flex items-center gap-1 text-[8px] px-1.5 py-0.2 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/25 font-semibold font-sans leading-none">
                  <UserCheck size={9} strokeWidth={2} />
                  <span>{formatEntityName(evidence.matchedPerson)}</span>
                </span>
              )}
              {evidence?.matchedLocation && (
                <span className="inline-flex items-center gap-1 text-[8px] px-1.5 py-0.2 rounded bg-white/8 text-slate-300 font-semibold font-sans leading-none">
                  <MapPin size={9} strokeWidth={2} className="text-yellow-400" />
                  <span>{formatEntityName(evidence.matchedLocation)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Confidence Pill & Open Button */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="iqoo-badge iqoo-badge-yellow text-[8px] font-mono leading-none">
            {confidencePercent}% MATCH
          </span>
          <button
            onClick={() => onOpenViewer(file)}
            className="text-[10px] font-semibold text-yellow-400 hover:underline flex items-center gap-0.5 uppercase tracking-wide font-mono leading-none mt-0.5"
          >
            <span>View</span>
            <ArrowRight size={10} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Snippet Preview */}
      {evidence?.matchedSnippets && evidence.matchedSnippets.length > 0 ? (
        <div className="iqoo-well p-1.5 text-[10px] text-slate-300 leading-normal font-sans">
          <p className="italic line-clamp-2">
            "...{evidence.matchedSnippets[0]}..."
          </p>
        </div>
      ) : (
        <p className="text-[10px] text-slate-400 line-clamp-2 leading-normal font-sans">
          {file?.summary}
        </p>
      )}
    </div>
  );
}
