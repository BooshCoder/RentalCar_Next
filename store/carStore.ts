import { create } from 'zustand';
import { Car } from '@/types';

interface Filters {
  brand?: string;
  price?: string;
  mileageFrom?: string;
  mileageTo?: string;
}

interface CarStore {
  cars: Car[];
  favorites: number[];
  filters: Filters;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  
  setCars: (cars: Car[]) => void;
  addCars: (cars: Car[]) => void;
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setIsLoading: (loading: boolean) => void;
  
  toggleFavorite: (carId: number) => void;
  isFavorite: (carId: number) => boolean;
  loadFavorites: () => void;
}

export const useCarStore = create<CarStore>((set, get) => ({
  cars: [],
  favorites: [],
  filters: {},
  currentPage: 1,
  totalPages: 1,
  isLoading: false,

  setCars: (cars) => set({ cars }),
  
  addCars: (cars) => set((state) => ({ 
    cars: [...state.cars, ...cars] 
  })),
  
  setFilters: (filters) => set({ filters, currentPage: 1 }),
  
  resetFilters: () => set({ filters: {}, currentPage: 1 }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  setTotalPages: (pages) => set({ totalPages: pages }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  toggleFavorite: (carId) => {
    const { favorites } = get();
    const newFavorites = favorites.includes(carId)
      ? favorites.filter(id => id !== carId)
      : [...favorites, carId];
    
    set({ favorites: newFavorites });
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  },
  
  isFavorite: (carId) => {
    return get().favorites.includes(carId);
  },
  
  loadFavorites: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('favorites');
      if (stored) {
        set({ favorites: JSON.parse(stored) });
      }
    }
  },
}));

