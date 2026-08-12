import { NoteItem } from '../types';
import { INITIAL_NOTES } from '../data/initialNotes';

const NOTES_STORAGE_KEY = 'study_os_user_clean_notes';
const OLD_NOTES_STORAGE_KEY = 'study_os_zero_notes_items';
const IDB_NAME = 'StudyOS_NotesDB';
const IDB_STORE = 'file_blobs';
const IDB_VERSION = 1;

// IndexedDB Helper for handling large file Blobs (PDFs and Videos)
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }
    const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
  });
}

export async function saveFileBlobToIDB(blobId: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.put(blob, blobId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to save file blob to IndexedDB:', err);
  }
}

export async function getFileBlobFromIDB(blobId: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(blobId);
      req.onsuccess = () => resolve((req.result as Blob) || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to read file blob from IndexedDB:', err);
    return null;
  }
}

export async function deleteFileBlobFromIDB(blobId: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      const req = store.delete(blobId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to delete file blob from IndexedDB:', err);
  }
}

// LocalStorage helpers for Notes metadata
export function loadNotesFromStorage(): NoteItem[] {
  try {
    localStorage.removeItem(OLD_NOTES_STORAGE_KEY);
    const saved = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.warn('Error reading notes from storage:', e);
    return [];
  }
}

export function saveNotesToStorage(notes: NoteItem[]): void {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.warn('Error saving notes to storage:', e);
  }
}

// Utility to parse YouTube URLs into Video ID
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Helper to format file size in human-readable string
export function formatFileSize(bytes?: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Export All Notes Data as JSON Backup
export async function exportNotesBackupJSON(notes: NoteItem[]): Promise<void> {
  const exportData = {
    app: 'Study Productivity OS',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    notesCount: notes.length,
    notes: notes,
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `StudyOS_Notes_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Download individual note / file
export async function downloadNoteItem(note: NoteItem): Promise<void> {
  if (note.type === 'pdf' || note.type === 'video') {
    if (note.fileBlobId) {
      const blob = await getFileBlobFromIDB(note.fileBlobId);
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = note.fileName || `${note.title}.${note.type === 'pdf' ? 'pdf' : 'mp4'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }
    }
  }

  // Text note or formula download as markdown / text
  const fileContent = `Title: ${note.title}
Type: ${note.type.toUpperCase()}
Category: ${note.category || 'General'}
Date: ${new Date(note.updatedAt || note.createdAt).toLocaleString()}
${note.youtubeUrl ? `YouTube Link: ${note.youtubeUrl}\n` : ''}
--------------------------------------------------
${note.content || ''}`;

  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
