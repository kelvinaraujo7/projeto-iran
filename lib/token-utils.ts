export interface TokenPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

export class TokenUtils {
  
  // Decodes a JWT token without verifying the signature
  static decode(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }

  // Checks if the token is expired
  static isExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }

  // Checks if the token is valid (not expired and well-formed)
  static isValid(token: string): boolean {
    if (!token) return false;
    
    const payload = this.decode(token);
    if (!payload) return false;
    
    return !this.isExpired(token);
  }

  // Gets the localStorage token
  static getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  // Removes token from localStorage 
  static removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  // Checks if the current token is valid
  static isCurrentTokenValid(): boolean {
    const token = this.getToken();
    return token ? this.isValid(token) : false;
  }

 // Gets information about the current token
  static getCurrentTokenInfo(): { isValid: boolean; payload: TokenPayload | null; timeToExpiry?: number } {
    const token = this.getToken();
    
    if (!token) {
      return { isValid: false, payload: null };
    }

    const payload = this.decode(token);
    const isValid = this.isValid(token);
    
    let timeToExpiry: number | undefined;
    if (payload?.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      timeToExpiry = payload.exp - currentTime;
    }

    return {
      isValid,
      payload,
      timeToExpiry
    };
  }
}
