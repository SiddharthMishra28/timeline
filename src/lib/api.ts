const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://lifestream-api.siddharthmishra28.workers.dev';

interface ApiOptions {
  method?: string;
  body?: any;
  token?: string;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('lifestream_token', token);
      } else {
        localStorage.removeItem('lifestream_token');
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('lifestream_token');
    }
    return this.token;
  }

  private async request<T>(path: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, token } = options;
    const authToken = token || this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || error.message || `HTTP ${res.status}`);
    }

    return res.json();
  }

  // Auth
  async register(data: { email: string; username: string; password: string; display_name?: string }) {
    const result = await this.request<{ user: any; tokens: { access_token: string; refresh_token: string } }>('/api/auth/register', {
      method: 'POST',
      body: data,
    });
    this.setToken(result.tokens.access_token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifestream_refresh_token', result.tokens.refresh_token);
    }
    return result;
  }

  async login(email: string, password: string) {
    const result = await this.request<{ user: any; tokens: { access_token: string; refresh_token: string } }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    this.setToken(result.tokens.access_token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lifestream_refresh_token', result.tokens.refresh_token);
    }
    return result;
  }

  async getSession() {
    return this.request<{ user: any }>('/api/auth/session');
  }

  async refreshToken() {
    if (typeof window === 'undefined') throw new Error('No refresh token');
    const refreshToken = localStorage.getItem('lifestream_refresh_token');
    if (!refreshToken) throw new Error('No refresh token');

    const result = await this.request<{ tokens: { access_token: string; refresh_token: string } }>('/api/auth/refresh', {
      method: 'POST',
      body: { refresh_token: refreshToken },
    });
    this.setToken(result.tokens.access_token);
    localStorage.setItem('lifestream_refresh_token', result.tokens.refresh_token);
    return result;
  }

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lifestream_refresh_token');
      }
    }
  }

  // Memories
  async getMemories(params?: { limit?: number; offset?: number; category?: string }) {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    if (params?.category) query.set('category', params.category);
    const qs = query.toString();
    return this.request<{ memories: any[]; total: number }>(`/api/memories${qs ? '?' + qs : ''}`);
  }

  async createMemory(data: any) {
    return this.request<{ memory: any }>('/api/memories', { method: 'POST', body: data });
  }

  async getMemory(id: string) {
    return this.request<{ memory: any }>(`/api/memories/${id}`);
  }

  async updateMemory(id: string, data: any) {
    return this.request<{ memory: any }>(`/api/memories/${id}`, { method: 'PUT', body: data });
  }

  async deleteMemory(id: string) {
    return this.request(`/api/memories/${id}`, { method: 'DELETE' });
  }

  async addReaction(memoryId: string, emoji: string) {
    return this.request(`/api/memories/${memoryId}/reactions`, { method: 'POST', body: { emoji } });
  }

  // Social
  async getFriends() {
    return this.request<{ friends: any[] }>('/api/friends');
  }

  async addFriend(userId: string) {
    return this.request(`/api/friends/${userId}`, { method: 'POST' });
  }

  async getFeed(limit = 20, offset = 0) {
    return this.request<{ memories: any[] }>(`/api/feed?limit=${limit}&offset=${offset}`);
  }

  // Notifications
  async getNotifications() {
    return this.request<{ notifications: any[] }>('/api/notifications');
  }

  // Search
  async search(query: string) {
    return this.request<{ memories: any[] }>(`/api/search?q=${encodeURIComponent(query)}`);
  }

  // Upload
  async uploadMedia(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const authToken = this.getToken();
    const res = await fetch(`${API_BASE}/api/media/upload`, {
      method: 'POST',
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  }
}

export const api = new ApiClient();
export default api;
