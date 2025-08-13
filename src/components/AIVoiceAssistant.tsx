import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Brain, Zap, MessageSquare, Play, Pause, RotateCcw } from 'lucide-react';
import { OpenAIService } from '../services/OpenAIService';

interface AIVoiceAssistantProps {
  onSaveSession: (data: any) => void;
}

interface VoiceSession {
  id: string;
  question: string;
  response: string;
  timestamp: string;
  duration: number;
}

const AIVoiceAssistant: React.FC<AIVoiceAssistantProps> = ({ onSaveSession }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessions, setSessions] = useState<VoiceSession[]>([]);
  const [volume, setVolume] = useState(1);
  const [speechRate, setSpeechRate] = useState(1);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);

  const recognitionRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        if (!isSessionActive) {
          setIsSessionActive(true);
          startTimeRef.current = Date.now();
          startTimer();
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setCurrentTranscript(finalTranscript);
          handleVoiceInput(finalTranscript);
        } else {
          setCurrentTranscript(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;

    setIsProcessing(true);
    stopListening();

    try {
      // Generate AI response
      const response = await generateVoiceResponse(transcript);
      
      // Create session record
      const session: VoiceSession = {
        id: `voice-${Date.now()}`,
        question: transcript,
        response: response,
        timestamp: new Date().toISOString(),
        duration: Math.floor((Date.now() - startTimeRef.current) / 1000)
      };

      setSessions(prev => [session, ...prev]);

      // Speak the response
      if (voiceEnabled) {
        await speakText(response);
      }

      // Save session
      onSaveSession({
        ...session,
        type: 'voice_session',
        createdAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Voice processing error:', error);
      const errorResponse = "I'm sorry, I couldn't process that. Could you please try again?";
      if (voiceEnabled) {
        await speakText(errorResponse);
      }
    } finally {
      setIsProcessing(false);
      setCurrentTranscript('');
    }
  };

  const generateVoiceResponse = async (input: string): Promise<string> => {
    // Simulate AI voice responses based on input
    const responses = {
      greeting: "Hello! I'm your AI voice assistant. I'm here to help you with your studies. What would you like to learn about today?",
      study: "Great question about studying! I recommend using active recall techniques. Try explaining concepts out loud, just like you're doing now. This helps strengthen your memory pathways.",
      quiz: "I'd be happy to quiz you! Let's start with some questions. What subject would you like to focus on? Just tell me the topic and I'll create some practice questions for you.",
      explain: "I'll explain that concept for you. Breaking it down into simple terms helps with understanding. Let me walk you through it step by step.",
      motivation: "You're doing great by using voice learning! Speaking and listening engages different parts of your brain than just reading. Keep up the excellent work!",
      default: "That's an interesting question! As your AI voice assistant, I can help explain concepts, create quizzes, provide study tips, or just have a learning conversation. What would be most helpful for you right now?"
    };

    const input_lower = input.toLowerCase();
    if (input_lower.includes('hello') || input_lower.includes('hi')) return responses.greeting;
    if (input_lower.includes('study') || input_lower.includes('learn')) return responses.study;
    if (input_lower.includes('quiz') || input_lower.includes('test')) return responses.quiz;
    if (input_lower.includes('explain') || input_lower.includes('what is')) return responses.explain;
    if (input_lower.includes('motivat') || input_lower.includes('encourage')) return responses.motivation;
    return responses.default;
  };

  const speakText = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = volume;
        utterance.rate = speechRate;
        utterance.pitch = 1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          resolve();
        };

        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const endSession = () => {
    stopListening();
    stopSpeaking();
    stopTimer();
    setIsSessionActive(false);
    setSessionDuration(0);
    setCurrentTranscript('');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Voice Assistant</h1>
              <p className="text-sm text-gray-600">Speak naturally, learn effectively</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-purple-600">{formatDuration(sessionDuration)}</div>
            <div className="text-xs text-gray-500">Session Time</div>
          </div>
        </div>

        {/* Voice Controls */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-700">Volume</span>
              <Volume2 className="w-4 h-4 text-purple-600" />
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="bg-pink-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-pink-700">Speed</span>
              <Zap className="w-4 h-4 text-pink-600" />
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isListening ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isListening ? 'Listening...' : 'Ready to listen'}</span>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isSpeaking ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isSpeaking ? 'Speaking...' : 'Ready to speak'}</span>
          </div>
        </div>
      </div>

      {/* Main Voice Interface */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
        {/* Current Transcript */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Conversation</h3>
          <div className="bg-gray-50 rounded-lg p-4 min-h-20">
            {currentTranscript ? (
              <p className="text-gray-800">{currentTranscript}</p>
            ) : (
              <p className="text-gray-500 italic">
                {isListening ? 'Listening for your voice...' : 'Tap the microphone to start speaking'}
              </p>
            )}
          </div>
        </div>

        {/* Voice Control Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 ${
              isListening
                ? 'bg-red-500 text-white shadow-lg animate-pulse'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          <button
            onClick={isSpeaking ? stopSpeaking : () => {}}
            disabled={!isSpeaking}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isSpeaking
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-200 text-gray-400'
            } disabled:cursor-not-allowed`}
          >
            {isSpeaking ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>

          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              voiceEnabled
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-300 text-gray-600'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-8 h-8" /> : <VolumeX className="w-8 h-8" />}
          </button>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-5 h-5 text-purple-500 animate-spin" />
            <span className="text-purple-600 font-medium">AI is thinking...</span>
          </div>
        )}

        {/* Session Controls */}
        <div className="flex justify-center space-x-3">
          <button
            onClick={endSession}
            className="bg-red-500 text-white px-6 py-2 rounded-full font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Voice Sessions</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No voice sessions yet</p>
              <p className="text-sm">Start speaking to create your first session!</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">
                    {new Date(session.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="text-xs text-purple-600 font-medium">
                    {formatDuration(session.duration)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="bg-blue-50 rounded-lg p-2">
                    <p className="text-sm text-blue-800">
                      <strong>You:</strong> {session.question}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-2">
                    <p className="text-sm text-purple-800">
                      <strong>AI:</strong> {session.response}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => speakText(session.response)}
                  className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Replay</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AIVoiceAssistant;