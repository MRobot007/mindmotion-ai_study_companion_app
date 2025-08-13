import React from 'react';
import { Scan, Target, Lightbulb, BookOpen, TrendingUp, Clock, Award, Brain, History, ArrowRight, Coffee, Zap } from 'lucide-react';

type Page = 'scan' | 'quiz' | 'flashcards' | 'vault' | 'history';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  userName: string;
  userData: {
    explanations: any[];
    quizzes: any[];
    flashcards: any[];
    notes: any[];
  };
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userName, userData }) => {
  const quickActions = [
    {
      id: 'scan' as Page,
      icon: Scan,
      title: 'Scan Question',
      description: 'Upload or capture questions for instant AI explanations',
      color: 'from-amber-100 to-yellow-100',
      textColor: 'text-amber-700',
      hoverColor: 'hover:from-amber-200 hover:to-yellow-200'
    },
    {
      id: 'quiz' as Page,
      icon: Target,
      title: 'Generate Quiz',
      description: 'Create personalized quizzes on any topic',
      color: 'from-orange-100 to-amber-100',
      textColor: 'text-orange-700',
      hoverColor: 'hover:from-orange-200 hover:to-amber-200'
    },
    {
      id: 'flashcards' as Page,
      icon: Lightbulb,
      title: 'Create Flashcards',
      description: 'Transform notes into interactive flashcards',
      color: 'from-yellow-100 to-amber-100',
      textColor: 'text-yellow-700',
      hoverColor: 'hover:from-yellow-200 hover:to-amber-200'
    },
    {
      id: 'vault' as Page,
      icon: BookOpen,
      title: 'Notes Vault',
      description: 'Access your saved study materials',
      color: 'from-amber-100 to-orange-100',
      textColor: 'text-amber-800',
      hoverColor: 'hover:from-amber-200 hover:to-orange-200'
    }
  ];

  const totalItems = userData.explanations.length + userData.quizzes.length + 
                    userData.flashcards.length + userData.notes.length;

  const stats = [
    { 
      label: 'Questions Solved', 
      value: userData.explanations.length.toString(), 
      icon: Brain, 
      color: 'text-amber-700',
      bgColor: 'bg-amber-100'
    },
    { 
      label: 'Quizzes Completed', 
      value: userData.quizzes.length.toString(), 
      icon: Target, 
      color: 'text-orange-700',
      bgColor: 'bg-orange-100'
    },
    { 
      label: 'Study Items', 
      value: totalItems.toString(), 
      icon: TrendingUp, 
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100'
    },
    { 
      label: 'Flashcard Sets', 
      value: userData.flashcards.length.toString(), 
      icon: Lightbulb, 
      color: 'text-amber-800',
      bgColor: 'bg-amber-100'
    }
  ];

  // Get recent activity from all user data
  const getAllItems = () => {
    const allItems = [
      ...userData.explanations.map(item => ({ ...item, type: 'explanation', icon: Brain })),
      ...userData.quizzes.map(item => ({ ...item, type: 'quiz', icon: Target })),
      ...userData.flashcards.map(item => ({ ...item, type: 'flashcards', icon: Lightbulb })),
      ...userData.notes.map(item => ({ ...item, type: 'notes', icon: BookOpen }))
    ];
    
    return allItems
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
  };

  const recentActivity = getAllItems();

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'explanation': return 'bg-amber-100 text-amber-700';
      case 'quiz': return 'bg-orange-100 text-orange-700';
      case 'flashcards': return 'bg-yellow-100 text-yellow-700';
      case 'notes': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getActivityTitle = (item: any) => {
    if (item.title) return item.title;
    if (item.question) return item.question;
    if (item.topic) return `Quiz: ${item.topic}`;
    return 'Study Item';
  };

  const getActivityScore = (item: any) => {
    if (item.type === 'quiz' && item.percentage) return `${item.percentage}%`;
    if (item.type === 'flashcards' && item.cardCount) return `${item.cardCount} cards`;
    if (item.type === 'explanation') return 'Explained';
    return 'Completed';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white animate-fade-in-up">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center space-x-2">
              <span>Welcome back, {userName}!</span>
              <Coffee className="h-8 w-8 animate-wiggle" />
            </h1>
            <p className="text-amber-100 text-lg">
              Ready to continue your learning journey? Let's make today productive!
            </p>
            {totalItems > 0 && (
              <p className="text-amber-200 text-sm mt-2">
                You have {totalItems} study items in your collection
              </p>
            )}
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center animate-float">
              <Brain className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center space-x-2">
          <Zap className="h-6 w-6 text-amber-600" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onNavigate(action.id)}
              className={`card-interactive p-6 text-left group bg-gradient-to-br ${action.color} ${action.hoverColor} border-2 border-amber-200`}
            >
              <div className={`w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg`}>
                <action.icon className={`w-7 h-7 ${action.textColor}`} />
              </div>
              <h3 className={`font-semibold text-amber-900 mb-2 group-hover:${action.textColor} transition-colors`}>
                {action.title}
              </h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-amber-600" />
          <span>Your Progress</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`card p-6 hover:shadow-lg transition-all duration-300 interactive-element hover-lift ${stat.bgColor} border-2 border-amber-200`}>
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-3xl font-bold text-amber-900 mb-1">{stat.value}</p>
              <p className="text-amber-700 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-amber-900 flex items-center space-x-2">
            <History className="h-6 w-6 text-amber-600" />
            <span>Recent Activity</span>
          </h2>
          {totalItems > 0 && (
            <button
              onClick={() => onNavigate('history')}
              className="flex items-center space-x-2 text-amber-700 hover:text-amber-800 font-medium interactive-element"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="card overflow-hidden border-2 border-amber-200">
          {recentActivity.length === 0 ? (
            <div className="p-12 text-center">
              <History className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-amber-900 mb-2">No activity yet</h3>
              <p className="text-amber-700 mb-6">
                Start studying to see your recent activity here!
              </p>
              <button
                onClick={() => onNavigate('scan')}
                className="btn-primary hover-bounce"
              >
                Get Started
              </button>
            </div>
          ) : (
            recentActivity.map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-center justify-between p-6 hover:bg-amber-50 transition-colors border-b border-amber-100 last:border-b-0 interactive-element"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 ${getActivityColor(activity.type)} rounded-full flex items-center justify-center text-sm font-medium`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-900 line-clamp-1">
                      {getActivityTitle(activity)}
                    </p>
                    <p className="text-amber-600 text-sm">
                      {formatTimeAgo(activity.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-900">
                    {getActivityScore(activity)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Study Tip */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-400 rounded-2xl p-8 text-amber-900 animate-fade-in-up">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center space-x-2">
              <span>💡 Today's Study Tip</span>
            </h3>
            <p className="text-amber-800 leading-relaxed">
              Try the Feynman Technique: Explain concepts in simple terms as if teaching someone else. 
              Use StudyBolt's quiz feature to test your understanding and identify knowledge gaps!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;