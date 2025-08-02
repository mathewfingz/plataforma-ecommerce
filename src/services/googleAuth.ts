// Google OAuth Configuration and Service
export interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string[];
}

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
}

export interface GoogleAuthResponse {
  access_token: string;
  id_token: string;
  user: GoogleUser;
}

class GoogleAuthService {
  private config: GoogleAuthConfig;
  private isInitialized = false;

  constructor() {
    this.config = {
      clientId: (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '',
      redirectUri: `${window.location.origin}/auth/google/callback`,
      scope: [
        'openid',
        'email',
        'profile'
      ]
    };
  }

  // Initialize Google OAuth
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.isInitialized = true;
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Google Identity Services'));
      };
      
      document.head.appendChild(script);
    });
  }

  // Sign in with Google using popup
  async signInWithPopup(): Promise<GoogleAuthResponse> {
    await this.initialize();

    if (!this.config.clientId) {
      throw new Error('Google Client ID not configured');
    }

    return new Promise((resolve, reject) => {
      // @ts-ignore - Google Identity Services global
      window.google.accounts.id.initialize({
        client_id: this.config.clientId,
        callback: (response: any) => {
          try {
            const credential = this.parseJWT(response.credential);
            const authResponse: GoogleAuthResponse = {
              access_token: response.credential,
              id_token: response.credential,
              user: {
                id: credential.sub,
                email: credential.email,
                name: credential.name,
                picture: credential.picture,
                given_name: credential.given_name,
                family_name: credential.family_name
              }
            };
            resolve(authResponse);
          } catch (error) {
            reject(error);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });

      // @ts-ignore - Google Identity Services global
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to renderButton if prompt fails
          this.renderSignInButton().then(resolve).catch(reject);
        }
      });
    });
  }

  // Render Google Sign-In button
  private async renderSignInButton(): Promise<GoogleAuthResponse> {
    return new Promise((resolve, reject) => {
      const buttonContainer = document.createElement('div');
      buttonContainer.id = 'google-signin-button';
      document.body.appendChild(buttonContainer);

      // @ts-ignore - Google Identity Services global
      window.google.accounts.id.renderButton(
        buttonContainer,
        {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left'
        }
      );

      // Clean up after use
      setTimeout(() => {
        if (buttonContainer.parentNode) {
          buttonContainer.parentNode.removeChild(buttonContainer);
        }
      }, 100);
    });
  }

  // Alternative method using OAuth 2.0 flow
  async signInWithRedirect(): Promise<void> {
    if (!this.config.clientId) {
      throw new Error('Google Client ID not configured');
    }

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope.join(' '),
      access_type: 'offline',
      prompt: 'consent'
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = authUrl;
  }

  // Handle OAuth callback
  async handleCallback(code: string): Promise<GoogleAuthResponse> {
    if (!code) {
      throw new Error('Authorization code not provided');
    }

    // In a real implementation, this would be handled by your backend
    // For demo purposes, we'll simulate the token exchange
    try {
      const response = await fetch('/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        throw new Error('Failed to exchange authorization code');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to complete Google authentication');
    }
  }

  // Parse JWT token
  private parseJWT(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error('Invalid JWT token');
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    if (this.isInitialized) {
      // @ts-ignore - Google Identity Services global
      if ((window as any).google?.accounts?.id) {
        (window as any).google.accounts.id.disableAutoSelect();
      }
    }
  }

  // Check if Google Auth is available
  isAvailable(): boolean {
    return !!this.config.clientId;
  }
}

export const googleAuthService = new GoogleAuthService();
export default googleAuthService;