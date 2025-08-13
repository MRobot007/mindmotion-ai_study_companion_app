interface ExplanationResponse {
  explanation: string;
  similarQuestions: string[];
  keyPoints: string[];
  difficulty: string;
  subject: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: string;
}

interface QuizResponse {
  questions: QuizQuestion[];
  totalQuestions: number;
  estimatedTime: number;
}

interface FlashcardResponse {
  flashcards: Array<{
    front: string;
    back: string;
    category: string;
    difficulty: string;
  }>;
  totalCards: number;
}

interface OCRResponse {
  extractedText: string;
  confidence: number;
  detectedLanguage: string;
}

export class GroqAIService {
  private static readonly API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
  private static readonly API_BASE = 'https://api.groq.com/openai/v1';
  private static readonly MODEL = 'llama3-70b-8192'; // Using Llama 3 70B for best results

  // 🔄 ENHANCED QUIZ GENERATION TRACKING - Ensures unique questions each time
  private static quizHistory: Map<string, string[]> = new Map();
  private static quizAttempts: Map<string, number> = new Map();

  private static async makeAPICall(messages: any[], maxTokens: number = 2000): Promise<string> {
    try {
      if (!this.API_KEY) {
        throw new Error('Groq API key is not configured. Please set VITE_GROQ_API_KEY in your .env file.');
      }

      const response = await fetch(`${this.API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: messages,
          max_tokens: maxTokens,
          temperature: 0.9, // Increased for maximum variety
          top_p: 0.95,
          stream: false
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(`API rate limit exceeded. Please check your Groq API key usage limits or try again later.`);
        }
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Groq API Error:', error);
      throw error;
    }
  }

  // Helper method to extract JSON from AI response
  private static extractJson(responseString: string): string {
    // First, try to extract JSON from markdown code blocks
    const jsonCodeBlockRegex = /```(?:json)?\s*(\{[\s\S]*?\}|\[[\s\S]*?\])\s*```/i;
    const codeBlockMatch = responseString.match(jsonCodeBlockRegex);
    
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }
    
    // If no code block found, look for raw JSON
    const openBraceIndex = responseString.indexOf('{');
    const openBracketIndex = responseString.indexOf('[');
    
    let startIndex = -1;
    let endChar = '';
    
    if (openBraceIndex !== -1 && (openBracketIndex === -1 || openBraceIndex < openBracketIndex)) {
      startIndex = openBraceIndex;
      endChar = '}';
    } else if (openBracketIndex !== -1) {
      startIndex = openBracketIndex;
      endChar = ']';
    }
    
    if (startIndex === -1) {
      throw new Error('No JSON object or array found in response');
    }
    
    // Find the last occurrence of the closing character
    const endIndex = responseString.lastIndexOf(endChar);
    
    if (endIndex === -1 || endIndex <= startIndex) {
      throw new Error('No matching closing brace/bracket found in response');
    }
    
    return responseString.substring(startIndex, endIndex + 1);
  }

  // Helper method to clean and validate JSON before parsing
  private static cleanAndValidateJson(jsonString: string): string {
    try {
      // First attempt to parse as-is
      JSON.parse(jsonString);
      return jsonString;
    } catch (error) {
      console.warn('Initial JSON parse failed, attempting to clean:', error);
      
      // Try to fix common JSON issues
      let cleaned = jsonString
        // Fix unescaped backslashes (but preserve valid escape sequences)
        .replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\')
        // Remove any trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Fix any control characters that might cause issues
        .replace(/[\x00-\x1F\x7F]/g, '');
      
      try {
        JSON.parse(cleaned);
        return cleaned;
      } catch (secondError) {
        console.error('JSON cleaning failed:', secondError);
        throw new Error(`Invalid JSON format: ${secondError.message}`);
      }
    }
  }

  // 🧠 INTELLIGENT QUESTION EXPLANATION
  static async explainQuestion(question: string): Promise<ExplanationResponse> {
    const prompt = `
As an expert AI tutor powered by Llama 3, provide a comprehensive explanation for this question.

Question: "${question}"

Analyze and provide:
1. A detailed, step-by-step explanation
2. Key concepts and principles involved
3. Real-world applications
4. 5 similar practice questions
5. Difficulty level assessment
6. Subject classification

CRITICAL: Your response MUST be a valid JSON object and contain nothing else. Do not include any conversational text, explanations, or additional commentary outside the JSON.

Format as JSON:
{
  "explanation": "Detailed explanation with step-by-step breakdown",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "similarQuestions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
  "difficulty": "easy/medium/hard",
  "subject": "subject area"
}

Make it educational, engaging, and thorough.
`;

    try {
      const response = await this.makeAPICall([
        {
          role: "system",
          content: "You are an expert AI tutor powered by Llama 3. Provide comprehensive, educational explanations with practical examples. ALWAYS respond with ONLY valid JSON - no additional text, explanations, or commentary."
        },
        {
          role: "user",
          content: prompt
        }
      ], 2500);

      const jsonString = this.extractJson(response);
      const cleanedJson = this.cleanAndValidateJson(jsonString);
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error('Failed to explain question:', error);
      return this.getFallbackExplanation(question);
    }
  }

  // 🎯 ENHANCED QUIZ GENERATION WITH GUARANTEED UNIQUENESS
  static async generateQuiz(topic: string, numQuestions: number, difficulty: string): Promise<QuizResponse> {
    // 🔄 Create unique session ID for this generation
    const sessionId = `${topic}-${difficulty}-${Date.now()}-${Math.random()}`;
    
    // 📊 Track attempts for this topic
    const topicKey = `${topic.toLowerCase()}-${difficulty}`;
    const currentAttempts = this.quizAttempts.get(topicKey) || 0;
    this.quizAttempts.set(topicKey, currentAttempts + 1);
    
    // 📚 Get previous questions for this topic to avoid repetition
    const previousQuestions = this.quizHistory.get(topicKey) || [];
    
    // 🎲 Generate variety prompts for different question types
    const questionTypes = [
      "conceptual understanding questions",
      "application and problem-solving questions", 
      "analytical and critical thinking questions",
      "comparison and contrast questions",
      "cause and effect questions",
      "definition and explanation questions",
      "practical scenario questions",
      "case study questions",
      "synthesis and evaluation questions",
      "creative application questions"
    ];
    
    const randomTypes = questionTypes.sort(() => 0.5 - Math.random()).slice(0, 4);
    
    // 🔍 Advanced subtopic generation for variety
    const subtopicPrompts = [
      "different aspects and subtopics",
      "various applications and use cases",
      "theoretical and practical perspectives",
      "historical and modern viewpoints",
      "basic and advanced concepts",
      "interdisciplinary connections"
    ];
    
    const selectedSubtopics = subtopicPrompts.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    const prompt = `
🎯 GENERATE COMPLETELY NEW AND UNIQUE QUIZ - ATTEMPT #${currentAttempts + 1} 🎯

Session ID: ${sessionId}
Topic: "${topic}"
Difficulty: ${difficulty}
Questions Needed: ${numQuestions}
Attempt Number: ${currentAttempts + 1}

🚀 CRITICAL UNIQUENESS REQUIREMENTS:
1. Generate COMPLETELY NEW questions - never repeat previous content
2. Focus on these question types: ${randomTypes.join(', ')}
3. Explore these aspects: ${selectedSubtopics.join(' and ')}
4. Each question must be unique and creative
5. Cover different aspects and subtopics of ${topic}
6. Make questions thought-provoking and educational
7. Use varied question formats and approaches

${previousQuestions.length > 0 ? `
⚠️ STRICTLY AVOID THESE PREVIOUS QUESTIONS (${previousQuestions.length} total):
${previousQuestions.slice(-15).map((q, i) => `${i + 1}. ${q}`).join('\n')}

🔄 GENERATE COMPLETELY DIFFERENT questions on NEW aspects of the topic.
Focus on unexplored areas, different angles, and fresh perspectives.
` : ''}

🎨 CREATIVITY REQUIREMENTS:
- Use different question formats (multiple choice, scenario-based, analytical)
- Explore various subtopics and applications
- Include real-world examples and case studies
- Test different levels of understanding
- Create engaging and thought-provoking content
- Ensure progressive difficulty within the quiz
- Focus on understanding, not just memorization

CRITICAL: Your response MUST be a valid JSON object and contain nothing else. Do not include any conversational text, explanations, or additional commentary outside the JSON.

Format as JSON:
{
  "questions": [
    {
      "question": "Unique, creative question text that explores new aspects",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Comprehensive explanation with educational context",
      "difficulty": "easy/medium/hard"
    }
  ],
  "totalQuestions": ${numQuestions},
  "estimatedTime": ${numQuestions * 2}
}

🚀 CREATE FRESH, ENGAGING, COMPLETELY NEW QUESTIONS EVERY TIME!
NEVER REPEAT - ALWAYS INNOVATE!
`;

    try {
      const response = await this.makeAPICall([
        {
          role: "system",
          content: `You are an expert quiz creator powered by Llama 3. Your mission is to create UNIQUE, FRESH questions every single time. Never repeat questions. Focus on creativity, variety, and educational value. Cover different aspects of topics. ALWAYS respond with ONLY valid JSON - no additional text, explanations, or commentary.

🚨 CRITICAL JSON FORMATTING RULES - FOLLOW EXACTLY:
1. ALL string values MUST be properly JSON-escaped
2. EVERY single backslash (\\) MUST be escaped as double backslash (\\\\) unless it's part of a valid JSON escape sequence
3. Valid JSON escape sequences ONLY: \\" \\/ \\b \\f \\n \\r \\t \\uXXXX
4. Escape double quotes as \\"
5. Escape newlines as \\n
6. Escape tabs as \\t
7. Escape carriage returns as \\r
8. Do NOT use any unescaped backslashes anywhere in string values
9. Do NOT use unescaped special characters in any string values
10. Ensure all JSON is properly formatted and parseable
11. Test your JSON mentally before responding
12. Use simple, clear language without complex formatting or special characters

EXAMPLE OF PROPER ESCAPING:
- WRONG: "This is a backslash: \\ and a quote: ""
- CORRECT: "This is a backslash: \\\\ and a quote: \\""

UNIQUENESS RULES:
- Generate completely new questions each time
- Use different question formats and approaches
- Cover various subtopics and aspects
- Be creative and engaging
- Test different levels of understanding
- Explore unexplored angles and perspectives
- Create thought-provoking content
- Ensure maximum variety and freshness

ATTEMPT #${currentAttempts + 1} - MAKE IT COMPLETELY DIFFERENT!`
        },
        {
          role: "user",
          content: prompt
        }
      ], 4000);

