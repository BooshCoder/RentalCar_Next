export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  type: string;
  price: number;
  location: string;
  country: string;
  rentalCompany: string;
  mileage: number;
  image: string;
  description: string;
  specifications: {
    year: number;
    type: string;
    fuelConsumption: number;
    engineSize: string;
  };
  rentalConditions: string[];
  accessories: string[];
}

export interface Filters {
  brand: string;
  price: string;
  mileageFrom: string;
  mileageTo: string;
}


