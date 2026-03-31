import { create } from 'zustand';

interface AppState {
  isLoggedIn: boolean;
  user: any | null;
  setLoggedIn: (status: boolean) => void;
  setUser: (user: any | null) => void;
}

export const useStore = create<AppState>((set) => ({
  isLoggedIn: false,
  user: null,
  setLoggedIn: (status) => set({ isLoggedIn: status }),
  setUser: (user) => set({ user }),
}));
