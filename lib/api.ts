import axios from 'axios';

const API_BASE_URL = 'https://car-rental-api.goit.global';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  img: string;
  description: string;
  fuelConsumption: string;
  engineSize: string;
  accessories: string[];
  functionalities: string[];
  rentalPrice: string;
  rentalCompany: string;
  address: string;
  rentalConditions: string[];
  mileage: number;
}

export interface CarsResponse {
  cars: Car[];
  totalCars: number;
  page: number;
  totalPages: number;
}

export interface FiltersParams {
  brand?: string;
  rentalPrice?: string;
  mileageFrom?: string;
  mileageTo?: string;
  page?: number;
  limit?: number;
}

export async function getCars(params?: FiltersParams): Promise<CarsResponse> {
  try {
    const response = await apiClient.get<CarsResponse>('/cars', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
}

export async function getCarById(id: string): Promise<Car> {
  try {
    const response = await apiClient.get<Car>(`/cars/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('Car not found');
    }
    console.error('Error fetching car:', error);
    throw error;
  }
}

export async function getMakes(): Promise<string[]> {
  try {
    const response = await apiClient.get<string[]>('/brands');
    return response.data;
  } catch (error) {
    console.error('Error fetching makes:', error);
    throw error;
  }
}

export async function getPrices(): Promise<number[]> {
  try {
    const response = await getCars({ limit: 1000 });
    const prices = [...new Set(response.cars.map(car => parseInt(car.rentalPrice)))];
    return prices.sort((a, b) => a - b);
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
}

