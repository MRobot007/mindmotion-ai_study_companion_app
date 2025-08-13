import React, { useState } from 'react';
import { BookOpen, Search, Filter, Plus, Tag, Clock, Star, Trash2, Edit3, Download, Eye } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  type: 'explanation' | 'quiz' | 'flashcard' | 'note';
}

interface NotesVaultProps {
  userData: {
    explanations: any[];
    quizzes: any[];
    flashcards: any[];
    notes: any[];
  };
  onSaveNote: (data: any) => void;
}

const NotesVault: React.FC<NotesVaultProps> = ({ userData, onSaveNote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Convert userData to notes format
  const convertToNotes = (): Note[] => {
    const notes: Note[] = [];
    
    // Add explanations
    userData.explanations.forEach(item => {
      notes.push({
        id: item.id || `exp-${Date.now()}`,
        title: item.question || 'AI Explanation',
        content: item.explanation || '',
        category: 'AI Explanations',
        tags: ['explanation', 'ai'],
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
        isFavorite: false,
        type: 'explanation'
      });
    });

    // Add quiz results
    userData.quizzes.forEach(item => {
      notes.push({
        id: item.id || `quiz-${Date.now()}`,
        title: `Quiz: ${item.topic || 'Unknown Topic'}`,
        content: `Quiz completed with ${item.percentage || 0}% score (${item.score || 0}/${item.questions || 0} correct). Difficulty: ${item.difficulty || 'medium'}.`,
        category: 'Quiz Results',
        tags: ['quiz', 'results'],
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
        isFavorite: false,
        type: 'quiz'
      });
    });

    // Add flashcard collections
    userData.flashcards.forEach(item => {
      notes.push({
        id: item.id || `flash-${Date.now()}`,
        title: item.title || 'Flashcard Collection',
        content: `Flashcard collection with ${item.cardCount || 0} cards. Category: ${item.category || 'General'}.`,
        category: 'Flashcards',
        tags: ['flashcards', item.category?.toLowerCase() || 'general'],
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
        isFavorite: false,
        type: 'flashcard'
      });
    });

    // Add personal notes
    userData.notes.forEach(item => {
      notes.push({
        id: item.id || `note-${Date.now()}`,
        title: item.title || 'Personal Note',
        content: item.content || '',
        category: 'Personal Notes',
        tags: item.tags || ['note'],
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
        isFavorite: false,
        type: 'note'
      });
    });

    return notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  };

  const [notes, setNotes] = useState<Note[]>(convertToNotes());

  // Update notes when userData changes
  React.useEffect(() => {
    setNotes(convertToNotes());
  }, [userData]);

  const categories = ['all', ...Array.from(new Set(notes.map(note => note.category)))];
  
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'New Note',
      content: 'Start writing your note here...',
      category: 'Personal Notes',
      tags: ['note'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      type: 'note'
    };

    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'explanation': return '🧠';
      case 'quiz': return '🎯';
      case 'flashcard': return '💡';
      case 'note': return '📝';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'explanation': return 'bg-blue-100 text-blue-600';
      case 'quiz': return 'bg-violet-100 text-violet-600';
      case 'flashcard': return 'bg-emerald-100 text-emerald-600';
      case 'note': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Notes List */}
        <div className="lg:col-span-1 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notes Vault</h1>
            <p className="text-gray-600">Your personal study library</p>
          </div>

          {/* Search and Filter */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notes, tags, content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-500 to-violet-500 rounded-2xl p-6 text-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{notes.length}</div>
                <div className="text-blue-100 text-sm">Total Notes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{notes.filter(n => n.isFavorite).length}</div>
                <div className="text-blue-100 text-sm">Favorites</div>
              </div>
            </div>
          </div>

          {/* Create New Note Button */}
          <button
            onClick={createNewNote}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Note</span>
          </button>

          {/* Notes List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedNote?.id === note.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTypeIcon(note.type)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(note.type)}`}>
                      {note.type}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(note.id);
                    }}
                    className={`p-1 ${note.isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}
                  >
                    <Star className={`w-4 h-4 ${note.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                  {note.title}
                </h3>
                
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                  {note.content}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <span className="text-blue-600 font-medium">{note.category}</span>
                </div>
              </div>
            ))}
            
            {filteredNotes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No notes found matching your criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Content - Note Detail */}
        <div className="lg:col-span-2">
          {selectedNote ? (
            <div className="bg-white rounded-2xl border border-gray-200 h-full">
              {/* Note Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(selectedNote.type)}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedNote.title}</h2>
                      <p className="text-gray-600">{selectedNote.category} • {new Date(selectedNote.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFavorite(selectedNote.id)}
                      className={`p-2 rounded-lg ${selectedNote.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                    >
                      <Star className={`w-5 h-5 ${selectedNote.isFavorite ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-lg text-gray-400 hover:text-blue-600">
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg text-gray-400 hover:text-emerald-600">
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteNote(selectedNote.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedNote.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Note Content */}
              <div className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedNote.content}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-gray-200 h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Eye className="w-12 h-12 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Select a note to view
                  </h3>
                  <p className="text-gray-600">
                    Choose a note from the sidebar to view its content and manage it.
                  </p>
                </div>
                <button
                  onClick={createNewNote}
                  className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-violet-600 transition-all duration-300 flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create New Note</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesVault;