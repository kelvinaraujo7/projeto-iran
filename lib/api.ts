const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: this.getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`)
    }
    
    return response.json()
  }

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`)
    }
    
    return response.json()
  }

  // Métodos PUT, DELETE, etc...
}

export const api = new ApiService()