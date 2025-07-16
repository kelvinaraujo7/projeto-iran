import { TokenUtils } from './token-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

export class ApiService {
  private getAuthHeaders() {
    const token = TokenUtils.getToken();
    const tokenInfo = TokenUtils.getCurrentTokenInfo();
    
    // Log for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('Token Info:', {
        hasToken: !!token,
        isValid: tokenInfo.isValid,
        timeToExpiry: tokenInfo.timeToExpiry,
        payload: tokenInfo.payload ? { 
          sub: tokenInfo.payload.sub, 
          exp: tokenInfo.payload.exp,
          iat: tokenInfo.payload.iat 
        } : null
      });
    }
    
    // If the token is expired, redirect immediately
    if (token && !tokenInfo.isValid) {
      console.warn('Token expirado detectado, redirecionando para login');
      TokenUtils.removeToken();
      
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        const returnUrl = encodeURIComponent(currentPath + window.location.search);
        window.location.href = `/auth?returnUrl=${returnUrl}`;
      }
      
      return {
        'Content-Type': 'application/json'
      };
    }
    
    return {
      'Content-Type': 'application/json',
      ...(token && tokenInfo.isValid && { Authorization: `Bearer ${token}` })
    };
  }

  private async handleResponse(response: Response) {
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        errorData = { message: `HTTP Error ${response.status}: ${response.statusText}` };
      }
      
      const error: ApiError = {
        message: errorData.message || `Erro HTTP: ${response.status}`,
        status: response.status,
        data: errorData
      };
      
      // More detailed log for debugging
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorData,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Check if it is an expired token error
      if (response.status === 401) {
        console.warn('Token possivelmente expirado ou inválido (Status 401)');
        TokenUtils.removeToken();
        
        // Redirect to login when token expired
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          const returnUrl = encodeURIComponent(currentPath + window.location.search);
          window.location.href = `/auth?returnUrl=${returnUrl}`;
        }
      }
      
      // Check if it is a server error
      if (response.status >= 500) {
        console.error('Erro do servidor (5xx):', response.status);
      }
      
      // Check if it is a connectivity error
      if (response.status === 0 || !response.ok) {
        console.error('Possível erro de conectividade ou CORS');
      }
      
      throw error;
    }
    
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const jsonData = await response.json();

      return jsonData;
    }
    
    return null;
  }

  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async post(endpoint: string, data?: unknown) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    
    return this.handleResponse(response);
  }

  async put(endpoint: string, data?: unknown) {
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
       
    return this.handleResponse(response);
  }

  async delete(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    return this.handleResponse(response);
  }

  async patch(endpoint: string, data?: unknown) {
   
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    
    return this.handleResponse(response);
  }
}

export const api = new ApiService()