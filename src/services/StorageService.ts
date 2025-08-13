interface UserData {
  explanations: any[];
  quizzes: any[];
  flashcards: any[];
  notes: any[];
}

export class StorageService {
  private static readonly STORAGE_KEY = 'mindmotion_user_data';

  static async getUserData(userId: string): Promise<UserData> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const allData = this.getAllStoredData();
    return allData[userId] || {
      explanations: [],
      quizzes: [],
      flashcards: [],
      notes: []
    };
  }

  static async saveUserData(userId: string, type: keyof UserData, data: any): Promise<void> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const allData = this.getAllStoredData();
    
    if (!allData[userId]) {
      allData[userId] = {
        explanations: [],
        quizzes: [],
        flashcards: [],
        notes: []
      };
    }

    // Add timestamp and ID to the data
    const dataWithMeta = {
      ...data,
      id: `${type}-${Date.now()}`,
      createdAt: new Date().toISOString(),
      type
    };

    allData[userId][type].push(dataWithMeta);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allData));
  }

  static async deleteUserData(userId: string, type: keyof UserData, itemId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const allData = this.getAllStoredData();
    
    if (allData[userId] && allData[userId][type]) {
      allData[userId][type] = allData[userId][type].filter((item: any) => item.id !== itemId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allData));
    }
  }

  static async updateUserData(userId: string, type: keyof UserData, itemId: string, updates: any): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const allData = this.getAllStoredData();
    
    if (allData[userId] && allData[userId][type]) {
      const itemIndex = allData[userId][type].findIndex((item: any) => item.id === itemId);
      if (itemIndex !== -1) {
        allData[userId][type][itemIndex] = {
          ...allData[userId][type][itemIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allData));
      }
    }
  }

  private static getAllStoredData(): any {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse stored data:', error);
      return {};
    }
  }

  // Initialize demo data for demo user
  static initializeDemoData(): void {
    const demoData = {
      'demo-user-1': {
        explanations: [
          {
            id: 'exp-1',
            question: "What is Newton's Second Law of Motion?",
            explanation: "Newton's Second Law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. The mathematical formula is F = ma.",
            createdAt: '2025-01-14T10:30:00Z',
            type: 'explanation'
          }
        ],
        quizzes: [
          {
            id: 'quiz-1',
            topic: 'Physics - Mechanics',
            questions: 5,
            score: 4,
            percentage: 80,
            createdAt: '2025-01-13T15:45:00Z',
            type: 'quiz'
          }
        ],
        flashcards: [
          {
            id: 'flash-1',
            title: 'Biology - Photosynthesis',
            cardCount: 12,
            createdAt: '2025-01-12T09:20:00Z',
            type: 'flashcards'
          }
        ],
        notes: [
          {
            id: 'note-1',
            title: 'Chemistry Study Notes',
            content: 'Personal notes on periodic trends and chemical bonding...',
            tags: ['chemistry', 'periodic table'],
            createdAt: '2025-01-11T14:15:00Z',
            type: 'notes'
          }
        ]
      }
    };

    const existing = localStorage.getItem(this.STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(demoData));
    }
  }
}

// Initialize demo data on module load
StorageService.initializeDemoData();