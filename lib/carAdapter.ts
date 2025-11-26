import { Car as ApiCar } from './api';
import { Car } from '@/types';

const uuidToNumericIdMap = new Map<string, number>();
let nextNumericId = 1;

export function adaptCarFromApi(apiCar: ApiCar): Car {
  const rentalConditions = Array.isArray(apiCar.rentalConditions) 
    ? apiCar.rentalConditions 
    : [];

  const price = parseInt(apiCar.rentalPrice || '0', 10);

  const addressParts = apiCar.address?.split(',').map(part => part.trim()) || [];
  let location = '';
  let country = '';
  
  if (addressParts.length >= 2) {
    location = addressParts[addressParts.length - 2] || '';
    country = addressParts[addressParts.length - 1] || '';
  } else if (addressParts.length === 1) {
    location = addressParts[0] || '';
  }

  let numericId = uuidToNumericIdMap.get(apiCar.id);
  if (!numericId) {
    numericId = nextNumericId++;
    uuidToNumericIdMap.set(apiCar.id, numericId);
  }

  return {
    id: numericId,
    uuid: apiCar.id,
    make: apiCar.brand,
    model: apiCar.model,
    year: apiCar.year,
    type: apiCar.type,
    price: price,
    location: location,
    country: country,
    rentalCompany: apiCar.rentalCompany || '',
    mileage: apiCar.mileage,
    image: apiCar.img,
    description: apiCar.description,
    specifications: {
      year: apiCar.year,
      type: apiCar.type,
      fuelConsumption: parseFloat(apiCar.fuelConsumption) || 0,
      engineSize: apiCar.engineSize,
    },
    rentalConditions: rentalConditions,
    accessories: [...(apiCar.accessories || []), ...(apiCar.functionalities || [])],
  };
}

export function getUuidByNumericId(numericId: number): string | null {
  for (const [uuid, id] of uuidToNumericIdMap.entries()) {
    if (id === numericId) {
      return uuid;
    }
  }
  return null;
}

