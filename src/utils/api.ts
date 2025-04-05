// API base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Helper function for API requests
export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  // Get the auth token if it exists
  const token = localStorage.getItem('token');
  
  // Set default headers
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`API error (${response.status}):`, data);
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Auth endpoints
export const authApi = {
  login: (credentials: { username: string; password: string }) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  
  register: (userData: any) => 
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
};

// Todo endpoints
export const todoApi = {
  getAll: () => apiRequest('/todos'),
  
  getById: (id: string) => apiRequest(`/todos/${id}`),
  
  create: async (todo: any): Promise<any> => {
    console.log('Creating todo with data:', todo);
    try {
      const data = await apiRequest('/todos', {
        method: 'POST',
        body: JSON.stringify(todo)
      });
      console.log('Todo create API response:', data);
      return data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },
  
  update: async (id: string, todo: any): Promise<any> => {
    console.log(`Updating todo ${id} with data:`, todo);
    try {
      const data = await apiRequest(`/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(todo)
      });
      console.log('Todo update API response:', data);
      return data;
    } catch (error) {
      console.error(`Error updating todo ${id}:`, error);
      throw error;
    }
  },
  
  delete: (id: string) => 
    apiRequest(`/todos/${id}`, {
      method: 'DELETE'
    }),
  
  toggleComplete: (id: string, todo: any) => 
    apiRequest(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...todo,
        is_completed: !todo.is_completed
      })
    })
};

// User endpoints
export const userApi = {
  getProfile: () => apiRequest('/users/profile'),
  
  updateProfile: (profileData: any) => 
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),
  
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) => 
    apiRequest('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    })
};

// Telegram integration endpoints
export const telegramApi = {
  getStatus: () => 
    apiRequest('/telegram/status'),
    
  linkAccount: (token: string) => 
    apiRequest('/telegram/link', {
      method: 'POST',
      body: JSON.stringify({ token })
    }),
    
  unlinkAccount: () => 
    apiRequest('/telegram/unlink', {
      method: 'POST'
    })
}; 