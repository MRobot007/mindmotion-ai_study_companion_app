import React, { useState } from 'react';
import { History as HistoryIcon, Search, Filter, Calendar, Star, Trash2, Eye, Download, Clock, Brain, Target, Lightbulb, BookOpen } from 'lucide-react';

interface HistoryProps {
  userData: {
    explanations: any[];
    quizzes: any[];
    flashcards: any[];
    notes: any[];
  };
  onNavigate: (page: string) => void;
}

const History: React.FC<HistoryProps> = ({ userData, onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Combine all user data into a single array
  const allItems = [
    ...userData.explanations.map(item => ({ ...item, category: 'explanation' })),
    ...userData.quizzes.map(item => ({ ...item, category: 'quiz' })),
    ...userData.flashcards.map(item => ({ ...item, category: 'flashcards' })),
    ...userData.notes.map(item => ({ ...item, category: 'notes' }))
  ];

  // Filter and sort items
  const filteredItems = allItems
    .filter(item => {
      const matchesSearch = searchTerm === '' || 
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.question && item.question.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.topic && item.topic.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterType === 'all' || item.category === filterType;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  const getItemIcon = (category: string) => {
    switch (category) {
      case 'explanation': return <Brain className="w-5 h-5 text-blue-500" />;
      case 'quiz': return <Target className="w-5 h-5 text-violet-500" />;
      case 'flashcards': return <Lightbulb className="w-5 h-5 text-emerald-500" />;
      case 'notes': return <BookOpen className="w-5 h-5 text-orange-500" />;
      default: return <HistoryIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getItemTitle = (item: any) => {
    if (item.title) return item.title;
    if (item.question) return item.question;
    if (item.topic) return `Quiz: ${item.topic}`;
    return 'Untitled Item';
  };

  const getItemDescription = (item: any) => {
    switch (item.category) {
      case 'explanation':
        return item.explanation ? item.explanation.substring(0, 100) + '...' : 'AI explanation';
      case 'quiz':
        return `${item.questions || 0} questions • Score: ${item.percentage || 0}%`;
      case 'flashcards':
        return `${item.cardCount || 0} flashcards created`;
      case 'notes':
        return item.content ? item.content.substring(0, 100) + '...' : 'Personal notes';
      default:
        return 'Study item';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'explanation': return 'bg-blue-100 text-blue-700';
      case 'quiz': return 'bg-violet-100 text-violet-700';
      case 'flashcards': return 'bg-emerald-100 text-emerald-700';
      case 'notes': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    total: allItems.length,
    explanations: userData.explanations.length,
    quizzes: userData.quizzes.length,
    flashcards: userData.flashcards.length,
    notes: userData.notes.length
  };

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Study History</h1>
        <p className="text-gray-600 text-lg">
          Track your learning progress and revisit past study sessions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Items</div>
        </div>
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.explanations}</div>
          <div className="text-sm text-blue-600">Explanations</div>
        </div>
        <div className="bg-violet-50 p-6 rounded-2xl border border-violet-200 text-center">
          <div className="text-2xl font-bold text-violet-600">{stats.quizzes}</div>
          <div className="text-sm text-violet-600">Quizzes</div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200 text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats.flashcards}</div>
          <div className="text-sm text-emerald-600">Flashcards</div>
        </div>
        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.notes}</div>
          <div className="text-sm text-orange-600">Notes</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your study history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Types</option>
              <option value="explanation">Explanations</option>
              <option value="quiz">Quizzes</option>
              <option value="flashcards">Flashcards</option>
              <option value="notes">Notes</option>
            </select>
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Items */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <HistoryIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start studying to build your history!'
              }
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => onNavigate('scan')}
                className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-violet-600 transition-all duration-300"
              >
                Scan Question
              </button>
              <button
                onClick={() => onNavigate('quiz')}
                className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
              >
                Generate Quiz
              </button>
            </div>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <div
              key={item.id || index}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    {getItemIcon(item.category)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {getItemTitle(item)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {getItemDescription(item)}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <span>Tags:</span>
                          <span className="text-blue-600">{item.tags.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors">
                    <Star className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More Button */}
      {filteredItems.length > 0 && (
        <div className="text-center">
          <button className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
            Load More Items
          </button>
        </div>
      )}
    </div>
  );
};

export default History;