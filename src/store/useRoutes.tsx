import { create } from 'zustand';

interface Route {
  path: string;
  component: any;
  children?: Route[];
}

interface RouteState {
  routes: Route[];
  setRoutes: (routes: Route[]) => void;
  fetchRoutes: () => Promise<void>;
}

export const useRoutesStore = create<RouteState>((set) => ({
  routes: [],
  setRoutes: (routes) => set({ routes }),
  fetchRoutes: async () => {
    const response = await fetch('/api/routes');
    const routes = await response.json();
    set({ routes });
  },
}));