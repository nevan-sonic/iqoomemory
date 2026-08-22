import React, { useState, useEffect } from 'react';
import { MemoryDatabase } from './database/db.js';
import { parseQueryIntent, synthesizeAnswer } from './engine/queryParser.js';
import { executeRetrieval } from './engine/retrievalEngine.js';
import { MobileFrame } from './components/MobileFrame.jsx';
import { Header } from './components/Header.jsx';
import { SearchHub } from './components/SearchHub.jsx';
import { IngestionPipeline } from './components/IngestionPipeline.jsx';
import { PeopleStudio } from './components/PeopleStudio.jsx';
import { PlacesStudio } from './components/PlacesStudio.jsx';
import { DatabaseInspector } from './components/DatabaseInspector.jsx';
import { FileViewerModal } from './components/FileViewerModal.jsx';
import { Search, FileText, Users, MapPin, HardDrive } from 'lucide-react';

export default function App() {
  const [files, setFiles] = useState([]);
  const [people, setPeople] = useState([]);
  const [locations, setLocations] = useState([]);
  const [memories, setMemories] = useState([]);
  const [stats, setStats] = useState(null);

  // Tab Names: 'search' | 'files' | 'people' | 'places' | 'db'
  const [activeTab, setActiveTab] = useState('search');
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);

  // Search & Retrieval States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [queryResults, setQueryResults] = useState(null);
  const [parsedIntent, setParsedIntent] = useState(null);
  const [aiAnswer, setAiAnswer] = useState(null);

  const refreshData = () => {
    const loadedFiles = MemoryDatabase.getFiles();
    const loadedPeople = MemoryDatabase.getPeople();
    const loadedLocations = MemoryDatabase.getLocations();
    const loadedMemories = MemoryDatabase.getMemories();
    const dbStats = MemoryDatabase.getStats();

    setFiles(loadedFiles);
    setPeople(loadedPeople);
    setLocations(loadedLocations);
    setMemories(loadedMemories);
    setStats(dbStats);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleExecuteSearch = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    setIsSearching(true);

    try {
      const intent = await parseQueryIntent(queryText, airplaneMode, people, locations);
      setParsedIntent(intent);

      const retrievalResult = executeRetrieval(intent, files, people, locations);
      setQueryResults(retrievalResult.results);

      const answer = await synthesizeAnswer(queryText, retrievalResult.results, airplaneMode);
      setAiAnswer(answer);
    } catch (err) {
      console.error('Search execution failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <MobileFrame>
      {/* Top Header */}
      <Header
        airplaneMode={airplaneMode}
        setAirplaneMode={setAirplaneMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
      />

      {/* Main Content Area */}
      <main className="app-screen-content">
        {activeTab === 'search' && (
          <SearchHub
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onExecuteSearch={handleExecuteSearch}
            isSearching={isSearching}
            queryResults={queryResults}
            parsedIntent={parsedIntent}
            aiAnswer={aiAnswer}
            airplaneMode={airplaneMode}
            onOpenViewer={(f) => setViewingFile(f)}
            allPeople={people}
            allLocations={locations}
            files={files}
            onNavigateTab={(t) => setActiveTab(t)}
          />
        )}

        {activeTab === 'files' && (
          <IngestionPipeline
            files={files}
            onFilesUpdated={refreshData}
            onResetData={refreshData}
            onOpenViewer={(f) => setViewingFile(f)}
          />
        )}

        {activeTab === 'people' && (
          <PeopleStudio
            people={people}
            files={files}
            onDataUpdated={refreshData}
            onOpenViewer={(f) => setViewingFile(f)}
          />
        )}

        {activeTab === 'places' && (
          <PlacesStudio
            locations={locations}
            files={files}
            onDataUpdated={refreshData}
            onOpenViewer={(f) => setViewingFile(f)}
          />
        )}

        {activeTab === 'db' && (
          <DatabaseInspector
            files={files}
            people={people}
            locations={locations}
            stats={stats}
            onResetData={refreshData}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="origin-bottom-nav">
        <button
          onClick={() => setActiveTab('search')}
          className={`nav-tab-btn ${activeTab === 'search' ? 'active' : ''}`}
        >
          <Search size={14} strokeWidth={1.75} />
          <span>Search</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`nav-tab-btn ${activeTab === 'files' ? 'active' : ''}`}
        >
          <FileText size={14} strokeWidth={1.75} />
          <span>Files</span>
        </button>

        <button
          onClick={() => setActiveTab('people')}
          className={`nav-tab-btn ${activeTab === 'people' ? 'active' : ''}`}
        >
          <Users size={14} strokeWidth={1.75} />
          <span>People</span>
        </button>

        <button
          onClick={() => setActiveTab('places')}
          className={`nav-tab-btn ${activeTab === 'places' ? 'active' : ''}`}
        >
          <MapPin size={14} strokeWidth={1.75} />
          <span>Places</span>
        </button>

        <button
          onClick={() => setActiveTab('db')}
          className={`nav-tab-btn ${activeTab === 'db' ? 'active' : ''}`}
        >
          <HardDrive size={14} strokeWidth={1.75} />
          <span>Storage</span>
        </button>
      </nav>

      {/* File Viewer Modal */}
      {viewingFile && (
        <FileViewerModal
          file={viewingFile}
          onClose={() => setViewingFile(null)}
          allPeople={people}
          allLocations={locations}
        />
      )}
    </MobileFrame>
  );
}
