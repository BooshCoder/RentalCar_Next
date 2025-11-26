import { getCars as getCarsApi, getCarById as getCarByIdApi, getMakes, getPrices, FiltersParams } from './api';
import { adaptCarFromApi } from './carAdapter';
import { Car } from '@/types';
import { getAllCars, getCarById, carsData } from '@/data/cars';

// Флаг для використання API (можна змінити на false для використання статичних даних)
const USE_API = true;

// Кеш для збереження даних
let cachedCars: Car[] | null = null;
let cachedMakes: string[] | null = null;
let cachedPrices: number[] | null = null;

// Функція для отримання всіх автомобілів
export async function getAllCarsService(params?: FiltersParams): Promise<Car[]> {
  if (!USE_API) {
    return getAllCars();
  }

  try {
    const response = await getCarsApi(params);
    return response.adverts.map(adaptCarFromApi);
  } catch (error) {
    console.error('Error fetching cars from API, using fallback:', error);
    // Fallback на статичні дані при помилці
    return getAllCars();
  }
}

// Функція для отримання автомобіля за ID
export async function getCarByIdService(id: number): Promise<Car | null> {
  if (!USE_API) {
    return getCarById(id) || null;
  }

  try {
    const apiCar = await getCarByIdApi(id);
    return adaptCarFromApi(apiCar);
  } catch (error) {
    console.error('Error fetching car from API, using fallback:', error);
    // Fallback на статичні дані при помилці
    return getCarById(id) || null;
  }
}

// Функція для отримання унікальних марок
export async function getUniqueBrandsService(): Promise<string[]> {
  if (!USE_API) {
    // Використовуємо статичний список з макету
    return [
      'Aston Martin',
      'Audi',
      'BMW',
      'Bentley',
      'Buick',
      'Chevrolet',
      'Chrysler',
      'GMC',
      'HUMMER'
    ];
  }

  try {
    if (cachedMakes) {
      return cachedMakes;
    }
    const makes = await getMakes();
    cachedMakes = makes;
    return makes;
  } catch (error) {
    console.error('Error fetching makes from API, using fallback:', error);
    // Fallback на статичний список
    return [
      'Aston Martin',
      'Audi',
      'BMW',
      'Bentley',
      'Buick',
      'Chevrolet',
      'Chrysler',
      'GMC',
      'HUMMER'
    ];
  }
}

// Функція для отримання унікальних цін
export async function getUniquePricesService(): Promise<number[]> {
  if (!USE_API) {
    return [30, 40, 50, 60, 70, 80];
  }

  try {
    if (cachedPrices) {
      return cachedPrices;
    }
    const prices = await getPrices();
    cachedPrices = prices;
    return prices;
  } catch (error) {
    console.error('Error fetching prices from API, using fallback:', error);
    // Fallback на статичний список
    return [30, 40, 50, 60, 70, 80];
  }
}

// Функція для фільтрації автомобілів через API
export async function filterCarsService(params: FiltersParams): Promise<Car[]> {
  if (!USE_API) {
    // Використовуємо локальну фільтрацію
    const allCars = getAllCars();
    return allCars.filter(car => {
      if (params.make && car.make !== params.make) return false;
      if (params.rentalPrice) {
        const selectedPrice = parseInt(params.rentalPrice.replace('$', ''));
        if (car.price !== selectedPrice) return false;
      }
      if (params.mileageFrom) {
        const mileageFrom = parseInt(params.mileageFrom.replace(/\s/g, ''));
        if (car.mileage < mileageFrom) return false;
      }
      if (params.mileageTo) {
        const mileageTo = parseInt(params.mileageTo.replace(/\s/g, ''));
        if (car.mileage > mileageTo) return false;
      }
      return true;
    });
  }

  try {
    const response = await getCarsApi(params);
    return response.adverts.map(adaptCarFromApi);
  } catch (error) {
    console.error('Error filtering cars from API, using fallback:', error);
    // Fallback на локальну фільтрацію
    const allCars = getAllCars();
    return allCars.filter(car => {
      if (params.make && car.make !== params.make) return false;
      if (params.rentalPrice) {
        const selectedPrice = parseInt(params.rentalPrice.replace('$', ''));
        if (car.price !== selectedPrice) return false;
      }
      if (params.mileageFrom) {
        const mileageFrom = parseInt(params.mileageFrom.replace(/\s/g, ''));
        if (car.mileage < mileageFrom) return false;
      }
      if (params.mileageTo) {
        const mileageTo = parseInt(params.mileageTo.replace(/\s/g, ''));
        if (car.mileage > mileageTo) return false;
      }
      return true;
    });
  }
}

