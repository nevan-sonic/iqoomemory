import React, { useState } from 'react';
import { MapPin, Plus, Check, Edit2, Compass, FileText } from 'lucide-react';
import { MemoryDatabase } from '../database/db.js';

export function PlacesStudio({ locations = [], files = [], onDataUpdated = () => {}, onOpenViewer = () => {} }) {
  const safeFiles = Array.isArray(files) ? files : [];
  const safeLocations = Array.isArray(locations) ? locations : [];
  const [newLocName, setNewLocName] = useState('');
  const [newLocCity, setNewLocCity] = useState('Chennai');
  const [selectedFileForLoc, setSelectedFileForLoc] = useState(safeFiles[0]?.id || '');
  const [editingLocId, setEditingLocId] = useState(null);
  const [editLocName, setEditLocName] = useState('');

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!newLocName.trim()) return;

    const newLoc = {
      id: `loc-${Date.now()}`,
      file_id: selectedFileForLoc,
      coarse_name: `${newLocName.trim()}, ${newLocCity}`,
      short_name: newLocName.trim(),
      city: newLocCity,
      state: 'Tamil Nadu',
      latitude: 13.0499,
      longitude: 80.2824,
      tags: [newLocName.toLowerCase(), newLocCity.toLowerCase(), 'chennai', 'landmark']
    };

    const currentLocs = MemoryDatabase.getLocations();
    currentLocs.push(newLoc);
    MemoryDatabase.saveLocations(currentLocs);

    if (selectedFileForLoc) {
      const allF = MemoryDatabase.getFiles();
      const targetF = allF.find(f => f.id === selectedFileForLoc);
      if (targetF) {
        targetF.location_id = newLoc.id;
        MemoryDatabase.saveFiles(allF);
      }
    }

    setNewLocName('');
    onDataUpdated();
  };

  const handleSaveEdit = (locId) => {
    if (!editLocName.trim()) return;
    const currentLocs = MemoryDatabase.getLocations();
    const target = currentLocs.find(l => l.id === locId);
    if (target) {
      target.short_name = editLocName.trim();
      target.coarse_name = `${editLocName.trim()}, ${target.city}`;
      MemoryDatabase.saveLocations(currentLocs);
    }
    setEditingLocId(null);
    setEditLocName('');
    onDataUpdated();
  };

  return (
    <div className="flex flex-col gap-3 px-3.5 py-3 pb-6 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400 font-mono leading-none">
            GEO-COORDINATE NODES
          </span>
          <h2 className="font-display font-black text-base text-white uppercase mt-0.5 leading-none">
            Places & Landmarks
          </h2>
        </div>
      </div>

      {/* Locations List */}
      <div className="flex flex-col gap-1.5">
        {safeLocations.map((loc) => {
          const associatedFiles = safeFiles.filter(f => f?.location_id === loc?.id || loc?.file_id === f?.id);
          const isEditing = editingLocId === loc?.id;

          return (
            <div
              key={loc?.id || Math.random()}
              className="iqoo-card p-2.5 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="iqoo-icon-box text-yellow-400 shrink-0">
                    <MapPin size={13} strokeWidth={2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editLocName}
                          onChange={(e) => setEditLocName(e.target.value)}
                          className="bg-[#161822] text-xs text-white px-2 py-0.5 rounded border border-yellow-400/40 font-sans"
                        />
                        <button
                          onClick={() => handleSaveEdit(loc.id)}
                          className="iqoo-btn-primary !text-[9px] !py-0.5 !px-2"
                        >
                          <Check size={10} strokeWidth={2} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-display font-bold text-xs text-white truncate leading-tight">
                          {loc?.short_name || loc?.coarse_name}
                        </h3>
                        <button
                          onClick={() => {
                            setEditingLocId(loc.id);
                            setEditLocName(loc.short_name || loc.coarse_name);
                          }}
                          className="text-slate-500 hover:text-yellow-400 p-0.5"
                        >
                          <Edit2 size={10} strokeWidth={1.5} />
                        </button>
                      </div>
                    )}
                    <p className="text-[9px] text-slate-400 truncate mt-0.5 font-sans leading-none">
                      {loc?.city}, {loc?.state} • {loc?.latitude}°N, {loc?.longitude}°E
                    </p>
                  </div>
                </div>

                <span className="text-[8px] font-mono font-bold bg-[#161822] text-yellow-400 px-1.5 py-0.5 rounded uppercase leading-none shrink-0">
                  {associatedFiles.length} FILES
                </span>
              </div>

              {/* Linked Files Horizontal Chips */}
              {associatedFiles.length > 0 && (
                <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-white/5">
                  <span className="text-[8px] font-bold text-slate-500 uppercase font-mono leading-none mr-0.5">
                    LINKED:
                  </span>
                  {associatedFiles.map(file => (
                    <button
                      key={file.id}
                      onClick={() => onOpenViewer(file)}
                      className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-white/8 hover:bg-yellow-400 hover:text-black text-slate-300 text-[8px] font-medium font-mono transition-colors leading-none"
                    >
                      <FileText size={8} strokeWidth={2} />
                      <span className="truncate max-w-[100px]">{file.filename}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Location Form */}
      <form onSubmit={handleAddLocation} className="iqoo-card p-3 flex flex-col gap-2">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1 leading-none">
          <Plus size={10} strokeWidth={2} className="text-yellow-400" />
          <span>MAP GEOGRAPHIC NODE</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <div className="iqoo-well px-2 py-1">
            <input
              type="text"
              value={newLocName}
              onChange={(e) => setNewLocName(e.target.value)}
              placeholder="Place name (e.g. Marina Beach)"
              className="w-full text-xs text-white placeholder-slate-500 font-sans"
            />
          </div>

          <div className="iqoo-well px-2 py-1">
            <input
              type="text"
              value={newLocCity}
              onChange={(e) => setNewLocCity(e.target.value)}
              placeholder="City (e.g. Chennai)"
              className="w-full text-xs text-white placeholder-slate-500 font-sans"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="iqoo-well px-2 py-1 flex-1">
            <select
              value={selectedFileForLoc}
              onChange={(e) => setSelectedFileForLoc(e.target.value)}
              className="w-full text-xs text-white bg-transparent font-sans"
            >
              {safeFiles.map(f => (
                <option key={f.id} value={f.id} className="bg-[#11131A] text-white">
                  Link: {f.filename}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!newLocName.trim()}
            className={`iqoo-btn-primary !text-[9px] !py-1 !px-3 shrink-0 ${
              !newLocName.trim() ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <Plus size={10} strokeWidth={2} />
            <span>Tag Node</span>
          </button>
        </div>
      </form>
    </div>
  );
}
