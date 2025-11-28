import { create } from 'zustand';
import client from '../api/client';
import type { User } from './types';

type AuthState = {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,
  initialize: async () => {
    try {
      const { data } = await client.get('/api/auth/me');
      set({ user: data.user, initialized: true, error: null });
    } catch (err) {
      set({ user: null, initialized: true });
    }
  },
  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await client.post('/api/auth/login', payload);
      set({ user: data.user, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      throw err;
    }
  },
  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await client.post('/api/auth/register', payload);
      set({ user: data.user, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Unable to register',
        loading: false,
      });
      throw err;
    }
  },
  loginWithGoogle: async (idToken) => {
    set({ loading: true, error: null });
    try {
      const { data } = await client.post('/api/auth/google', { idToken });
      set({ user: data.user, loading: false, error: null });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Google authentication failed. Please check your configuration.';
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },
  logout: async () => {
    await client.post('/api/auth/logout');
    set({ user: null });
  },
}));

export default useAuthStore;

