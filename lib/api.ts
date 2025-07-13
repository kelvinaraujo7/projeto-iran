const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

export class ApiService {
  private getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
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
      
      console.error('API Error:', error);
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