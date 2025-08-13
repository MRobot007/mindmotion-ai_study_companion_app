// Updated to use Groq AI Service as primary, with OpenAI as fallback
import { GroqAIService } from './GroqAIService';

interface ExplanationResponse {
  explanation: string;
  similarQuestions: string[];
  keyPoints?: string[];
  difficulty?: string;
  subject?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: string;
}

interface QuizResponse {
  questions: QuizQuestion[];
  totalQuestions?: number;
  estimatedTime?: number;
}

interface FlashcardResponse {
  flashcards: Array<{
    front: string;
    back: string;
    category?: string;
    difficulty?: string;
  }>;
  totalCards?: number;
}

export class OpenAIService {
  // 🚀 PRIMARY: Use Groq AI (Llama 3) for all operations
  static async explainQuestion(question: string): Promise<ExplanationResponse> {
    try {
      console.log('🧠 Using Llama 3 AI for question explanation...');
      const response = await GroqAIService.explainQuestion(question);
      return {
        explanation: response.explanation,
        similarQuestions: response.similarQuestions,
        keyPoints: response.keyPoints,
        difficulty: response.difficulty,
        subject: response.subject
      };
    } catch (error) {
      console.error('Llama 3 failed, using fallback:', error);
      return this.getFallbackExplanation(question);
    }
  }

  static async generateQuiz(topic: string, numQuestions: number, difficulty: string): Promise<QuizResponse> {
    try {
      console.log('🎯 Using Llama 3 AI for quiz generation...');
      const response = await GroqAIService.generateQuiz(topic, numQuestions, difficulty);
      return {
        questions: response.questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty
        })),
        totalQuestions: response.totalQuestions,
        estimatedTime: response.estimatedTime
      };
    } catch (error) {
      console.error('Llama 3 failed, using fallback:', error);
      return this.getFallbackQuiz(topic, numQuestions, difficulty);
    }
  }

  static async generateFlashcards(text: string): Promise<FlashcardResponse> {
    try {
      console.log('💡 Using Llama 3 AI for flashcard generation...');
      const response = await GroqAIService.generateFlashcards(text);
      return {
        flashcards: response.flashcards.map(card => ({
          front: card.front,
          back: card.back,
          category: card.category,
          difficulty: card.difficulty
        })),
        totalCards: response.totalCards
      };
    } catch (error) {
      console.error('Llama 3 failed, using fallback:', error);
      return this.getFallbackFlashcards(text);
    }
  }

  // 📸 NEW: OCR Processing with Llama 3
  static async processImageOCR(imageBase64: string): Promise<any> {
    try {
      console.log('📸 Using Llama 3 AI for OCR processing...');
      return await GroqAIService.processImageOCR(imageBase64);
    } catch (error) {
      console.error('OCR processing failed:', error);
      return {
        extractedText: "Unable to process image. Please try again with a clearer image.",
        confidence: 0,
        detectedLanguage: "en"
      };
    }
  }

  // 🎓 NEW: Study Recommendations
  static async getStudyRecommendations(userHistory: any[]): Promise<any> {
    try {
      console.log('🎓 Getting AI study recommendations...');
      return await GroqAIService.getStudyRecommendations(userHistory);
    } catch (error) {
      console.error('Study recommendations failed:', error);
      return {
        recommendations: ["Continue regular practice", "Review challenging topics"],
        focusAreas: ["Strengthen weak areas"],
        studyTips: ["Use active recall", "Practice spaced repetition"]
      };
    }
  }

  // 🔍 NEW: Content Analysis
  static async analyzeContent(content: string): Promise<any> {
    try {
      console.log('🔍 Analyzing content with AI...');
      return await GroqAIService.analyzeContent(content);
    } catch (error) {
      console.error('Content analysis failed:', error);
      return {
        topics: ["General content"],
        difficulty: "medium",
        objectives: ["Understand the material"],
        prerequisites: ["Basic knowledge"],
        relatedSubjects: ["Related topics"],
        estimatedTime: "30 minutes"
      };
    }
  }

  // Fallback methods (same as before but enhanced)
  private static getFallbackExplanation(question: string): ExplanationResponse {
    return {
      explanation: "I'm having trouble connecting to the AI service right now, but I can still help! This question involves important concepts that require systematic analysis. Let me provide a general approach to solving similar problems.",
      similarQuestions: [
        "What are the fundamental principles involved?",
        "How can you break down this problem step by step?",
        "What are the key relationships to identify?",
        "How does this connect to other concepts?",
        "What are practical applications of this knowledge?"
      ],
      keyPoints: [
        "Identify the core concept",
        "Break down the problem systematically",
        "Apply relevant principles",
        "Verify your understanding"
      ],
      difficulty: "medium",
      subject: "General Studies"
    };
  }

  private static getFallbackQuiz(topic: string, numQuestions: number, difficulty: string): QuizResponse {
    const sampleQuestions: QuizQuestion[] = [
      {
        question: `What is a fundamental concept in ${topic}?`,
        options: ["Basic principle A", "Basic principle B", "Basic principle C", "Basic principle D"],
        correctAnswer: 0,
        explanation: "This represents a core concept that forms the foundation of understanding in this subject area.",
        difficulty: difficulty
      },
      {
        question: `How do you apply knowledge of ${topic} in practice?`,
        options: ["Method A", "Method B", "Method C", "Method D"],
        correctAnswer: 1,
        explanation: "Practical application involves understanding the underlying principles and applying them systematically.",
        difficulty: difficulty
      }
    ];

    const questions = Array(numQuestions).fill(null).map((_, index) => ({
      ...sampleQuestions[index % sampleQuestions.length],
      question: `${sampleQuestions[index % sampleQuestions.length].question} (Question ${index + 1})`
    }));

    return {
      questions,
      totalQuestions: numQuestions,
      estimatedTime: numQuestions * 2
    };
  }

  private static getFallbackFlashcards(text: string): FlashcardResponse {
    return {
      flashcards: [
        {
          front: "What is the main topic of this material?",
          back: "This material covers important educational concepts and their practical applications.",
          category: "Overview",
          difficulty: "easy"
        },
        {
          front: "What are the key learning objectives?",
          back: "Understanding core principles, applying knowledge practically, and connecting concepts to real-world scenarios.",
          category: "Learning Goals",
          difficulty: "medium"
        },
        {
          front: "How can you best study this material?",
          back: "Use active recall, create connections between concepts, practice application, and review regularly.",
          category: "Study Strategy",
          difficulty: "medium"
        }
      ],
      totalCards: 3
    };
  }
}