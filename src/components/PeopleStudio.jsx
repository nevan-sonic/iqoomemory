import React, { useState } from 'react';
import { Users, UserPlus, Tag, Check, User } from 'lucide-react';
import { MemoryDatabase } from '../database/db.js';
import { assignFaceToPerson } from '../engine/faceEngine.js';

export function PeopleStudio({ people = [], files = [], onDataUpdated = () => {}, onOpenViewer = () => {} }) {
  const safeFiles = Array.isArray(files) ? files : [];
  const safePeople = Array.isArray(people) ? people : [];
  const [selectedPhoto, setSelectedPhoto] = useState(safeFiles.find(f => f?.filename === 'friend.jpeg') || safeFiles[0] || null);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRole, setNewPersonRole] = useState('Friend');
  const [editingFaceIdx, setEditingFaceIdx] = useState(null);
  const [taggingName, setTaggingName] = useState('');

  const handleAddPerson = (e) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;

    const newPerson = {
      id: `person-${newPersonName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: newPersonName.trim(),
      fullName: newPersonName.trim(),
      role: newPersonRole,
      avatar: selectedPhoto?.uri || '/assets/friend.jpeg',
      created_at: Date.now(),
      tags: [newPersonName.toLowerCase(), newPersonRole.toLowerCase()],
      faceEmbeddingsCount: 1
    };

    const currentPeople = MemoryDatabase.getPeople();
    currentPeople.push(newPerson);
    MemoryDatabase.savePeople(currentPeople);

    setNewPersonName('');
    onDataUpdated();
  };

  const handleAssignFace = (faceIndex) => {
    if (!taggingName.trim() || !selectedPhoto) return;

    let targetPerson = safePeople.find(p => p.name.toLowerCase() === taggingName.trim().toLowerCase());
    let personId = targetPerson ? targetPerson.id : `person-${taggingName.toLowerCase().replace(/\s+/g, '-')}`;

    if (!targetPerson) {
      const newP = {
        id: personId,
        name: taggingName.trim(),
        fullName: taggingName.trim(),
        role: 'Friend',
        avatar: selectedPhoto.uri,
        created_at: Date.now(),
        tags: [taggingName.toLowerCase()]
      };
      const currentPeople = MemoryDatabase.getPeople();
      currentPeople.push(newP);
      MemoryDatabase.savePeople(currentPeople);
    }

    assignFaceToPerson(selectedPhoto.id, faceIndex, personId);
    setEditingFaceIdx(null);
    setTaggingName('');
    onDataUpdated();
  };

  const photoFiles = safeFiles.filter(f => f?.media_category === 'photo' || f?.mime_type?.startsWith('image/'));

  return (
    <div className="flex flex-col gap-3 px-3.5 py-3 pb-6 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-yellow-400 font-mono leading-none">
            IDENTITY VECTORS
          </span>
          <h2 className="font-display font-black text-base text-white uppercase mt-0.5 leading-none">
            People & Faces
          </h2>
        </div>
      </div>

      {/* People Profile Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {safePeople.map((person) => {
          const isNevan = person?.name?.toLowerCase().includes('nevan');
          const isPrithiv = person?.name?.toLowerCase().includes('prithiv');

          return (
            <div
              key={person?.id || Math.random()}
              className="iqoo-card p-2.5 flex items-center gap-2.5"
            >
              {/* Avatar */}
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  minWidth: '36px',
                  maxWidth: '36px',
                  minHeight: '36px',
                  maxHeight: '36px',
                  borderRadius: '9999px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: isNevan ? '1.5px solid #FFDE00' : '1px solid rgba(255, 255, 255, 0.15)',
                  backgroundColor: '#161822',
                  backgroundImage: person?.avatar ? `url("${person.avatar}")` : 'none',
                  backgroundPosition: isNevan ? '56% 25%' : isPrithiv ? '38% 38%' : 'center',
                  backgroundSize: isNevan ? '240%' : isPrithiv ? '350%' : 'cover'
                }}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="font-display font-bold text-xs text-white truncate leading-tight">
                    {person?.fullName || person?.name}
                  </h3>
                  {isNevan && (
                    <span className="text-[7px] font-mono font-bold bg-yellow-400 text-black px-1.5 py-0.2 rounded-full uppercase leading-none">
                      OWNER
                    </span>
                  )}
                </div>
                <p className="text-[9px] text-slate-400 truncate mt-0.5 font-sans leading-tight">
                  {person?.role || 'Indexed Contact'}
                </p>
                {person?.distinguishingFeatures && (
                  <p className="text-[8px] text-yellow-400/90 truncate font-mono mt-0.5 leading-none">
                    {person.distinguishingFeatures}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Face Tagging Section */}
      <div className="iqoo-card p-3 flex flex-col gap-2">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1 leading-none">
          <Tag size={10} strokeWidth={2} className="text-yellow-400" />
          <span>FACE CLUSTERING</span>
        </span>

        {/* Photo Selector */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {photoFiles.map((photo) => (
            <button
              key={photo?.id || Math.random()}
              onClick={() => setSelectedPhoto(photo)}
              className={`px-2 py-1 rounded text-[9px] font-mono transition-all uppercase leading-none ${
                selectedPhoto?.id === photo?.id
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'bg-[#161822] text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              {photo?.filename}
            </button>
          ))}
        </div>

        {/* Interactive Bounding Box Viewer */}
        {selectedPhoto && (
          <div className="flex flex-col gap-2">
            <div className="relative w-full rounded-lg overflow-hidden border border-white/10 bg-black flex items-center justify-center">
              <img
                src={selectedPhoto?.uri}
                alt="Face recognition view"
                className="w-full h-auto max-h-48 object-contain"
              />

              {/* Render Detected Faces */}
              {selectedPhoto?.faces?.map((face, fIdx) => {
                const [x, y, w, h] = face?.box || [0, 0, 0, 0];
                const isTagged = !!face?.person_id;
                const personObj = safePeople.find(p => p.id === face?.person_id);

                return (
                  <div
                    key={fIdx}
                    onClick={() => setEditingFaceIdx(editingFaceIdx === fIdx ? null : fIdx)}
                    style={{
                      position: 'absolute',
                      left: `${x * 100}%`,
                      top: `${y * 100}%`,
                      width: `${w * 100}%`,
                      height: `${h * 100}%`,
                      border: isTagged ? '1.5px solid #FFDE00' : '1.5px dashed #FFDE00',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      boxShadow: '0 0 8px rgba(0,0,0,0.8)'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '-16px',
                        left: '0',
                        backgroundColor: '#08090C',
                        color: isTagged ? '#FFDE00' : '#FFFFFF',
                        border: '1px solid rgba(255, 222, 0, 0.4)',
                        borderRadius: '4px',
                        padding: '1px 4px',
                        fontSize: '8px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        lineHeight: '1'
                      }}
                    >
                      {personObj ? personObj.name : 'Unknown Face'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* If a face box is clicked */}
            {editingFaceIdx !== null && (
              <div className="iqoo-well p-2 flex items-center gap-1.5">
                <input
                  type="text"
                  value={taggingName}
                  onChange={(e) => setTaggingName(e.target.value)}
                  placeholder="Enter person name (e.g. Prithiv)"
                  className="w-full text-xs text-white placeholder-slate-500 font-sans"
                />
                <button
                  type="button"
                  onClick={() => handleAssignFace(editingFaceIdx)}
                  className="iqoo-btn-primary !text-[9px] !py-1 !px-2.5 shrink-0"
                >
                  <Check size={10} strokeWidth={2} />
                  <span>Assign</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add New Person Form */}
      <form onSubmit={handleAddPerson} className="iqoo-card p-3 flex flex-col gap-2">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1 leading-none">
          <UserPlus size={10} strokeWidth={2} className="text-yellow-400" />
          <span>ADD IDENTITY PROFILE</span>
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          <div className="iqoo-well px-2 py-1">
            <input
              type="text"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              placeholder="Name (e.g. Rahul)"
              className="w-full text-xs text-white placeholder-slate-500 font-sans"
            />
          </div>

          <div className="iqoo-well px-2 py-1">
            <input
              type="text"
              value={newPersonRole}
              onChange={(e) => setNewPersonRole(e.target.value)}
              placeholder="Relationship / Role"
              className="w-full text-xs text-white placeholder-slate-500 font-sans"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!newPersonName.trim()}
          className={`iqoo-btn-primary !text-[9px] !py-1 !px-3 self-end ${
            !newPersonName.trim() ? 'opacity-40 cursor-not-allowed' : ''
          }`}
        >
          <UserPlus size={10} strokeWidth={2} />
          <span>Save Profile</span>
        </button>
      </form>
    </div>
  );
}
