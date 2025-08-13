import React, { useState } from 'react';
import { Lightbulb, Plus, RotateCcw, Save, Download, Trash2, Eye, EyeOff, Brain, Sparkles, Target, Zap } from 'lucide-react';
import { OpenAIService } from '../services/OpenAIService';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty?: string;
}

interface FlashcardsProps {
  onSaveFlashcards: (data: any) => void;
}

const Flashcards: React.FC<FlashcardsProps> = ({ onSaveFlashcards }) => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [totalCards, setTotalCards] = useState(0);

  const generateFlashcards = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setIsSaved(false);
    
    try {
      console.log('💡 Generating flashcards with Llama 3 AI...');
      const response = await OpenAIService.generateFlashcards(inputText);
      
      const generatedCards: Flashcard[] = response.flashcards.map((card, index) => ({
        id: `card-${Date.now()}-${index}`,
        front: card.front,
        back: card.back,
        category: card.category || 'AI Generated',
        difficulty: card.difficulty || 'medium'
      }));
      
      setFlashcards(generatedCards);
      setTotalCards(response.totalCards || generatedCards.length);
      setCurrentCard(0);
      setIsFlipped(false);
      setStudyMode(true);
      console.log('✅ Flashcards generated successfully!');
    } catch (error) {
      console.error('Failed to generate flashcards:', error);
      alert('Failed to generate flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveFlashcards = () => {
    if (!flashcards.length) return;

    const flashcardData = {
      title: `${flashcards[0].category} Flashcards`,
      cardCount: flashcards.length,
      category: flashcards[0].category,
      cards: flashcards,
      totalCards: totalCards,
      createdAt: new Date().toISOString(),
      type: 'flashcards'
    };

    onSaveFlashcards(flashcardData);
    setIsSaved(true);
  };

  const addManualCard = () => {
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: 'New Question',
      back: 'New Answer',
      category: 'Custom',
      difficulty: 'medium'
    };
    setFlashcards([...flashcards, newCard]);
    setIsSaved(false);
  };

  const deleteCard = (id: string) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
    if (currentCard >= flashcards.length - 1) {
      setCurrentCard(Math.max(0, flashcards.length - 2));
    }
    setIsSaved(false);
  };

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (studyMode && flashcards.length > 0) {
    const card = flashcards[currentCard];
    
    return (
      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
              <span>AI Study Mode</span>
              <Brain className="w-8 h-8 text-blue-500 animate-pulse" />
            </h1>
            <p className="text-gray-600 flex items-center space-x-2">
              <span>Card {currentCard + 1} of {flashcards.length} • {card.category}</span>
              {card.difficulty && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(card.difficulty)}`}>
                  {card.difficulty}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveFlashcards}
              disabled={isSaved}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                isSaved 
                  ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>{isSaved ? 'Saved!' : 'Save'}</span>
            </button>
            <button
              onClick={() => setStudyMode(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Exit Study Mode
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
          />
        </div>

        {/* Flashcard */}
        <div className="flex justify-center">
          <div className="relative w-full max-w-2xl h-80 perspective-1000">
            <div
              className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              onClick={flipCard}
            >
              {/* Front */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl shadow-2xl flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-relaxed">
                    {card.front}
                  </h2>
                  <p className="text-blue-100 text-sm flex items-center justify-center space-x-2">
                    <Brain className="w-4 h-4" />
                    <span>Click to reveal answer</span>
                  </p>
                </div>
              </div>

              {/* Back */}
              <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-2xl flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xl text-white leading-relaxed">
                    {card.back}
                  </p>
                  <p className="text-emerald-100 text-sm flex items-center justify-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Click to see question</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={prevCard}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={flipCard}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg hover:from-blue-600 hover:to-violet-600 transition-all duration-300 flex items-center space-x-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Flip Card</span>
          </button>
          <button
            onClick={nextCard}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>

        {/* Card Navigation */}
        <div className="flex justify-center space-x-2">
          {flashcards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentCard(index);
                setIsFlipped(false);
              }}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentCard
                  ? 'bg-blue-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center animate-pulse">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Flashcard Generator
          </h1>
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="text-gray-600 text-lg">
          Transform your notes into intelligent flashcards with Llama 3 AI
        </p>
        
        {/* AI Status */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 font-medium">
              🤖 Llama 3 AI Ready for Flashcard Creation
            </span>
            <Sparkles className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      {!flashcards.length ? (
        <>
          {/* Input Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">AI Flashcard Creation</h3>
              <Brain className="w-6 h-6 text-violet-600" />
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste your study material for AI analysis
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your notes, textbook content, or any study material here. AI will automatically create intelligent flashcards with questions and answers optimized for learning..."
                  className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              
              <button
                onClick={generateFlashcards}
                disabled={!inputText.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-500 to-violet-500 text-white py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                    <span>AI is creating flashcards...</span>
                    <Brain className="w-6 h-6 animate-pulse" />
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    <span>Generate AI Flashcards</span>
                    <Lightbulb className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sample Topics */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span>AI-Powered Sample Topics</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Biology: Photosynthesis, cellular respiration, DNA structure, protein synthesis',
                'Physics: Newton\'s laws, kinetic energy, thermodynamics, quantum mechanics',
                'History: World War events, important dates, key figures, cultural movements',
                'Chemistry: Periodic table, chemical reactions, atomic structure, organic compounds',
                'Computer Science: Algorithms, data structures, programming concepts, AI fundamentals',
                'Mathematics: Calculus, algebra, geometry, statistics and probability'
              ].map((sample, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(sample.split(': ')[1])}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-sm transition-all duration-200 text-left"
                >
                  <div className="font-medium text-gray-900">{sample.split(': ')[0]}</div>
                  <div className="text-sm text-gray-600 mt-1">{sample.split(': ')[1]}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Flashcard Management */
        <div className="space-y-8">
          {/* Controls */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>AI Flashcards ({flashcards.length})</span>
                <Brain className="w-6 h-6 text-blue-500" />
              </h2>
              <p className="text-gray-600">Intelligent flashcards optimized for learning</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setStudyMode(true)}
                className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-violet-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Eye className="w-5 h-5" />
                <span>Study Mode</span>
              </button>
              <button
                onClick={addManualCard}
                className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Card</span>
              </button>
            </div>
          </div>

          {/* Flashcard Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flashcards.map((card, index) => (
              <div key={card.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {card.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      {card.difficulty && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(card.difficulty)}`}>
                          {card.difficulty}
                        </span>
                      )}
                      <button
                        onClick={() => deleteCard(card.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span>Question:</span>
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {card.front}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-emerald-500" />
                      <span>Answer:</span>
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {card.back}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setFlashcards([])}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleSaveFlashcards}
              disabled={isSaved}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
                isSaved 
                  ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              <Save className="w-5 h-5" />
              <span>{isSaved ? 'Saved!' : 'Save Collection'}</span>
            </button>
            <button className="px-6 py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;