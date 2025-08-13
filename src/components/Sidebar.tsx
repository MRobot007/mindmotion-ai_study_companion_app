import React from 'react';
import { Home, Scan, Target, Lightbulb, BookOpen, History, LogOut, Brain, MessageSquare, Camera } from 'lucide-react';
import Logo from './Logo';

type Page = 'dashboard' | 'scan' | 'quiz' | 'flashcards' | 'vault' | 'history' | 'ai-coach' | 'voice-assistant' | 'smart-camera';

interface SidebarProps {
  isOpen: boolean;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  userName: string;
  userData: {
    explanations: any[];
    quizzes: any[];
    flashcards: any[];
    notes: any[];
  };
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  currentPage, 
  onNavigate, 
  onLogout, 
  userName,
  userData 
}) => {
  const menuItems = [
    { id: 'dashboard' as Page, icon: Home, label: 'Dashboard' },
    { id: 'scan' as Page, icon: Scan, label: 'Scan Question' },
    { id: 'quiz' as Page, icon: Target, label: 'Generate Quiz' },
    { id: 'flashcards' as Page, icon: Lightbulb, label: 'Flashcards' },
    { id: 'vault' as Page, icon: BookOpen, label: 'Notes Vault' },
    { id: 'history' as Page, icon: History, label: 'Study History' },
    { id: 'ai-coach' as Page, icon: Brain, label: 'AI Study Coach' },
    { id: 'voice-assistant' as Page, icon: MessageSquare, label: 'Voice Assistant' },
    { id: 'smart-camera' as Page, icon: Camera, label: 'Smart Camera' },
  ];

  const totalItems = userData.explanations.length + userData.quizzes.length + 
                    userData.flashcards.length + userData.notes.length;

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-64 glass border-r border-amber-200 flex-col z-30">
        {/* Header */}
        <div className="p-6 border-b border-amber-200">
          <div className="flex items-center space-x-3 interactive-element">
            <Logo size="lg" animated={true} />
            <span className="text-2xl font-bold text-gradient">
              MindMotion
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-amber-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg animate-pulse-glow">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-amber-900">Welcome back,</p>
              <p className="text-amber-700 font-medium">{userName}</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-4 p-3 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg border border-amber-200 interactive-element hover-lift">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-800">{totalItems}</div>
              <div className="text-xs text-amber-700">Study Items</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 interactive-element ripple ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'text-amber-800 hover:bg-amber-100 hover:text-amber-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-amber-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 interactive-element ripple"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        id="sidebar"
        className={`lg:hidden fixed left-0 top-0 h-full w-64 glass border-r border-amber-200 flex-col z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-amber-200">
          <div className="flex items-center space-x-3">
            <Logo size="md" animated={true} />
            <span className="text-xl font-bold text-gradient">
              MindMotion
            </span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-amber-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-amber-700">Welcome back,</p>
              <p className="text-amber-800 font-medium">{userName}</p>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg text-center border border-amber-200">
            <div className="text-lg font-bold text-amber-800">{totalItems}</div>
            <div className="text-xs text-amber-700">Study Items</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 interactive-element ripple ${
                currentPage === item.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                  : 'text-amber-800 hover:bg-amber-100 hover:text-amber-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-amber-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 interactive-element ripple"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;