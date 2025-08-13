interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    joinedDate: string;
  };
  token: string;
}

interface SignupResponse {
  user: {
    id: string;
    name: string;
    email: string;
    joinedDate: string;
  };
  token: string;
}

export class AuthService {
  private static readonly API_BASE = '/api/auth';
  private static readonly USERS_STORAGE_KEY = 'mindmotion_users';
  
  // Initialize with default demo user
  private static getUsers(): Map<string, any> {
    try {
      const stored = localStorage.getItem(this.USERS_STORAGE_KEY);
      if (stored) {
        const usersObj = JSON.parse(stored);
        return new Map(Object.entries(usersObj));
      }
    } catch (error) {
      console.error('Failed to load users from localStorage:', error);
    }

    // Return default users if nothing in storage or error occurred
    const defaultUsers = new Map([
      ['demo@mindmotion.com', {
        id: 'demo-user-1',
        name: 'Demo User',
        email: 'demo@mindmotion.com',
        password: 'demo123',
        joinedDate: '2025-01-01'
      }],
      ['student@example.com', {
        id: 'user-2',
        name: 'Sarah Chen',
        email: 'student@example.com',
        password: 'password123',
        joinedDate: '2025-01-10'
      }]
    ]);

    // Save default users to localStorage
    this.saveUsers(defaultUsers);
    return defaultUsers;
  }

  private static saveUsers(users: Map<string, any>): void {
    try {
      const usersObj = Object.fromEntries(users);
      localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(usersObj));
    } catch (error) {
      console.error('Failed to save users to localStorage:', error);
    }
  }

  static async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = this.getUsers();
    const user = users.get(email);
    
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        joinedDate: user.joinedDate
      },
      token
    };
  }

  static async signup(name: string, email: string, password: string): Promise<SignupResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const users = this.getUsers();
    
    if (users.has(email)) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    // Add user to the map and save to localStorage
    users.set(email, newUser);
    this.saveUsers(users);

    const token = this.generateToken(newUser.id);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        joinedDate: newUser.joinedDate
      },
      token
    };
  }

  static async validateToken(token: string): Promise<any> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if token exists and is a string
    if (!token || typeof token !== 'string') {
      throw new Error('Malformed token: Token is missing or invalid');
    }

    // Check token structure (should have 3 parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Malformed token: Incorrect number of parts');
    }

    let payload;
    try {
      // Try to decode the base64 payload
      const decodedPayload = atob(tokenParts[1]);
      
      try {
        // Try to parse the JSON payload
        payload = JSON.parse(decodedPayload);
      } catch (jsonError) {
        throw new Error('Malformed token: Invalid JSON payload');
      }
    } catch (base64Error) {
      throw new Error('Malformed token: Invalid base64 payload');
    }

    // Check if payload has required fields
    if (!payload.userId || !payload.exp) {
      throw new Error('Malformed token: Missing required fields');
    }

    const userId = payload.userId;
    
    // Check if token is expired (24 hours)
    if (Date.now() > payload.exp) {
      throw new Error('Token expired');
    }

    // Find user by ID in stored users
    const users = this.getUsers();
    for (const user of users.values()) {
      if (user.id === userId) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          joinedDate: user.joinedDate
        };
      }
    }
    
    throw new Error('User not found');
  }

  private static generateToken(userId: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      userId,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
    const signature = btoa('mock-signature');
    
    return `${header}.${payload}.${signature}`;
  }
}