import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './components/Logo';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ScanQuestion from './components/ScanQuestion';
import GenerateQuiz from './components/GenerateQuiz';
import Flashcards from './components/Flashcards';
import NotesVault from './components/NotesVault';
import History from './components/History';
import AuthModal from './components/AuthModal';
import Sidebar from './components/Sidebar';
import GeometricBackground from './components/GeometricBackground';
import AIStudyCoach from './components/AIStudyCoach';
import AIVoiceAssistant from './components/AIVoiceAssistant';
import AISmartCamera from './components/AISmartCamera';
import { AuthService } from './services/AuthService';
import { StorageService } from './services/StorageService';

type Page = 'landing' | 'dashboard' | 'scan' | 'quiz' | 'flashcards' | 'vault' | 'history' | 'ai-coach' | 'voice-assistant' | 'smart-camera';

interface User {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
}

interface UserData {
  explanations: any[];
  quizzes: any[];
  flashcards: any[];
  notes: any[];
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData>({
    explanations: [],
    quizzes: [],
    flashcards: [],
    notes: []
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const token = localStorage.getItem('mindmotion_token');
        if (token) {
          const userData = await AuthService.validateToken(token);
          if (userData) {
            setUser(userData);
            const userHistory = await StorageService.getUserData(userData.id);
            setUserData(userHistory);
            setCurrentPage('dashboard');
          }
        }
      } catch (error) {
        console.error('Session validation failed:', error);
        localStorage.removeItem('mindmotion_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await AuthService.login(email, password);
      const { user: userData, token } = response;
      
      // Store token for persistence
      localStorage.setItem('mindmotion_token', token);
      
      setUser(userData);
      setShowAuthModal(false);
      setCurrentPage('dashboard');
      
      // Load user's historical data
      const userHistory = await StorageService.getUserData(userData.id);
      setUserData(userHistory);
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Re-throw to let AuthModal handle the error display
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    try {
      const response = await AuthService.signup(name, email, password);
      const { user: userData, token } = response;
      
      localStorage.setItem('mindmotion_token', token);
      
      setUser(userData);
      setShowAuthModal(false);
      setCurrentPage('dashboard');
      
      // Initialize empty user data for new user
      setUserData({
        explanations: [],
        quizzes: [],
        flashcards: [],
        notes: []
      });
    } catch (error) {
      console.error('Signup failed:', error);
      throw error; // Re-throw to let AuthModal handle the error display
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('mindmotion_token');
    setUser(null);
    setUserData({
      explanations: [],
      quizzes: [],
      flashcards: [],
      notes: []
    });
    setCurrentPage('landing');
    setSidebarOpen(false);
  };

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const saveUserData = async (type: keyof UserData, data: any) => {
    if (!user) return;
    
    try {
      await StorageService.saveUserData(user.id, type, data);
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        [type]: [...prev[type], data]
      }));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');
      
      if (sidebarOpen && sidebar && !sidebar.contains(event.target as Node) && 
          menuButton && !menuButton.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onGetStarted={() => setShowAuthModal(true)} />;
      case 'dashboard':
        return (
          <Dashboard 
            onNavigate={navigateToPage} 
            userName={user?.name || ''} 
            userData={userData}
          />
        );
      case 'scan':
        return <ScanQuestion onSaveExplanation={(data) => saveUserData('explanations', data)} />;
      case 'quiz':
        return <GenerateQuiz onSaveQuiz={(data) => saveUserData('quizzes', data)} />;
      case 'flashcards':
        return <Flashcards onSaveFlashcards={(data) => saveUserData('flashcards', data)} />;
      case 'vault':
        return <NotesVault userData={userData} onSaveNote={(data) => saveUserData('notes', data)} />;
      case 'history':
        return <History userData={userData} onNavigate={navigateToPage} />;
      case 'ai-coach':
        return <AIStudyCoach userData={userData} onSaveCoachSession={(data) => saveUserData('notes', data)} />;
      case 'voice-assistant':
        return <AIVoiceAssistant onSaveSession={(data) => saveUserData('notes', data)} />;
      case 'smart-camera':
        return <AISmartCamera onSaveCapture={(data) => saveUserData('notes', data)} />;
      default:
        return <LandingPage onGetStarted={() => setShowAuthModal(true)} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <GeometricBackground variant="minimal" />
        <div className="min-h-screen flex items-center justify-center relative z-content">
          <div className="text-center space-y-6 animate-bounce-in">
            <div className="relative">
              <Logo size="xl" animated={true} />
            </div>
            <h2 className="text-2xl font-bold text-gradient">
              MindMotion
            </h2>
            <p className="text-amber-700">Loading your study session...</p>
            <div className="flex justify-center space-x-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative">
        <GeometricBackground variant="landing" />
        <div className="relative z-content">
          {renderCurrentPage()}
        </div>
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)}
            onLogin={handleLogin}
            onSignup={handleSignup}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* 3D Geometric Background for authenticated pages */}
      <GeometricBackground variant="dashboard" />

      {/* Mobile Header */}
      <div className="lg:hidden glass sticky top-0 z-header px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Logo size="md" animated={true} />
          <span className="text-xl font-bold text-gradient">
            MindMotion
          </span>
        </div>
        <button
          id="menu-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-amber-100 transition-colors ripple interactive-element"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="flex relative z-content">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen}
          currentPage={currentPage}
          onNavigate={navigateToPage}
          onLogout={handleLogout}
          userName={user.name}
          userData={userData}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {renderCurrentPage()}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-sidebar backdrop-blur-sm lg:hidden" />
      )}
    </div>
  );
}

export default App;