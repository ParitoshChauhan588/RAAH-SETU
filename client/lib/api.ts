// API Configuration
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// ==================== AUTHENTICATION API ====================

export const auth = {
  signup: async (name: string, email: string, phone: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });
    return handleResponse(response);
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(response);
    if (data.user_id) {
      localStorage.setItem('user', JSON.stringify({
        id: data.user_id,
        name: data.name,
        email: data.email
      }));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('user');
  }
};

// ==================== EMERGENCY CONTACTS API ====================

export const emergencyContacts = {
  getAll: async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const response = await fetch(`${API_BASE_URL}/emergency-contacts?user_id=${user.id}`);
    return handleResponse(response);
  },

  create: async (name: string, phone: string, relationship: string, priority: string = 'medium', email: string = '') => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`${API_BASE_URL}/emergency-contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        name,
        phone,
        relationship,
        priority,
        email
      })
    });
    return handleResponse(response);
  },

  update: async (id: number, name: string, phone: string, relationship: string, priority: string, email: string) => {
    const response = await fetch(`${API_BASE_URL}/emergency-contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        phone,
        relationship,
        priority,
        email
      })
    });
    return handleResponse(response);
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/emergency-contacts/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// ==================== HEALTH CHECKS API ====================

export const healthChecks = {
  getAll: async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const response = await fetch(`${API_BASE_URL}/health-checks?user_id=${user.id}`);
    return handleResponse(response);
  },

  create: async (mood: string, heart_rate?: number, location: string = '', notes: string = '') => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`${API_BASE_URL}/health-checks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        mood,
        heart_rate,
        location,
        notes
      })
    });
    return handleResponse(response);
  }
};

// ==================== INCIDENTS API ====================

export const incidents = {
  getAll: async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const response = await fetch(`${API_BASE_URL}/incidents?user_id=${user.id}`);
    return handleResponse(response);
  },

  create: async (title: string, description: string, type: string, severity: string = 'medium', location: string = '') => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`${API_BASE_URL}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        title,
        description,
        type,
        severity,
        location
      })
    });
    return handleResponse(response);
  }
};

// ==================== ACTIVITIES API ====================

export const activities = {
  getAll: async () => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const response = await fetch(`${API_BASE_URL}/activities?user_id=${user.id}`);
    return handleResponse(response);
  },

  log: async (type: string, description: string, location: string = '') => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        type,
        description,
        location
      })
    });
    return handleResponse(response);
  }
};

// ==================== SOS API ====================

export const sos = {
  activate: async (location: string = '') => {
    const user = getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const response = await fetch(`${API_BASE_URL}/sos/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        location
      })
    });
    return handleResponse(response);
  }
};

// ==================== HELPER FUNCTIONS ====================

async function handleResponse(response: Response) {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }
  
  return data;
}

// Health check API
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await handleResponse(response);
  } catch (error) {
    console.error('API health check failed:', error);
    return null;
  }
};
