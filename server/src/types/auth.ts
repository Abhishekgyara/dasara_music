export interface User {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    preferences: {
      favoriteGenres: string[];
      moodPreferences: string[];
    };
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    clearError: () => void;
    isAuthenticated: boolean;
  }