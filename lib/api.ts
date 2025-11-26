const API_BASE_URL = 'https://car-rental-api.goit.global';

export interface Car {
  id: number;
  make: string;
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
  rentalConditions: string;
  mileage: number;
}

export interface CarsResponse {
  adverts: Car[];
  total: number;
}

export interface FiltersParams {
  make?: string;
  rentalPrice?: string;
  mileageFrom?: string;
  mileageTo?: string;
  page?: number;
  limit?: number;
}

// Функція для отримання списку автомобілів
export async function getCars(params?: FiltersParams): Promise<CarsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.make) searchParams.set('make', params.make);
  if (params?.rentalPrice) searchParams.set('rentalPrice', params.rentalPrice);
  if (params?.mileageFrom) searchParams.set('mileageFrom', params.mileageFrom);
  if (params?.mileageTo) searchParams.set('mileageTo', params.mileageTo);
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  const url = `${API_BASE_URL}/adverts${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
}

// Функція для отримання одного автомобіля за ID
export async function getCarById(id: number): Promise<Car> {
  try {
    const response = await fetch(`${API_BASE_URL}/adverts/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Car not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching car:', error);
    throw error;
  }
}

// Функція для отримання унікальних марок
export async function getMakes(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/adverts/makes`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching makes:', error);
    throw error;
  }
}

// Функція для отримання унікальних цін
export async function getPrices(): Promise<number[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/adverts/rentalPrice`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.sort((a: number, b: number) => a - b);
  } catch (error) {
    console.error('Error fetching prices:', error);
    throw error;
  }
}

