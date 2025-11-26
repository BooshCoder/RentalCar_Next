import { Car as ApiCar } from './api';
import { Car } from '@/types';

// Адаптер для перетворення даних з API у формат, який використовується в проекті
export function adaptCarFromApi(apiCar: ApiCar): Car {
  // Парсинг rentalConditions з рядка (може бути рядком або масивом)
  let rentalConditions: string[] = [];
  if (typeof apiCar.rentalConditions === 'string') {
    rentalConditions = apiCar.rentalConditions.split('\n').filter((condition: string) => condition.trim());
  } else if (Array.isArray(apiCar.rentalConditions)) {
    rentalConditions = apiCar.rentalConditions;
  }

  // Парсинг rentalPrice для отримання числового значення
  const priceMatch = apiCar.rentalPrice?.match(/\$(\d+)/);
  const price = priceMatch ? parseInt(priceMatch[1], 10) : 0;

  // Парсинг address для отримання location та country
  const addressParts = apiCar.address?.split(',') || [];
  const location = addressParts[0]?.trim() || '';
  const country = addressParts[1]?.trim() || '';

  return {
    id: apiCar.id,
    make: apiCar.make,
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