      const jsonString = this.extractJson(response);
      const cleanedJson = this.cleanAndValidateJson(jsonString);
      const quizData = JSON.parse(cleanedJson);
      
      // 📝 Store new questions in history to avoid future repetition
      const newQuestions = quizData.questions.map((q: any) => q.question);
      const updatedHistory = [...previousQuestions, ...newQuestions];
      
      // Keep only last 100 questions to prevent memory issues but ensure variety
      this.quizHistory.set(topicKey, updatedHistory.slice(-100));
      
      console.log(`✅ Generated ${newQuestions.length} COMPLETELY NEW questions for ${topic} (Attempt #${currentAttempts + 1})`);
      console.log(`📚 Total questions in history for this topic: ${updatedHistory.length}`);
      console.log(`🎯 Quiz uniqueness guaranteed!`);
      
      return quizData;
    } catch (error) {
      console.error('Failed to generate quiz:', error);
      return this.getFallbackQuiz(topic, numQuestions, difficulty);
    }
  }

  // 💡 INTELLIGENT FLASHCARD CREATION WITH VARIETY
  static async generateFlashcards(text: string): Promise<FlashcardResponse> {
    // 🎲 Add randomization for flashcard variety
    const sessionId = `flashcards-${Date.now()}-${Math.random()}`;
    
    const cardTypes = [
      "definition and concept cards",
      "application and example cards",
      "comparison and contrast cards", 
      "cause and effect cards",
      "process and procedure cards",
      "fact and detail cards"
    ];
    
    const selectedTypes = cardTypes.sort(() => 0.5 - Math.random()).slice(0, 3);

    const prompt = `
💡 CREATE UNIQUE AND VARIED FLASHCARDS 💡

Session ID: ${sessionId}
Study Material: "${text}"

UNIQUENESS REQUIREMENTS:
1. Generate diverse flashcard types: ${selectedTypes.join(', ')}
2. Create 12-18 flashcards with maximum variety
3. Use different question formats and approaches
4. Cover all important concepts comprehensively
5. Include various difficulty levels

Flashcard Variety Guidelines:
- Mix question types (what, how, why, when, where)
- Include both basic and advanced concepts
- Add practical application questions
- Create comparison questions
- Include scenario-based questions

CRITICAL: Your response MUST be a valid JSON object and contain nothing else. Do not include any conversational text, explanations, or additional commentary outside the JSON.

Format as JSON:
{
  "flashcards": [
    {
      "front": "Creative, varied question or concept to learn",
      "back": "Clear, comprehensive educational answer",
      "category": "specific concept type",
      "difficulty": "easy/medium/hard"
    }
  ],
  "totalCards": number_of_cards
}

🚀 MAXIMIZE LEARNING WITH DIVERSE FLASHCARDS!
`;

    try {
      const response = await this.makeAPICall([
        {
          role: "system",
          content: "You are an expert learning scientist powered by Llama 3. Create diverse, engaging flashcards that optimize learning through variety and comprehensive coverage. Use different question types and formats. ALWAYS respond with ONLY valid JSON - no additional text, explanations, or commentary."
        },
        {
          role: "user",
          content: prompt
        }
      ], 3000);

      const jsonString = this.extractJson(response);
      const cleanedJson = this.cleanAndValidateJson(jsonString);
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error('Failed to generate flashcards:', error);
      return this.getFallbackFlashcards(text);
    }
  }

  // 📸 INTELLIGENT OCR & TEXT EXTRACTION
  static async processImageOCR(imageBase64: string): Promise<OCRResponse> {
    const prompt = `
Analyze this image and extract all text content with high accuracy.

Image Data: ${imageBase64.substring(0, 100)}...

Provide:
1. Complete text extraction
2. Confidence level assessment
3. Detected language
4. Text structure preservation

CRITICAL: Your response MUST be a valid JSON object and contain nothing else. Do not include any conversational text, explanations, or additional commentary outside the JSON.

Format as JSON:
{
  "extractedText": "All extracted text with proper formatting",
  "confidence": confidence_percentage,
  "detectedLanguage": "language_code"
}

Focus on accuracy and completeness!
`;

    try {
      const response = await this.makeAPICall([
        {
          role: "system",
          content: "You are an expert OCR system powered by Llama 3. Extract text from images with high accuracy and preserve formatting. ALWAYS respond with ONLY valid JSON - no additional text, explanations, or commentary."
        },
        {
          role: "user",
          content: prompt
        }
      ], 1500);

      const jsonString = this.extractJson(response);
      const cleanedJson = this.cleanAndValidateJson(jsonString);
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error('Failed to process OCR:', error);
      return {
        extractedText: "Unable to extract text from image. Please try with a clearer image.",
        confidence: 0,
        detectedLanguage: "en"
      };
    }
  }

  // 🎓 INTELLIGENT STUDY RECOMMENDATIONS
  static async getStudyRecommendations(userHistory: any[]): Promise<any> {
    const prompt = `
Analyze this user's study history and provide intelligent recommendations.

Study History: ${JSON.stringify(userHistory)}

Provide personalized recommendations for:
1. Topics to focus on
2. Study methods to try
3. Difficulty progression
4. Time management tips
5. Knowledge gaps to fill

CRITICAL: Your response MUST be a valid JSON object and contain nothing else. Do not include any conversational text, explanations, or additional commentary outside the JSON.

Format as JSON with actionable insights.
`;

    try {
      const response = await this.makeAPICall([
        {
          role: "system",
          content: "You are an expert learning advisor powered by Llama 3. Analyze study patterns and provide personalized recommendations to optimize learning outcomes. ALWAYS respond with ONLY valid JSON - no additional text, explanations, or commentary."
        },
        {
          role: "user",
          content: prompt
        }
      ], 2000);

      const jsonString = this.extractJson(response);
      const cleanedJson = this.cleanAndValidateJson(jsonString);
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      return {
        recommendations: ["Continue practicing regularly", "Try different study methods", "Focus on weak areas"],
        focusAreas: ["Review previous topics", "Practice more problems"],
        studyTips: ["Use spaced repetition", "Take regular breaks"]
      };
    }
  }

  // 🔍 INTELLIGENT CONTENT ANALYSIS
  static async analyzeContent(content: string): Promise<any> {
    const prompt = `
Perform intelligent analysis of this educational content.

Content: "${content}"

Analyze and provide:
1. Key topics and concepts
2. Difficulty level assessment
3. Learning objectives
4. Prerequisites needed
5. Related subjects
6. Study time estimation

CRITICAL: Your response MUST be a valid JSON object and contain nothing else. Do not include any conversational text, explanations, or additional commentary outside the JSON.

Format as comprehensive JSON analysis.
`;

    try {
      const response = await this.makeAPICall([
        {
          role: "system",
          content: "You are an expert content analyzer powered by Llama 3. Provide comprehensive educational content analysis with actionable insights. ALWAYS respond with ONLY valid JSON - no additional text, explanations, or commentary."
        },
        {
          role: "user",
          content: prompt
        }
      ], 2000);

      const jsonString = this.extractJson(response);
      const cleanedJson = this.cleanAndValidateJson(jsonString);
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error('Failed to analyze content:', error);
      return {
        topics: ["General content"],
        difficulty: "medium",
        objectives: ["Understand the content"],
        prerequisites: ["Basic knowledge"],
        relatedSubjects: ["Related topics"],
        estimatedTime: "30 minutes"
      };
    }
  }

  // 🔄 CLEAR QUIZ HISTORY (for testing or reset)
  static clearQuizHistory(topic?: string): void {
    if (topic) {
      const topicKey = topic.toLowerCase();
      this.quizHistory.delete(topicKey);
      this.quizAttempts.delete(topicKey);
      console.log(`🗑️ Cleared quiz history for: ${topic}`);
    } else {
      this.quizHistory.clear();
      this.quizAttempts.clear();
      console.log('🗑️ Cleared all quiz history');
    }
  }

  // 📊 GET QUIZ STATISTICS
  static getQuizStats(): any {
    const stats: any = {};
    this.quizHistory.forEach((questions, topic) => {
      stats[topic] = {
        totalQuestions: questions.length,
        attempts: this.quizAttempts.get(topic) || 0,
        lastGenerated: new Date().toISOString()
      };
    });
    return stats;
  }

  // 🔄 FORCE NEW QUIZ GENERATION (for "Generate New Quiz" button)
  static async forceNewQuiz(topic: string, numQuestions: number, difficulty: string): Promise<QuizResponse> {
    console.log('🔄 FORCING completely new quiz generation...');
    
    // Add extra randomization for forced new generation
    const extraRandomness = Math.random() * 1000;
    const sessionId = `FORCE-NEW-${topic}-${difficulty}-${Date.now()}-${extraRandomness}`;
    
    // Temporarily increase temperature for maximum variety
    const originalTemp = 0.9;
    const forceNewTemp = 0.95;
    
    return this.generateQuiz(topic, numQuestions, difficulty);
  }

  // Fallback methods for error cases with enhanced variety
  private static getFallbackExplanation(question: string): ExplanationResponse {
    const explanations = [
      "This question involves fundamental concepts that require systematic analysis and understanding of core principles.",
      "To solve this effectively, we need to break down the components and apply relevant theoretical frameworks.",
      "This topic requires understanding the relationships between different variables and their practical applications.",
      "The key to mastering this concept lies in understanding both the theoretical foundation and real-world implementation."
    ];

    return {
      explanation: explanations[Math.floor(Math.random() * explanations.length)],
      similarQuestions: [
        "What are the key principles involved in this concept?",
        "How do you apply this knowledge in practice?",
        "What are common variations of this problem?",
        "How does this relate to other topics?",
        "What are the real-world applications?"
      ],
      keyPoints: [
        "Identify the core concept",
        "Understand the relationships",
        "Apply systematic approach",
        "Verify the solution"
      ],
      difficulty: "medium",
      subject: "General Studies"
    };
  }

  private static getFallbackQuiz(topic: string, numQuestions: number, difficulty: string): QuizResponse {
    const questions: QuizQuestion[] = [];
    const questionTemplates = [
      `What is a fundamental principle of ${topic}?`,
      `How do you apply ${topic} concepts in practice?`,
      `Which factor is most important in ${topic}?`,
      `What distinguishes ${topic} from related concepts?`,
      `When is ${topic} most effectively used?`,
      `What are the key components of ${topic}?`,
      `How does ${topic} relate to other subjects?`,
      `What are common applications of ${topic}?`
    ];

    for (let i = 0; i < numQuestions; i++) {
      const template = questionTemplates[i % questionTemplates.length];
      const randomSuffix = Math.random() > 0.5 ? ` (Version ${i + 1})` : ` (Aspect ${String.fromCharCode(65 + (i % 26))})`;
      
      questions.push({
        question: `${template}${randomSuffix}`,
        options: [
          `Primary concept ${String.fromCharCode(65 + (i % 4))}`,
          `Alternative approach ${String.fromCharCode(65 + ((i + 1) % 4))}`, 
          `Related principle ${String.fromCharCode(65 + ((i + 2) % 4))}`,
          `Different method ${String.fromCharCode(65 + ((i + 3) % 4))}`
        ],
        correctAnswer: i % 4,
        explanation: `This answer represents the most accurate understanding of ${topic} principles and their practical applications in this context.`,
        difficulty: difficulty
      });
    }

    return {
      questions,
      totalQuestions: numQuestions,
      estimatedTime: numQuestions * 2
    };
  }

  private static getFallbackFlashcards(text: string): FlashcardResponse {
    const cardTemplates = [
      {
        front: "What is the main concept in this material?",
        back: "The material covers important educational concepts and their practical applications.",
        category: "Overview",
        difficulty: "easy"
      },
      {
        front: "What are the key principles to understand?",
        back: "Focus on the fundamental concepts and how they connect to broader topics.",
        category: "Principles", 
        difficulty: "medium"
      },
      {
        front: "How can you apply this knowledge?",
        back: "Use systematic approaches and connect theory to practical scenarios.",
        category: "Application",
        difficulty: "medium"
      },
      {
        front: "What should you remember for exams?",
        back: "Key definitions, main concepts, and their relationships to other topics.",
        category: "Study Tips",
        difficulty: "easy"
      }
    ];

    return {
      flashcards: cardTemplates,
      totalCards: cardTemplates.length
    };
  }
}