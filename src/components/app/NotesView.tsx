import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  FileCode,
  Video,
  Youtube,
  Sigma,
  Star,
  Trash2,
  Download,
  Upload,
  Plus,
  Search,
  Grid,
  List,
  Sparkles,
  Edit3,
  Check,
  X,
  Copy,
  ExternalLink,
  MoreVertical,
  RotateCcw,
  BookOpen,
  Film,
  FileDown,
  Trash,
  Bold,
  Italic,
  Underline,
  ListOrdered,
  List as ListIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  AlertCircle
} from 'lucide-react';
import { NoteItem, NoteType } from '../../types';
import {
  loadNotesFromStorage,
  saveNotesToStorage,
  saveFileBlobToIDB,
  getFileBlobFromIDB,
  deleteFileBlobFromIDB,
  extractYouTubeId,
  formatFileSize,
  exportNotesBackupJSON,
  downloadNoteItem
} from '../../utils/notesStorage';

type CategoryFilter = 'all' | 'text' | 'pdf' | 'video' | 'youtube' | 'formula' | 'favorites' | 'trash';
type SortOption = 'newest' | 'oldest' | 'title';

export const NotesView: React.FC = () => {
  const [notes, setNotes] = useState<NoteItem[]>(() => loadNotesFromStorage());
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Editor states for active selected note
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('General');

  // Blob Object URL state for rendering active PDF or Video
  const [activeBlobUrl, setActiveBlobUrl] = useState<string | null>(null);
  const [isLoadingBlob, setIsLoadingBlob] = useState<boolean>(false);

  // Modals
  const [modalType, setModalType] = useState<'text' | 'pdf' | 'video' | 'youtube' | 'formula' | 'import' | null>(null);
  
  // Modal Form Inputs
  const [newTitle, setNewTitle] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Physics');
  const [newYoutubeUrl, setNewYoutubeUrl] = useState<string>('');
  const [newFormulaSubject, setNewFormulaSubject] = useState<'Physics' | 'Chemistry' | 'Mathematics' | 'General'>('Physics');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Notifications & Copy state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Action Menu state for note cards
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonImportRef = useRef<HTMLInputElement>(null);

  // Persist notes on state changes
  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  // Set default selected note on load or category change
  const activeNotesList = notes.filter(n => !n.inTrash);
  useEffect(() => {
    if (!selectedNoteId && activeNotesList.length > 0) {
      setSelectedNoteId(activeNotesList[0].id);
    }
  }, [notes]);

  const selectedNote = notes.find(n => n.id === selectedNoteId) || null;

  // Load blob for current selected PDF or Video note
  useEffect(() => {
    let currentUrl: string | null = null;
    let isMounted = true;

    async function loadBlob() {
      if (!selectedNote) {
        setActiveBlobUrl(null);
        return;
      }

      if ((selectedNote.type === 'pdf' || selectedNote.type === 'video') && selectedNote.fileBlobId) {
        setIsLoadingBlob(true);
        const blob = await getFileBlobFromIDB(selectedNote.fileBlobId);
        if (isMounted) {
          if (blob) {
            currentUrl = URL.createObjectURL(blob);
            setActiveBlobUrl(currentUrl);
          } else {
            setActiveBlobUrl(null);
          }
          setIsLoadingBlob(false);
        }
      } else {
        setActiveBlobUrl(null);
      }
    }

    loadBlob();

    return () => {
      isMounted = false;
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [selectedNoteId, selectedNote?.fileBlobId]);

  // Sync edit mode fields when selected note changes
  useEffect(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content || '');
      setEditCategory(selectedNote.category || 'General');
      setIsEditing(false);
    }
  }, [selectedNoteId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Category counts
  const counts = {
    all: notes.filter(n => !n.inTrash).length,
    text: notes.filter(n => !n.inTrash && n.type === 'text').length,
    pdf: notes.filter(n => !n.inTrash && n.type === 'pdf').length,
    video: notes.filter(n => !n.inTrash && n.type === 'video').length,
    youtube: notes.filter(n => !n.inTrash && n.type === 'youtube').length,
    formula: notes.filter(n => !n.inTrash && n.type === 'formula').length,
    favorites: notes.filter(n => !n.inTrash && n.isFavorite).length,
    trash: notes.filter(n => n.inTrash).length,
  };

  // Filter notes by search & active category
  const filteredNotes = notes.filter(note => {
    if (activeCategory === 'trash') {
      if (!note.inTrash) return false;
    } else {
      if (note.inTrash) return false;
      if (activeCategory === 'favorites' && !note.isFavorite) return false;
      if (activeCategory === 'text' && note.type !== 'text') return false;
      if (activeCategory === 'pdf' && note.type !== 'pdf') return false;
      if (activeCategory === 'video' && note.type !== 'video') return false;
      if (activeCategory === 'youtube' && note.type !== 'youtube') return false;
      if (activeCategory === 'formula' && note.type !== 'formula') return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = note.title.toLowerCase().includes(q);
      const matchContent = note.content?.toLowerCase().includes(q);
      const matchCategory = note.category?.toLowerCase().includes(q);
      const matchFileName = note.fileName?.toLowerCase().includes(q);
      return matchTitle || matchContent || matchCategory || matchFileName;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.updatedAt || a.createdAt).getTime() - new Date(b.updatedAt || b.createdAt).getTime();
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Action handlers
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
    showToast('Updated favorites');
  };

  const moveToTrash = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, inTrash: true } : n));
    showToast('Moved note to Trash');
    setMenuOpenId(null);
  };

  const restoreFromTrash = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, inTrash: false } : n));
    showToast('Restored note from Trash');
    setMenuOpenId(null);
  };

  const deletePermanently = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const noteToDelete = notes.find(n => n.id === id);
    if (!noteToDelete) return;

    if (window.confirm(`Permanently delete "${noteToDelete.title}"? This cannot be undone.`)) {
      if (noteToDelete.fileBlobId) {
        await deleteFileBlobFromIDB(noteToDelete.fileBlobId);
      }
      setNotes(prev => prev.filter(n => n.id !== id));
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
      }
      showToast('Deleted item permanently');
      setMenuOpenId(null);
    }
  };

  const emptyTrash = async () => {
    if (window.confirm('Empty entire Trash? All trashed notes will be permanently removed.')) {
      const trashedNotes = notes.filter(n => n.inTrash);
      for (const n of trashedNotes) {
        if (n.fileBlobId) {
          await deleteFileBlobFromIDB(n.fileBlobId);
        }
      }
      setNotes(prev => prev.filter(n => !n.inTrash));
      showToast('Emptied Trash');
    }
  };

  const saveEditedNote = () => {
    if (!selectedNote) return;
    setNotes(prev => prev.map(n => {
      if (n.id === selectedNote.id) {
        return {
          ...n,
          title: editTitle.trim() || n.title,
          content: editContent,
          category: editCategory,
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    }));
    setIsEditing(false);
    showToast('Saved changes');
  };

  // Formatting toolbar helper for text note editing
  const applyTextFormatting = (format: string) => {
    if (!isEditing) return;
    if (format === 'bold') setEditContent(prev => prev + ' **bold text** ');
    if (format === 'italic') setEditContent(prev => prev + ' *italic text* ');
    if (format === 'underline') setEditContent(prev => prev + ' <u>underlined text</u> ');
    if (format === 'ul') setEditContent(prev => prev + '\n- Item 1\n- Item 2');
    if (format === 'ol') setEditContent(prev => prev + '\n1. First step\n2. Second step');
    if (format === 'link') setEditContent(prev => prev + ' [Link Title](https://example.com) ');
  };

  // Modal Submission
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTitle.trim()) {
      alert('Please enter a title');
      return;
    }

    const noteId = `note_${Date.now()}`;
    const timestamp = new Date().toISOString();

    if (modalType === 'text') {
      const newNote: NoteItem = {
        id: noteId,
        title: newTitle.trim(),
        type: 'text',
        content: newContent,
        category: newCategory || 'General',
        isFavorite: false,
        inTrash: false,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      setNotes(prev => [newNote, ...prev]);
      setSelectedNoteId(noteId);
      showToast('Created text note');
    } else if (modalType === 'pdf' || modalType === 'video') {
      if (!uploadedFile) {
        alert('Please select a file to upload.');
        return;
      }

      const fileBlobId = `blob_${Date.now()}_${uploadedFile.name}`;
      await saveFileBlobToIDB(fileBlobId, uploadedFile);

      const newNote: NoteItem = {
        id: noteId,
        title: newTitle.trim(),
        type: modalType,
        fileBlobId: fileBlobId,
        fileName: uploadedFile.name,
        fileSize: uploadedFile.size,
        fileType: uploadedFile.type,
        content: newContent || `Uploaded ${uploadedFile.name}`,
        category: newCategory || (modalType === 'pdf' ? 'Documents' : 'Media'),
        isFavorite: false,
        inTrash: false,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      setNotes(prev => [newNote, ...prev]);
      setSelectedNoteId(noteId);
      showToast(`Uploaded ${modalType.toUpperCase()} file`);
    } else if (modalType === 'youtube') {
      const ytId = extractYouTubeId(newYoutubeUrl);
      if (!ytId) {
        alert('Please enter a valid YouTube video URL (e.g. https://www.youtube.com/watch?v=...)');
        return;
      }

      const newNote: NoteItem = {
        id: noteId,
        title: newTitle.trim(),
        type: 'youtube',
        youtubeUrl: newYoutubeUrl,
        youtubeEmbedId: ytId,
        content: newContent || 'YouTube Video Study Reference',
        category: newCategory || 'Video Lessons',
        isFavorite: false,
        inTrash: false,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      setNotes(prev => [newNote, ...prev]);
      setSelectedNoteId(noteId);
      showToast('Added YouTube link');
    } else if (modalType === 'formula') {
      const newNote: NoteItem = {
        id: noteId,
        title: newTitle.trim(),
        type: 'formula',
        formulaSubject: newFormulaSubject,
        content: newContent,
        category: newCategory || newFormulaSubject,
        isFavorite: false,
        inTrash: false,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      setNotes(prev => [newNote, ...prev]);
      setSelectedNoteId(noteId);
      showToast('Added new formula reference');
    }

    // Reset Modal Form
    setModalType(null);
    setNewTitle('');
    setNewContent('');
    setNewCategory('Physics');
    setNewYoutubeUrl('');
    setUploadedFile(null);
  };

  // Import JSON Backup handler
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const importedArray = parsed?.notes || (Array.isArray(parsed) ? parsed : null);

        if (!importedArray || !Array.isArray(importedArray)) {
          alert('Invalid backup file format. Expected a JSON object with a "notes" array.');
          return;
        }

        // Merge imported notes ensuring unique IDs
        setNotes(prev => {
          const existingIds = new Set(prev.map(n => n.id));
          const newItems = importedArray.filter((n: any) => n.id && n.title && !existingIds.has(n.id));
          return [...newItems, ...prev];
        });

        showToast(`Successfully imported ${importedArray.length} notes`);
        setModalType(null);
      } catch (err) {
        alert('Failed to parse JSON backup file. Please check file validity.');
      }
    };
    reader.readAsText(file);
  };

  // Helper function to render note type icon
  const renderTypeIcon = (type: NoteType) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'pdf':
        return <FileDown className="w-4 h-4 text-rose-400" />;
      case 'video':
        return <Video className="w-4 h-4 text-violet-400" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'formula':
        return <Sigma className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-2xl bg-[#8B5CF6] text-white font-extrabold text-xs shadow-2xl shadow-[#8B5CF6]/50 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Main Workspace Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-[#8B5CF6]" />
            <span>Study Notes & Knowledge Base</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9CA3AF] mt-1 font-medium">
            Manage your text notes, uploaded PDFs, study videos, YouTube links & STEM formulas locally.
          </p>
        </div>

        {/* Quick Action Buttons Header */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setModalType('video');
              setNewTitle('');
              setNewContent('');
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-[#141726] border border-[#2A2A40] hover:border-[#8B5CF6]/50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <Video className="w-4 h-4 text-violet-400" />
            <span className="hidden sm:inline">Upload Video</span>
          </button>

          <button
            onClick={() => {
              setModalType('pdf');
              setNewTitle('');
              setNewContent('');
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-[#141726] border border-[#2A2A40] hover:border-[#8B5CF6]/50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <FileDown className="w-4 h-4 text-rose-400" />
            <span className="hidden sm:inline">Upload PDF</span>
          </button>

          <button
            onClick={() => {
              setModalType('youtube');
              setNewTitle('');
              setNewYoutubeUrl('');
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-[#141726] border border-[#2A2A40] hover:border-[#8B5CF6]/50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <Youtube className="w-4 h-4 text-red-500" />
            <span className="hidden sm:inline">YouTube Link</span>
          </button>

          <button
            onClick={() => {
              setModalType('formula');
              setNewTitle('');
              setNewContent('');
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-[#141726] border border-[#2A2A40] hover:border-[#8B5CF6]/50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <Sigma className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Formulas</span>
          </button>

          <button
            onClick={() => {
              setModalType('text');
              setNewTitle('');
              setNewContent('');
            }}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-[#8B5CF6]/30 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Categories Sidebar & Data Management */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* CATEGORIES CARD */}
          <div className="p-4 sm:p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-4 shadow-lg">
            <h2 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider px-1">
              CATEGORIES
            </h2>

            <nav className="space-y-1">
              {[
                { id: 'all', label: 'All Notes', icon: <FileText className="w-4 h-4 text-purple-400" />, count: counts.all },
                { id: 'text', label: 'Text Notes', icon: <FileCode className="w-4 h-4 text-emerald-400" />, count: counts.text },
                { id: 'pdf', label: 'PDFs', icon: <FileDown className="w-4 h-4 text-rose-400" />, count: counts.pdf },
                { id: 'video', label: 'Videos', icon: <Film className="w-4 h-4 text-violet-400" />, count: counts.video },
                { id: 'youtube', label: 'YouTube Links', icon: <Youtube className="w-4 h-4 text-red-500" />, count: counts.youtube },
                { id: 'formula', label: 'Formulas', icon: <Sigma className="w-4 h-4 text-cyan-400" />, count: counts.formula },
                { id: 'favorites', label: 'Favorites', icon: <Star className="w-4 h-4 text-amber-400" />, count: counts.favorites },
                { id: 'trash', label: 'Trash', icon: <Trash2 className="w-4 h-4 text-gray-400" />, count: counts.trash },
              ].map(cat => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as CategoryFilter)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-md shadow-[#8B5CF6]/30'
                        : 'text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {cat.icon}
                      <span>{cat.label}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#09090F] text-[#9CA3AF]'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* DATA MANAGEMENT CARD */}
          <div className="p-4 sm:p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-4 shadow-lg">
            <h2 className="text-xs font-extrabold text-[#9CA3AF] uppercase tracking-wider px-1">
              DATA MANAGEMENT
            </h2>

            <div className="space-y-2">
              <button
                onClick={() => exportNotesBackupJSON(notes)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] hover:border-[#8B5CF6]/50 text-left transition-all group"
              >
                <div className="p-2 rounded-xl bg-[#8B5CF6]/15 text-[#8B5CF6] group-hover:bg-[#8B5CF6] group-hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white">Download All Data</div>
                  <div className="text-[10px] text-[#9CA3AF]">Download a backup (JSON)</div>
                </div>
              </button>

              <button
                onClick={() => jsonImportRef.current?.click()}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] hover:border-[#8B5CF6]/50 text-left transition-all group"
              >
                <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-white">Import JSON Backup</div>
                  <div className="text-[10px] text-[#9CA3AF]">Restore notes from JSON file</div>
                </div>
              </button>

              <input
                ref={jsonImportRef}
                type="file"
                accept=".json"
                onChange={handleImportJSON}
                className="hidden"
              />

              {activeCategory === 'trash' && counts.trash > 0 && (
                <button
                  onClick={emptyTrash}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 text-left transition-all"
                >
                  <Trash className="w-4 h-4" />
                  <div>
                    <div className="text-xs font-extrabold">Empty Trash</div>
                    <div className="text-[10px] text-rose-300">Permanently remove {counts.trash} items</div>
                  </div>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* MIDDLE COLUMN: Notes List / Search / Filters */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Search Bar & View Controls */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-[#141726] border border-[#2A2A40] text-white text-xs placeholder-[#9CA3AF] focus:outline-none focus:border-[#8B5CF6] transition-all shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="px-3 py-2.5 rounded-2xl bg-[#141726] border border-[#2A2A40] text-white text-xs font-bold focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>

            {/* Grid / List toggle */}
            <div className="flex items-center p-1 rounded-2xl bg-[#141726] border border-[#2A2A40]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'grid' ? 'bg-[#8B5CF6] text-white' : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-xl transition-all ${
                  viewMode === 'list' ? 'bg-[#8B5CF6] text-white' : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Notes Cards Container */}
          <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="p-8 rounded-[22px] bg-[#141726] border border-[#2A2A40] text-center space-y-3">
                <BookOpen className="w-10 h-10 text-[#8B5CF6] mx-auto opacity-50" />
                <div className="text-sm font-bold text-white">No notes found</div>
                <p className="text-xs text-[#9CA3AF]">
                  {searchQuery ? 'Try clearing your search terms' : 'Create a new note or upload a PDF/video to get started'}
                </p>
              </div>
            ) : (
              filteredNotes.map(note => {
                const isSelected = selectedNoteId === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`p-4 rounded-[22px] border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-[#141726] border-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/15'
                        : 'bg-[#141726]/60 border-[#2A2A40] hover:border-[#8B5CF6]/50 hover:bg-[#141726]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-2xl shrink-0 ${
                          note.type === 'formula' ? 'bg-cyan-500/15' :
                          note.type === 'pdf' ? 'bg-rose-500/15' :
                          note.type === 'video' ? 'bg-violet-500/15' :
                          note.type === 'youtube' ? 'bg-red-500/15' : 'bg-purple-500/15'
                        }`}>
                          {renderTypeIcon(note.type)}
                        </div>

                        <div className="truncate min-w-0">
                          <h3 className="text-xs font-extrabold text-white truncate group-hover:text-[#8B5CF6] transition-colors">
                            {note.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[10px] text-[#9CA3AF] mt-0.5">
                            <span>{new Date(note.updatedAt || note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            <span>•</span>
                            <span className="px-2 py-0.5 rounded-md bg-[#09090F] border border-[#2A2A40] font-bold uppercase text-[9px] text-[#8B5CF6]">
                              {note.category || note.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Favorite & Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => toggleFavorite(note.id, e)}
                          className={`p-1.5 rounded-xl transition-all ${
                            note.isFavorite ? 'text-amber-400' : 'text-[#9CA3AF] hover:text-white'
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(menuOpenId === note.id ? null : note.id);
                            }}
                            className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {menuOpenId === note.id && (
                            <div className="absolute right-0 top-8 z-30 w-36 p-1.5 rounded-2xl bg-[#09090F] border border-[#2A2A40] shadow-2xl space-y-1 animate-scaleUp">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadNoteItem(note);
                                  setMenuOpenId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-white hover:bg-[#2A2A40] transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </button>

                              {!note.inTrash ? (
                                <button
                                  onClick={(e) => moveToTrash(note.id, e)}
                                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Move to Trash</span>
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={(e) => restoreFromTrash(note.id, e)}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Restore</span>
                                  </button>
                                  <button
                                    onClick={(e) => deletePermanently(note.id, e)}
                                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete Forever</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="text-[11px] text-[#9CA3AF] text-center font-medium">
            Showing {filteredNotes.length} of {notes.length} total items
          </div>
        </div>

        {/* RIGHT COLUMN: Note Viewer & Rich Editor */}
        <div className="lg:col-span-5">
          {selectedNote ? (
            <div className="p-5 sm:p-6 rounded-[22px] bg-[#141726] border border-[#2A2A40] space-y-5 shadow-xl min-h-[580px] flex flex-col justify-between">
              
              {/* Note Header & Actions */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-[#2A2A40] pb-4">
                  <div className="space-y-1 flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#09090F] border border-[#8B5CF6] text-white font-extrabold text-lg focus:outline-none"
                      />
                    ) : (
                      <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                        {selectedNote.title}
                      </h2>
                    )}

                    <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#09090F] border border-[#2A2A40] font-bold text-[10px] text-[#8B5CF6] uppercase">
                        {selectedNote.type}
                      </span>
                      <span>Category: {selectedNote.category || 'General'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleFavorite(selectedNote.id, e)}
                      className={`p-2 rounded-xl border border-[#2A2A40] transition-all ${
                        selectedNote.isFavorite ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-[#09090F] text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Formatted Text Note Editor Toolbar */}
                {selectedNote.type === 'text' && isEditing && (
                  <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-[#09090F] border border-[#2A2A40]">
                    <button onClick={() => applyTextFormatting('bold')} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]">
                      <Bold className="w-4 h-4" />
                    </button>
                    <button onClick={() => applyTextFormatting('italic')} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]">
                      <Italic className="w-4 h-4" />
                    </button>
                    <button onClick={() => applyTextFormatting('underline')} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]">
                      <Underline className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-[#2A2A40] mx-1" />
                    <button onClick={() => applyTextFormatting('ul')} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]">
                      <ListIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => applyTextFormatting('ol')} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]">
                      <ListOrdered className="w-4 h-4" />
                    </button>
                    <button onClick={() => applyTextFormatting('link')} className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]">
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* MAIN CONTENT VIEWER ACCORDING TO TYPE */}
                <div className="py-2">
                  {selectedNote.type === 'text' && (
                    isEditing ? (
                      <textarea
                        rows={12}
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        className="w-full p-4 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-white text-xs font-mono focus:outline-none focus:border-[#8B5CF6] leading-relaxed resize-none"
                      />
                    ) : (
                      <div className="p-4 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-slate-200 text-xs font-sans whitespace-pre-wrap leading-relaxed min-h-[220px]">
                        {selectedNote.content || 'No content provided.'}
                      </div>
                    )
                  )}

                  {/* FORMULA DISPLAY CARD */}
                  {selectedNote.type === 'formula' && (
                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-[#09090F] border border-cyan-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-cyan-400 uppercase tracking-wider">
                            {selectedNote.formulaSubject || 'STEM'} Formula Sheet
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(selectedNote.content || '');
                              showToast('Formula copied to clipboard!');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy Formula</span>
                          </button>
                        </div>

                        {isEditing ? (
                          <textarea
                            rows={10}
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            className="w-full p-3 rounded-xl bg-[#141726] border border-cyan-500/50 text-white font-mono text-xs focus:outline-none"
                          />
                        ) : (
                          <div className="p-4 rounded-xl bg-[#141726] border border-[#2A2A40] text-white font-mono text-xs leading-relaxed whitespace-pre-wrap">
                            {selectedNote.content}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* YOUTUBE EMBED PLAYER */}
                  {selectedNote.type === 'youtube' && (
                    <div className="space-y-3">
                      {selectedNote.youtubeEmbedId ? (
                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#2A2A40] shadow-lg">
                          <iframe
                            src={`https://www.youtube.com/embed/${selectedNote.youtubeEmbedId}`}
                            title={selectedNote.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <a
                          href={selectedNote.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-4 rounded-2xl bg-[#09090F] border border-red-500/30 flex items-center justify-between text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <span>Open YouTube Link in New Tab</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <p className="text-xs text-[#9CA3AF] px-1">{selectedNote.content}</p>
                    </div>
                  )}

                  {/* PDF VIEWER */}
                  {selectedNote.type === 'pdf' && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-[#09090F] border border-rose-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileDown className="w-5 h-5 text-rose-400" />
                          <div>
                            <div className="text-xs font-extrabold text-white">{selectedNote.fileName || selectedNote.title}</div>
                            <div className="text-[10px] text-[#9CA3AF]">{formatFileSize(selectedNote.fileSize)}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => downloadNoteItem(selectedNote)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      </div>

                      {activeBlobUrl ? (
                        <div className="w-full h-80 rounded-2xl overflow-hidden border border-[#2A2A40] bg-[#09090F]">
                          <iframe src={activeBlobUrl} title={selectedNote.title} className="w-full h-full border-0" />
                        </div>
                      ) : isLoadingBlob ? (
                        <div className="p-8 text-center text-xs text-[#9CA3AF] animate-pulse">Loading PDF preview...</div>
                      ) : (
                        <p className="text-xs text-[#9CA3AF] italic px-1">
                          {selectedNote.content || 'PDF file stored locally.'}
                        </p>
                      )}
                    </div>
                  )}

                  {/* LOCAL VIDEO PLAYER */}
                  {selectedNote.type === 'video' && (
                    <div className="space-y-3">
                      {activeBlobUrl ? (
                        <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#2A2A40] bg-black">
                          <video src={activeBlobUrl} controls className="w-full h-full object-contain" />
                        </div>
                      ) : isLoadingBlob ? (
                        <div className="p-8 text-center text-xs text-[#9CA3AF] animate-pulse">Loading video stream...</div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-xs text-[#9CA3AF]">
                          {selectedNote.content || 'Video stored in local IndexedDB storage.'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-4 border-t border-[#2A2A40] flex flex-wrap items-center justify-between gap-3">
                <div className="text-[11px] text-[#9CA3AF] font-medium">
                  Last updated: {new Date(selectedNote.updatedAt || selectedNote.createdAt).toLocaleString()}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadNoteItem(selectedNote)}
                    className="px-4 py-2 rounded-xl bg-[#09090F] border border-[#2A2A40] hover:border-[#8B5CF6] text-white font-extrabold text-xs flex items-center gap-2 transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Download</span>
                  </button>

                  {isEditing ? (
                    <button
                      onClick={saveEditedNote}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 transition-all hover:scale-105"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/50 hover:bg-[#8B5CF6] text-white font-black text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}

                  {!selectedNote.inTrash ? (
                    <button
                      onClick={(e) => moveToTrash(selectedNote.id, e)}
                      className="px-4 py-2 rounded-xl bg-rose-500/15 border border-rose-500/30 hover:bg-rose-500 text-rose-400 hover:text-white font-extrabold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  ) : (
                    <button
                      onClick={(e) => deletePermanently(selectedNote.id, e)}
                      className="px-4 py-2 rounded-xl bg-rose-600 text-white font-extrabold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Forever</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-[22px] bg-[#141726] border border-[#2A2A40] text-center space-y-4 min-h-[500px] flex flex-col items-center justify-center">
              <BookOpen className="w-12 h-12 text-[#8B5CF6] opacity-40" />
              <div className="text-base font-extrabold text-white">Select a Note to View</div>
              <p className="text-xs text-[#9CA3AF] max-w-xs">
                Click any note from the list or create a new note using the top buttons.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* MODALS FOR CREATING / UPLOADING */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="p-6 rounded-[26px] bg-[#141726] border border-[#2A2A40] w-full max-w-lg space-y-5 shadow-2xl relative animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-[#2A2A40] pb-3">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                {modalType === 'text' && <FileText className="w-5 h-5 text-purple-400" />}
                {modalType === 'pdf' && <FileDown className="w-5 h-5 text-rose-400" />}
                {modalType === 'video' && <Video className="w-5 h-5 text-violet-400" />}
                {modalType === 'youtube' && <Youtube className="w-5 h-5 text-red-500" />}
                {modalType === 'formula' && <Sigma className="w-5 h-5 text-cyan-400" />}
                <span>
                  {modalType === 'text' && 'Create Text Note'}
                  {modalType === 'pdf' && 'Upload PDF File'}
                  {modalType === 'video' && 'Upload Video File'}
                  {modalType === 'youtube' && 'Add YouTube Video Link'}
                  {modalType === 'formula' && 'Add STEM Formula'}
                </span>
              </h3>

              <button onClick={() => setModalType(null)} className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              
              {/* Title */}
              <div>
                <label className="text-[11px] font-extrabold text-[#9CA3AF] uppercase block mb-1">
                  Title / Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Kinematics Summary"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-white text-xs focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>

              {/* Subject / Category */}
              <div>
                <label className="text-[11px] font-extrabold text-[#9CA3AF] uppercase block mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-white text-xs font-bold focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="General">General</option>
                </select>
              </div>

              {/* YouTube Link Field */}
              {modalType === 'youtube' && (
                <div>
                  <label className="text-[11px] font-extrabold text-[#9CA3AF] uppercase block mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={newYoutubeUrl}
                    onChange={e => setNewYoutubeUrl(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-white text-xs focus:outline-none focus:border-[#8B5CF6]"
                  />
                </div>
              )}

              {/* File Upload Dropzone */}
              {(modalType === 'pdf' || modalType === 'video') && (
                <div>
                  <label className="text-[11px] font-extrabold text-[#9CA3AF] uppercase block mb-1">
                    Select File ({modalType === 'pdf' ? '.pdf' : '.mp4, .webm'})
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={modalType === 'pdf' ? '.pdf,application/pdf' : 'video/*'}
                    onChange={e => {
                      if (e.target.files?.[0]) {
                        setUploadedFile(e.target.files[0]);
                        if (!newTitle) setNewTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                      }
                    }}
                    className="w-full p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-white text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#8B5CF6] file:text-white hover:file:bg-[#A855F7]"
                  />
                </div>
              )}

              {/* STEM Formula Subject */}
              {modalType === 'formula' && (
                <div>
                  <label className="text-[11px] font-extrabold text-[#9CA3AF] uppercase block mb-1">
                    Formula Domain
                  </label>
                  <select
                    value={newFormulaSubject}
                    onChange={e => setNewFormulaSubject(e.target.value as any)}
                    className="w-full p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-white text-xs font-bold focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="General">General</option>
                  </select>
                </div>
              )}

              {/* Content / Notes textarea */}
              <div>
                <label className="text-[11px] font-extrabold text-[#9CA3AF] uppercase block mb-1">
                  Content / Equations / Description
                </label>
                <textarea
                  rows={5}
                  placeholder={modalType === 'formula' ? 'Enter equations (e.g. F = ma, v = u + at)' : 'Enter notes or description...'}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#09090F] border border-[#2A2A40] text-white text-xs focus:outline-none focus:border-[#8B5CF6] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-black text-xs shadow-lg shadow-[#8B5CF6]/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                Save to Notes
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
