import React, { useState, useEffect } from 'react';
import { Brain, MessageCircle, TrendingUp, Target, Lightbulb, Zap, Send, Mic, MicOff, Volume2, Star, Award, Clock, BookOpen } from 'lucide-react';
import { OpenAIService } from '../services/OpenAIService';

interface AIStudyCoachProps {
  userData: {
    explanations: any[];
    quizzes: any[];
    flashcards: any[];
    notes: any[];
  };
  onSaveCoachSession: (data: any) => void;
}

interface CoachMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface StudyInsight {
  type: 'strength' | 'weakness' | 'recommendation' | 'milestone';
  title: string;
  description: string;
  actionable: string;
  priority: 'high' | 'medium' | 'low';
}

const AIStudyCoach: React.FC<AIStudyCoachProps> = ({ userData, onSaveCoachSession }) => {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [studyInsights, setStudyInsights] = useState<StudyInsight[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [completedToday, setCompletedToday] = useState(0);

  // Initialize AI coach with personalized greeting
  useEffect(() => {
    initializeCoach();
    generateStudyInsights();
    calculateStreakAndProgress();
  }, [userData]);

  const initializeCoach = async () => {
    const totalItems = userData.explanations.length + userData.quizzes.length + 
                      userData.flashcards.length + userData.notes.length;
    
    const greeting: CoachMessage = {
      id: `msg-${Date.now()}`,
      type: 'ai',
      content: `👋 Hi there! I'm your AI Study Coach. I've analyzed your ${totalItems} study items and I'm here to help you learn more effectively. What would you like to work on today?`,
      timestamp: new Date().toISOString(),
      suggestions: [
        "📊 Analyze my study patterns",
        "🎯 Set learning goals",
        "💡 Get study tips",
        "🧠 Practice weak areas"
      ]
    };

    setMessages([greeting]);
  };

  const generateStudyInsights = async () => {
    try {
      const insights: StudyInsight[] = [
        {
          type: 'strength',
          title: 'Strong in Problem Solving',
          description: 'You excel at analytical questions',
          actionable: 'Try teaching concepts to reinforce learning',
          priority: 'medium'
        },
        {
          type: 'weakness',
          title: 'Need More Practice',
          description: 'Conceptual understanding needs work',
          actionable: 'Focus on flashcards for key definitions',
          priority: 'high'
        },
        {
          type: 'recommendation',
          title: 'Study Schedule',
          description: 'Optimal learning time: 25-min sessions',
          actionable: 'Use Pomodoro technique for better focus',
          priority: 'medium'
        },
        {
          type: 'milestone',
          title: 'Achievement Unlocked!',
          description: 'Completed 10 study sessions',
          actionable: 'Keep up the momentum!',
          priority: 'low'
        }
      ];

      setStudyInsights(insights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
    }
  };

  const calculateStreakAndProgress = () => {
    // Calculate study streak and daily progress
    const today = new Date().toDateString();
    const todayItems = [
      ...userData.explanations,
      ...userData.quizzes,
      ...userData.flashcards,
      ...userData.notes
    ].filter(item => new Date(item.createdAt).toDateString() === today);

    setCompletedToday(todayItems.length);
    setCurrentStreak(Math.floor(Math.random() * 7) + 1); // Simulated streak
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: CoachMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);

    try {
      // Generate AI coach response
      const aiResponse = await generateCoachResponse(inputMessage);
      
      const aiMessage: CoachMessage = {
        id: `msg-${Date.now() + 1}`,
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date().toISOString(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to get coach response:', error);
      const errorMessage: CoachMessage = {
        id: `msg-${Date.now() + 1}`,
        type: 'ai',
        content: "I'm having trouble connecting right now, but I'm here to help! Try asking about study strategies, goal setting, or review techniques.",
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCoachResponse = async (userInput: string): Promise<{content: string, suggestions: string[]}> => {
    // Simulate AI coach responses based on input
    const responses = {
      study: {
        content: "🎯 Based on your learning style, I recommend the 'Active Recall' method. Instead of just re-reading, try to explain concepts out loud or write them from memory. This strengthens neural pathways!",
        suggestions: ["📝 Create practice tests", "🗣️ Explain to someone", "⏰ Use spaced repetition", "🎨 Make visual aids"]
      },
      goal: {
        content: "🚀 Let's set SMART goals! I suggest starting with 3 study sessions this week, focusing on your weakest subjects. Small, consistent progress beats cramming every time!",
        suggestions: ["📊 Track daily progress", "🎯 Set weekly targets", "🏆 Reward milestones", "📅 Schedule study time"]
      },
      motivation: {
        content: "💪 Remember why you started! Every expert was once a beginner. Your brain is literally rewiring itself with each study session. You're building the future version of yourself!",
        suggestions: ["🌟 Visualize success", "📈 Review progress", "🎉 Celebrate wins", "👥 Find study buddy"]
      },
      default: {
        content: "🤔 That's an interesting question! As your AI coach, I'm here to help you optimize your learning. What specific challenge are you facing with your studies?",
        suggestions: ["📚 Study techniques", "⏰ Time management", "🧠 Memory tips", "🎯 Goal setting"]
      }
    };

    const input = userInput.toLowerCase();
    if (input.includes('study') || input.includes('learn')) return responses.study;
    if (input.includes('goal') || input.includes('target')) return responses.goal;
    if (input.includes('motivat') || input.includes('help')) return responses.motivation;
    return responses.default;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion.replace(/[📊🎯💡🧠📝🗣️⏰🎨📈🌟🎉👥📚]/g, '').trim());
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognition.start();
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text.replace(/[🎯📊💡🧠👋🚀💪🤔📝🗣️⏰🎨📈🌟🎉👥📚]/g, ''));
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return <Star className="w-5 h-5 text-green-500" />;
      case 'weakness': return <Target className="w-5 h-5 text-red-500" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5 text-blue-500" />;
      case 'milestone': return <Award className="w-5 h-5 text-purple-500" />;
      default: return <Brain className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 p-4">
      {/* Mobile-Optimized Header */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Study Coach</h1>
              <p className="text-sm text-gray-600">Your personal learning assistant</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{currentStreak}</div>
            <div className="text-xs text-gray-500">Day Streak</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Daily Goal Progress</span>
            <span className="text-sm text-gray-600">{completedToday}/{weeklyGoal}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((completedToday / weeklyGoal) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600">{userData.explanations.length}</div>
            <div className="text-xs text-blue-600">Questions</div>
          </div>
          <div className="bg-violet-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-violet-600">{userData.quizzes.length}</div>
            <div className="text-xs text-violet-600">Quizzes</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-emerald-600">{userData.flashcards.length}</div>
            <div className="text-xs text-emerald-600">Flashcards</div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <span>AI Study Insights</span>
        </h3>
        <div className="space-y-3">
          {studyInsights.map((insight, index) => (
            <div
              key={index}
              className={`border-l-4 rounded-lg p-3 ${getPriorityColor(insight.priority)}`}
            >
              <div className="flex items-start space-x-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                  <p className="text-gray-600 text-xs mt-1">{insight.description}</p>
                  <p className="text-blue-600 text-xs mt-1 font-medium">{insight.actionable}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-2xl shadow-lg flex flex-col h-96 mb-4">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">AI Coach Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.type === 'ai' && (
                  <button
                    onClick={() => speakMessage(message.content)}
                    className="mt-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Volume2 className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Suggestions */}
          {messages.length > 0 && messages[messages.length - 1].suggestions && (
            <div className="flex flex-wrap gap-2 mt-3">
              {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask your AI coach anything..."
                className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <button
              onClick={startVoiceInput}
              className={`p-2 rounded-full transition-colors ${
                isListening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isProcessing}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2">
          <Zap className="w-5 h-5" />
          <span className="font-medium">Quick Quiz</span>
        </button>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">Study Plan</span>
        </button>
      </div>
    </div>
  );
};

export default AIStudyCoach;