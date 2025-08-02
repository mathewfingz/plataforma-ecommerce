/**
 * Mock API Service for Development
 * Simulates backend responses when no real backend is available
 */

import { ApiResponse, User, AuthResponse, LoginRequest, RegisterRequest } from './api';

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Demo Tienda',
    email: 'tienda@example.com',
    role: 'tienda',
    shopifyConnected: true,
    permissions: ['read', 'write'],
    tier: 'oro',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    shopifyConnected: false,
    permissions: ['read', 'write', 'admin'],
    tier: 'platino',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Demo Cliente',
    email: 'demo@example.com',
    role: 'tienda',
    shopifyConnected: false,
    permissions: ['read'],
    tier: 'bronce',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiService {
  private token: string | null = null;

  constructor() {
    this.loadToken();
  }

  private loadToken(): void {
    this.token = localStorage.getItem('saas-token');
  }

  private saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('saas-token', token);
  }

  private removeToken(): void {
    this.token = null;
    localStorage.removeItem('saas-token');
  }

  private generateMockToken(): string {
    return `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    await delay();

    // Demo credentials
    if (credentials.email === 'tienda@example.com' && credentials.password === 'demo123') {
      const user = mockUsers[0];
      const token = this.generateMockToken();
      this.saveToken(token);

      return {
        success: true,
        data: {
          user,
          accessToken: token,
          refreshToken: `refresh-${token}`,
          expiresIn: 3600
        },
        message: 'Login successful'
      };
    }

    if (credentials.email === 'admin@example.com' && credentials.password === 'admin123') {
      const user = mockUsers[1];
      const token = this.generateMockToken();
      this.saveToken(token);

      return {
        success: true,
        data: {
          user,
          accessToken: token,
          refreshToken: `refresh-${token}`,
          expiresIn: 3600
        },
        message: 'Login successful'
      };
    }

    if (credentials.email === 'demo@example.com' && credentials.password === 'demo123') {
      const user = mockUsers[2];
      const token = this.generateMockToken();
      this.saveToken(token);

      return {
        success: true,
        data: {
          user,
          accessToken: token,
          refreshToken: `refresh-${token}`,
          expiresIn: 3600
        },
        message: 'Login successful'
      };
    }

    throw new Error('Invalid credentials');
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    await delay();

    // Check if email already exists
    if (mockUsers.some(user => user.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser: User = {
      id: `${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: 'tienda',
      shopifyConnected: false,
      permissions: ['read', 'write'],
      tier: 'bronce',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    const token = this.generateMockToken();
    this.saveToken(token);

    return {
      success: true,
      data: {
        user: newUser,
        accessToken: token,
        refreshToken: `refresh-${token}`,
        expiresIn: 3600
      },
      message: 'Registration successful'
    };
  }

  async loginWithGoogle(googleData: any): Promise<ApiResponse<AuthResponse>> {
    await delay();

    // Extract user info from Google data
    const { email, name, picture } = googleData;

    // Check if user exists or create new one
    let user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      user = {
        id: `google-${Date.now()}`,
        name: name || 'Google User',
        email,
        role: 'tienda',
        shopifyConnected: false,
        permissions: ['read', 'write'],
        tier: 'bronce',
        avatar: picture,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockUsers.push(user);
    }

    const token = this.generateMockToken();
    this.saveToken(token);

    return {
      success: true,
      data: {
        user,
        accessToken: token,
        refreshToken: `refresh-${token}`,
        expiresIn: 3600
      },
      message: 'Google login successful'
    };
  }

  async logout(): Promise<ApiResponse<void>> {
    await delay(200);
    this.removeToken();
    
    return {
      success: true,
      message: 'Logout successful'
    };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(300);

    if (!this.token) {
      throw new Error('No authentication token');
    }

    // Return first user as current user for demo
    return {
      success: true,
      data: mockUsers[0],
      message: 'User retrieved successfully'
    };
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string; expiresIn: number }>> {
    await delay(200);

    if (!this.token) {
      throw new Error('No refresh token');
    }

    const newToken = this.generateMockToken();
    this.saveToken(newToken);

    return {
      success: true,
      data: {
        accessToken: newToken,
        expiresIn: 3600
      },
      message: 'Token refreshed successfully'
    };
  }

  // Check if we're in development mode
  static isDevelopmentMode(): boolean {
    // Only use mock API in true local development
    return (import.meta as any).env?.DEV === true && 
           window.location.hostname === 'localhost';
  }
}

// Export singleton instance
export const mockApiService = new MockApiService();