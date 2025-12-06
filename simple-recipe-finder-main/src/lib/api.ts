// API client for backend communication
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Auth token management
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const getAuthToken = () => authToken;

// Generic API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || 'An error has occurred!' };
    }

    return { data };
  } catch (error) {
    return { error: 'Network error. Please try again.' };
  }
}

// Auth endpoints
export const authApi = {
  register: (email: string, password: string) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: async (email: string, password: string) => {
    const result = await apiRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (result.data?.token) {
      setAuthToken(result.data.token);
    }
    
    return result;
  },

  logout: () => {
    setAuthToken(null);
  },
};

// Recipe endpoints
export const recipeApi = {
  search: (query: string, filters?: { category?: string; area?: string }) =>
    apiRequest(
      `/recipes/search?q=${query}&${new URLSearchParams(filters as any).toString()}`
    ),

  getById: (id: string) => apiRequest(`/recipes/${id}`),

  searchByIngredients: (ingredients: string[], exclude?: string[]) =>
    apiRequest('/recipes/by-ingredients', {
      method: 'POST',
      body: JSON.stringify({ ingredients, exclude }),
    }),

  getRandom: () => apiRequest('/recipes/random'),
};


// Favorites endpoints
export const favoritesApi = {
  getAll: () => apiRequest('/favorites'),

  add: (recipe: {
    id: string;
    title: string;
    image?: string;
    category?: string;
    area?: string;
  }) =>
    apiRequest('/favorites', {
      method: 'POST',
      body: JSON.stringify({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        category: recipe.category,
        area: recipe.area,
      }),
    }),

  remove: (recipeId: string) =>
    apiRequest(`/favorites/${recipeId}`, {
      method: 'DELETE',
    }),
};

