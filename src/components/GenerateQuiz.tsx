import React, { useState } from 'react';
import { Target, Settings, Play, CheckCircle, XCircle, RefreshCw, Award, Clock, Save, Brain, Sparkles, Zap } from 'lucide-react';
import { OpenAIService } from '../services/OpenAIService';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: string;
}

interface GenerateQuizProps {
  onSaveQuiz: (data: any) => void;
}

const GenerateQuiz: React.FC<GenerateQuizProps> = ({ onSaveQuiz }) => {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState(0); // Track attempts for uniqueness

  const generateQuiz = async (forceNew: boolean = false) => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setIsSaved(false);
    
    try {
      console.log(`🎯 Generating ${forceNew ? 'NEW' : ''} quiz with Llama 3 AI...`);
      
      // Increment attempts to ensure uniqueness
      const currentAttempt = forceNew ? quizAttempts + 1 : quizAttempts;
      setQuizAttempts(currentAttempt);
      
      const response = await OpenAIService.generateQuiz(topic, numQuestions, difficulty);
      setQuiz(response.questions);
      setUserAnswers(new Array(response.questions.length).fill(null));
      setEstimatedTime(response.estimatedTime || numQuestions * 2);
      
      console.log(`✅ ${forceNew ? 'NEW' : ''} Quiz generated successfully! Attempt #${currentAttempt + 1}`);
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...userAnswers];
      newAnswers[currentQuestion] = selectedAnswer;
      setUserAnswers(newAnswers);
      
      if (selectedAnswer === quiz[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
    }
    
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setUserAnswers([]);
    setIsSaved(false);
  };

  const handleSaveQuiz = () => {
    if (!quiz.length) return;

    const quizData = {
      topic: topic,
      questions: quiz.length,
      score: score,
      percentage: Math.round((score / quiz.length) * 100),
      difficulty: difficulty,
      estimatedTime: estimatedTime,
      attempt: quizAttempts + 1,
      createdAt: new Date().toISOString(),
      type: 'quiz'
    };

    onSaveQuiz(quizData);
    setIsSaved(true);
  };

  // 🔄 NEW: Generate completely new quiz on same topic
  const generateNewQuiz = async () => {
    console.log('🔄 Generating completely NEW quiz on same topic...');
    await generateQuiz(true); // Force new generation
  };

  const getScoreColor = () => {
    const percentage = (score / quiz.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceMessage = () => {
    const percentage = (score / quiz.length) * 100;
    if (percentage >= 90) return "🏆 Outstanding! You're mastering this topic!";
    if (percentage >= 80) return "🎉 Excellent work! You have a strong understanding!";
    if (percentage >= 70) return "👍 Good job! Keep practicing to improve further!";
    if (percentage >= 60) return "📚 Not bad! Review the concepts and try again!";
    return "💪 Keep studying! Practice makes perfect!";
  };

  if (showResult) {
    return (
      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center animate-pulse">
            <Award className="w-12 h-12 text-white" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
            <p className="text-gray-600 text-lg">{getPerformanceMessage()}</p>
            {quizAttempts > 0 && (
              <p className="text-sm text-blue-600 mt-2">Quiz Attempt #{quizAttempts + 1} on {topic}</p>
            )}
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="text-center space-y-4">
              <div className={`text-6xl font-bold ${getScoreColor()}`}>
                {score}/{quiz.length}
              </div>
              <div className="text-xl text-gray-600">
                {Math.round((score / quiz.length) * 100)}% Correct
              </div>
              
              <div className="flex justify-center space-x-8 mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-gray-500">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{quiz.length - score}</div>
                  <div className="text-sm text-gray-500">Incorrect</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{quiz.length}</div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{estimatedTime}m</div>
                  <div className="text-sm text-gray-500">Time Est.</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSaveQuiz}
              disabled={isSaved}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                isSaved 
                  ? 'bg-green-100 text-green-700 cursor-not-allowed' 
                  : 'bg-emerald-500 text-white hover:bg-emerald-600'
              }`}
            >
              <Save className="w-5 h-5" />
              <span>{isSaved ? 'Saved!' : 'Save Results'}</span>
            </button>
            <button
              onClick={resetQuiz}
              className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
            {/* 🔄 ENHANCED: Generate New Quiz Button */}
            <button
              onClick={generateNewQuiz}
              disabled={isGenerating}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate New Quiz</span>
                  <Brain className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* 💡 NEW: Quiz Variety Info */}
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-center space-x-2 text-blue-700">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">
                Each new quiz generates completely different questions on {topic}!
              </span>
              <Brain className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizStarted && quiz.length > 0) {
    const currentQ = quiz[currentQuestion];
    
    return (
      <div className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
        {/* Progress Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {quiz.length}
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">
                Score: {score}/{currentQuestion}
              </span>
              {quizAttempts > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  Attempt #{quizAttempts + 1}
                </span>
              )}
              {currentQ.difficulty && (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentQ.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                  currentQ.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentQ.difficulty}
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                {currentQuestion + 1}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 flex-1">
                {currentQ.question}
              </h2>
              <Brain className="w-6 h-6 text-blue-500" />
            </div>
            
            <div className="grid gap-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-gray-800 font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-6">
              <button
                onClick={() => {
                  if (currentQuestion > 0) {
                    setCurrentQuestion(currentQuestion - 1);
                    setSelectedAnswer(userAnswers[currentQuestion - 1]);
                  }
                }}
                disabled={currentQuestion === 0}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <button
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
                className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>{currentQuestion === quiz.length - 1 ? 'Finish' : 'Next'}</span>
                <Play className="w-4 h-4" />
              </button>
            </div>
          </div>
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
            <Target className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Quiz Generator
          </h1>
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center animate-pulse">
            <Brain className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="text-gray-600 text-lg">
          Create intelligent quizzes on any topic with Llama 3 AI
        </p>
        
        {/* AI Status */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 font-medium">
              🤖 Llama 3 AI Ready for Quiz Generation
            </span>
            <Sparkles className="w-5 h-5 text-green-600" />
          </div>
        </div>
      </div>

      {!quiz.length ? (
        <>
          {/* Quiz Configuration */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">AI Quiz Configuration</h3>
              <Brain className="w-6 h-6 text-violet-600" />
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic or Subject
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Physics, Biology, History, Mathematics, Programming..."
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions
                  </label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={3}>3 Questions (Quick)</option>
                    <option value={5}>5 Questions (Standard)</option>
                    <option value={10}>10 Questions (Comprehensive)</option>
                    <option value={15}>15 Questions (Extensive)</option>
                    <option value={20}>20 Questions (Full Test)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="easy">Easy (Beginner)</option>
                    <option value="medium">Medium (Intermediate)</option>
                    <option value="hard">Hard (Advanced)</option>
                  </select>
                </div>
              </div>
              
              <button
                onClick={() => generateQuiz(false)}
                disabled={!topic.trim() || isGenerating}
                className="w-full bg-gradient-to-r from-blue-500 to-violet-500 text-white py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                    <span>AI is creating your quiz...</span>
                    <Brain className="w-6 h-6 animate-pulse" />
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    <span>Generate AI Quiz</span>
                    <Target className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sample Topics */}
          <div className="bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl border border-blue-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>AI-Powered Topics</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                'Physics & Mechanics', 
                'Biology & Life Sciences', 
                'Chemistry & Reactions', 
                'Mathematics & Calculus',
                'Computer Science', 
                'World History', 
                'Literature & Writing', 
                'Psychology',
                'Economics & Finance',
                'Environmental Science',
                'Philosophy & Ethics',
                'Data Science & AI'
              ].map((sampleTopic) => (
                <button
                  key={sampleTopic}
                  onClick={() => setTopic(sampleTopic)}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  {sampleTopic}
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Quiz Preview */
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>AI Quiz Ready!</span>
                <Sparkles className="w-6 h-6 text-blue-500" />
              </h3>
              <p className="text-gray-600">
                {quiz.length} questions on {topic} • {difficulty} difficulty • ~{estimatedTime} minutes
              </p>
              {quizAttempts > 0 && (
                <p className="text-sm text-blue-600 mt-1">
                  This is attempt #{quizAttempts + 1} with completely new questions!
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2 text-blue-600">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Estimated: {estimatedTime} min</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <span>AI-Generated Questions Preview:</span>
            </h4>
            <div className="space-y-2">
              {quiz.slice(0, 3).map((q, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 font-medium">{index + 1}.</span>
                  <span className="text-gray-700">{q.question}</span>
                  {q.difficulty && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                      q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {q.difficulty}
                    </span>
                  )}
                </div>
              ))}
              {quiz.length > 3 && (
                <p className="text-gray-500 italic">...and {quiz.length - 3} more AI-generated questions</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={startQuiz}
              className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <Play className="w-6 h-6" />
              <span>Start AI Quiz</span>
              <Brain className="w-6 h-6" />
            </button>
            {/* 🔄 ENHANCED: Generate Different Quiz Button */}
            <button
              onClick={generateNewQuiz}
              disabled={isGenerating}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600" />
                  <span>Creating New Quiz...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  <span>Generate Different Quiz</span>
                  <RefreshCw className="w-6 h-6" />
                </>
              )}
            </button>
          </div>

          {/* 💡 NEW: Quiz Uniqueness Info */}
          <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
            <div className="flex items-center justify-center space-x-2 text-emerald-700">
              <Brain className="w-5 h-5" />
              <span className="text-sm font-medium">
                AI generates completely unique questions each time - no repeats guaranteed!
              </span>
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateQuiz;