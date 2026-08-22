import { INITIAL_FILES, INITIAL_PEOPLE, INITIAL_LOCATIONS, INITIAL_MEMORIES } from './initialDataset.js';

const DB_KEY_FILES = 'iqoo_memory_files_v1';
const DB_KEY_PEOPLE = 'iqoo_memory_people_v1';
const DB_KEY_LOCATIONS = 'iqoo_memory_locations_v1';
const DB_KEY_MEMORIES = 'iqoo_memory_memories_v1';
const DB_KEY_SETTINGS = 'iqoo_memory_settings_v1';

export class MemoryDatabase {
  static getFiles() {
    try {
      const data = localStorage.getItem(DB_KEY_FILES);
      if (!data) {
        this.saveFiles(INITIAL_FILES);
        return INITIAL_FILES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading files:', e);
      return INITIAL_FILES;
    }
  }

  static saveFiles(files) {
    try {
      localStorage.setItem(DB_KEY_FILES, JSON.stringify(files));
    } catch (e) {
      console.error('Error saving files:', e);
    }
  }

  static getPeople() {
    try {
      const data = localStorage.getItem(DB_KEY_PEOPLE);
      if (!data) {
        this.savePeople(INITIAL_PEOPLE);
        return INITIAL_PEOPLE;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading people:', e);
      return INITIAL_PEOPLE;
    }
  }

  static savePeople(people) {
    try {
      localStorage.setItem(DB_KEY_PEOPLE, JSON.stringify(people));
    } catch (e) {
      console.error('Error saving people:', e);
    }
  }

  static getLocations() {
    try {
      const data = localStorage.getItem(DB_KEY_LOCATIONS);
      if (!data) {
        this.saveLocations(INITIAL_LOCATIONS);
        return INITIAL_LOCATIONS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading locations:', e);
      return INITIAL_LOCATIONS;
    }
  }

  static saveLocations(locations) {
    try {
      localStorage.setItem(DB_KEY_LOCATIONS, JSON.stringify(locations));
    } catch (e) {
      console.error('Error saving locations:', e);
    }
  }

  static getMemories() {
    try {
      const data = localStorage.getItem(DB_KEY_MEMORIES);
      if (!data) {
        this.saveMemories(INITIAL_MEMORIES);
        return INITIAL_MEMORIES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error loading memories:', e);
      return INITIAL_MEMORIES;
    }
  }

  static saveMemories(memories) {
    try {
      localStorage.setItem(DB_KEY_MEMORIES, JSON.stringify(memories));
    } catch (e) {
      console.error('Error saving memories:', e);
    }
  }

  static getSettings() {
    try {
      const data = localStorage.getItem(DB_KEY_SETTINGS);
      if (!data) {
        const defaults = {
          airplaneMode: false,
          useGroqParser: true,
          showDebugScore: true,
          confidenceThreshold: 0.35,
          onDeviceOnly: false
        };
        localStorage.setItem(DB_KEY_SETTINGS, JSON.stringify(defaults));
        return defaults;
      }
      return JSON.parse(data);
    } catch (e) {
      return { airplaneMode: false, useGroqParser: true, showDebugScore: true, confidenceThreshold: 0.35 };
    }
  }

  static saveSettings(settings) {
    try {
      localStorage.setItem(DB_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  }

  static addFile(file) {
    const files = this.getFiles();
    const existingIndex = files.findIndex(f => f.sha256 === file.sha256 || f.id === file.id);
    if (existingIndex >= 0) {
      files[existingIndex] = file;
    } else {
      files.unshift(file);
    }
    this.saveFiles(files);
    return file;
  }

  static deleteFile(fileId) {
    let files = this.getFiles();
    files = files.filter(f => f.id !== fileId);
    this.saveFiles(files);

    // Cascade delete in locations & memories
    let locations = this.getLocations().filter(l => l.file_id !== fileId);
    this.saveLocations(locations);

    let memories = this.getMemories().map(m => ({
      ...m,
      evidence: m.evidence.filter(e => e.file_id !== fileId)
    })).filter(m => m.evidence.length > 0);
    this.saveMemories(memories);
  }

  static addPerson(person) {
    const people = this.getPeople();
    const existing = people.findIndex(p => p.id === person.id || p.name.toLowerCase() === person.name.toLowerCase());
    if (existing >= 0) {
      people[existing] = { ...people[existing], ...person };
    } else {
      people.push(person);
    }
    this.savePeople(people);
    return person;
  }

  static addLocation(location) {
    const locations = this.getLocations();
    const existing = locations.findIndex(l => l.id === location.id);
    if (existing >= 0) {
      locations[existing] = location;
    } else {
      locations.push(location);
    }
    this.saveLocations(locations);
    return location;
  }

  static resetToDefault() {
    this.saveFiles(INITIAL_FILES);
    this.savePeople(INITIAL_PEOPLE);
    this.saveLocations(INITIAL_LOCATIONS);
    this.saveMemories(INITIAL_MEMORIES);
  }

  static getStats() {
    const files = this.getFiles();
    const people = this.getPeople();
    const locations = this.getLocations();
    const memories = this.getMemories();

    let totalChunks = 0;
    let totalFaces = 0;
    let totalSize = 0;

    files.forEach(f => {
      totalSize += f.size_bytes || 0;
      if (f.chunks) totalChunks += f.chunks.length;
      if (f.visual_features?.faces) totalFaces += f.visual_features.faces.length;
    });

    return {
      totalFiles: files.length,
      totalPeople: people.length,
      totalLocations: locations.length,
      totalMemories: memories.length,
      totalChunks,
      totalFaces,
      totalSizeBytes: totalSize,
      totalSizeFormatted: `${(totalSize / 1024).toFixed(1)} KB`,
      vectorCount: (files.length * 2) + totalChunks
    };
  }
}
