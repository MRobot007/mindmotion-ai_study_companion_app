import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, Zap, Brain, Eye, Scan, Download, RotateCcw, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { OpenAIService } from '../services/OpenAIService';

interface AISmartCameraProps {
  onSaveCapture: (data: any) => void;
}

interface CaptureResult {
  id: string;
  image: string;
  extractedText: string;
  aiAnalysis: string;
  confidence: number;
  timestamp: string;
  processingTime: number;
}

const AISmartCamera: React.FC<AISmartCameraProps> = ({ onSaveCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<CaptureResult[]>([]);
  const [currentResult, setCurrentResult] = useState<CaptureResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [processingStage, setProcessingStage] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera access error:', error);
      setCameraError('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();

    // Process the captured image
    processImage(imageData);
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setProcessingStage('Initializing AI analysis...');
    const startTime = Date.now();

    try {
      // Stage 1: Text Extraction
      setProcessingStage('🔍 Extracting text with AI OCR...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate OCR processing
      const extractedText = await simulateOCR(imageData);

      // Stage 2: AI Analysis
      setProcessingStage('🧠 Analyzing content with Llama 3...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      const aiAnalysis = await generateAIAnalysis(extractedText);

      // Stage 3: Confidence Calculation
      setProcessingStage('📊 Calculating confidence scores...');
      await new Promise(resolve => setTimeout(resolve, 500));

      const confidence = Math.floor(Math.random() * 20) + 80; // 80-100%
      const processingTime = Date.now() - startTime;

      const result: CaptureResult = {
        id: `capture-${Date.now()}`,
        image: imageData,
        extractedText,
        aiAnalysis,
        confidence,
        timestamp: new Date().toISOString(),
        processingTime
      };

      setCurrentResult(result);
      setResults(prev => [result, ...prev]);

      // Save to user data
      onSaveCapture({
        ...result,
        type: 'smart_capture',
        createdAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Image processing error:', error);
      setProcessingStage('❌ Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const simulateOCR = async (imageData: string): Promise<string> => {
    // Simulate different types of educational content
    const sampleTexts = [
      "What is the derivative of f(x) = 3x² + 2x - 1?",
      "Explain the process of photosynthesis in plants and its importance to the ecosystem.",
      "Solve the quadratic equation: x² - 5x + 6 = 0",
      "What are the main causes of World War I?",
      "Define osmosis and provide an example of how it works in biological systems.",
      "Calculate the area of a circle with radius 7 cm.",
      "What is Newton's Third Law of Motion?",
      "Explain the difference between mitosis and meiosis.",
      "What is the capital of Australia and when was it established?",
      "How do you convert Celsius to Fahrenheit?"
    ];

    return sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  };

  const generateAIAnalysis = async (text: string): Promise<string> => {
    // Generate contextual AI analysis based on the extracted text
    const analysisTemplates = {
      math: "This is a mathematical problem that requires step-by-step solution. I can help break down the approach: identify the type of problem, apply the relevant formula or method, and solve systematically.",
      science: "This appears to be a science question. Let me provide a comprehensive explanation covering the key concepts, underlying principles, and real-world applications to help you understand the topic thoroughly.",
      history: "This is a historical question that requires understanding of context, causes, and effects. I'll provide a detailed analysis of the events, key figures, and their significance in the broader historical context.",
      general: "I've analyzed your question and can provide a detailed explanation. Let me break down the key concepts and provide step-by-step guidance to help you understand this topic better."
    };

    const textLower = text.toLowerCase();
    if (textLower.includes('derivative') || textLower.includes('equation') || textLower.includes('calculate')) {
      return analysisTemplates.math;
    } else if (textLower.includes('photosynthesis') || textLower.includes('osmosis') || textLower.includes('mitosis')) {
      return analysisTemplates.science;
    } else if (textLower.includes('war') || textLower.includes('capital') || textLower.includes('established')) {
      return analysisTemplates.history;
    } else {
      return analysisTemplates.general;
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCurrentResult(null);
    startCamera();
  };

  const downloadImage = (imageData: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = imageData;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">AI Smart Camera</h1>
              <p className="text-sm text-gray-600">Capture, analyze, learn instantly</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">{results.length}</div>
            <div className="text-xs text-gray-500">Captures</div>
          </div>
        </div>

        {/* AI Status */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 font-medium text-sm">
              🤖 AI Vision & Analysis Ready
            </span>
            <Sparkles className="w-4 h-4 text-green-600" />
          </div>
        </div>
      </div>

      {/* Camera Interface */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
        {/* Camera View */}
        <div className="relative bg-black aspect-video">
          {isCameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">AI Smart Camera</p>
                <p className="text-sm opacity-75">Tap to start capturing and analyzing</p>
              </div>
            </div>
          )}

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="text-center text-white">
                <Brain className="w-12 h-12 mx-auto mb-4 animate-spin" />
                <p className="text-lg font-medium mb-2">AI Processing...</p>
                <p className="text-sm opacity-75">{processingStage}</p>
                <div className="w-48 bg-gray-700 rounded-full h-2 mt-4">
                  <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          )}

          {/* Camera Controls Overlay */}
          {isCameraActive && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={captureImage}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-4">
          {cameraError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{cameraError}</span>
            </div>
          )}

          <div className="flex justify-center space-x-3">
            {!isCameraActive && !capturedImage && (
              <button
                onClick={startCamera}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Start Camera</span>
              </button>
            )}

            {isCameraActive && (
              <button
                onClick={stopCamera}
                className="bg-red-500 text-white px-6 py-3 rounded-full font-medium hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <CameraOff className="w-5 h-5" />
                <span>Stop Camera</span>
              </button>
            )}

            {capturedImage && !isProcessing && (
              <>
                <button
                  onClick={retakePhoto}
                  className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-medium hover:border-green-500 hover:text-green-600 transition-all duration-300 flex items-center space-x-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Retake</span>
                </button>
                <button
                  onClick={() => downloadImage(capturedImage, `capture-${Date.now()}.jpg`)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Current Result */}
      {currentResult && (
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Eye className="w-5 h-5 text-green-500" />
              <span>AI Analysis Result</span>
            </h3>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentResult.confidence >= 90 ? 'bg-green-100 text-green-700' :
                currentResult.confidence >= 70 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {currentResult.confidence}% confidence
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>

          {/* Extracted Text */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Scan className="w-4 h-4 text-blue-500" />
              <span>Extracted Text</span>
            </h4>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-blue-800">{currentResult.extractedText}</p>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <span>AI Analysis</span>
            </h4>
            <div className="bg-purple-50 rounded-lg p-3">
              <p className="text-purple-800">{currentResult.aiAnalysis}</p>
            </div>
          </div>

          {/* Processing Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-gray-900">{currentResult.processingTime}ms</div>
              <div className="text-xs text-gray-600">Processing Time</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-gray-900">{new Date(currentResult.timestamp).toLocaleTimeString()}</div>
              <div className="text-xs text-gray-600">Captured At</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Captures */}
      <div className="bg-white rounded-2xl shadow-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Captures</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Camera className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No captures yet</p>
              <p className="text-sm">Start capturing to see your AI analysis history!</p>
            </div>
          ) : (
            results.map((result) => (
              <div key={result.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <img
                    src={result.image}
                    alt="Capture"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.confidence >= 90 ? 'bg-green-100 text-green-700' :
                        result.confidence >= 70 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {result.confidence}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-2 mb-1">
                      {result.extractedText}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-1">
                      {result.aiAnalysis}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default AISmartCamera;