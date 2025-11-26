import { getCars as getCarsApi, getCarById as getCarByIdApi, getMakes, getPrices, FiltersParams, CarsResponse } from './api';
import { adaptCarFromApi } from './carAdapter';
import { Car } from '@/types';

let cachedMakes: string[] | null = null;
let cachedPrices: number[] | null = null;

export interface CarsPageResponse {
  cars: Car[];
  totalCars: number;
  page: number;
  totalPages: number;
}

export async function getCarsPageService(params?: FiltersParams): Promise<CarsPageResponse> {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 4;
    
    const response = await getCarsApi({ ...params, page, limit });
    const cars = response.cars.map(adaptCarFromApi);
    
    return {
      cars,
      totalCars: response.totalCars,
      page: response.page,
      totalPages: response.totalPages,
    };
  } catch (error) {
    console.error('Error fetching cars page from API:', error);
    throw error;
  }
}

export async function getCarByIdService(id: string): Promise<Car | null> {
  try {
    const apiCar = await getCarByIdApi(id);
    return adaptCarFromApi(apiCar);
  } catch (error) {
    console.error('Error fetching car from API:', error);
    throw error;
  }
}

export async function getUniqueBrandsService(): Promise<string[]> {
  try {
    if (cachedMakes) {
      return cachedMakes;
    }
    const makes = await getMakes();
    cachedMakes = makes;
    return makes;
  } catch (error) {
    console.error('Error fetching makes from API:', error);
    throw error;
  }
}

export async function getUniquePricesService(): Promise<number[]> {
  try {
    if (cachedPrices) {
      return cachedPrices;
    }
    const prices = await getPrices();
    cachedPrices = prices;
    return prices;
  } catch (error) {
    console.error('Error fetching prices from API:', error);
    throw error;
  }
}

export async function getAllCarsService(params?: FiltersParams): Promise<Car[]> {
  try {
    const allCars: Car[] = [];
    let page = params?.page || 1;
    const limit = params?.limit || 100;
    let hasMore = true;

    while (hasMore) {
      const requestParams: FiltersParams = {
        ...params,
        page,
        limit,
      };
      
      const response = await getCarsApi(requestParams);
      const cars = response.cars.map(adaptCarFromApi);
      allCars.push(...cars);

      if (page >= response.totalPages || cars.length === 0) {
        hasMore = false;
      } else {
        page++;
      }
    }

    return allCars;
  } catch (error) {
    console.error('Error fetching cars from API:', error);
    throw error;
  }
}
