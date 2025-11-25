'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filters as FiltersType } from '@/types';
import { getAllCars, getUniqueBrands, getUniquePrices } from '@/data/cars';
import CustomSelect from './CustomSelect';
import styles from './Filters.module.css';

interface FiltersProps {
  onFilterChange: (filteredCars: ReturnType<typeof getAllCars>) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FiltersType>({
    brand: searchParams.get('brand') || '',
    price: searchParams.get('price') || '',
    mileageFrom: searchParams.get('mileageFrom') || '',
    mileageTo: searchParams.get('mileageTo') || '',
  });

  const brands = getUniqueBrands();
  const prices = getUniquePrices();

  // Застосувати фільтри при завантаженні сторінки з URL параметрів
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key: keyof FiltersType, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    applyFilters();
  };

  const applyFilters = () => {
    const allCars = getAllCars();
    
    const filteredCars = allCars.filter(car => {
      if (filters.brand && car.make !== filters.brand) return false;
      if (filters.price) {
        const selectedPrice = parseInt(filters.price.replace('$', ''));
        if (car.price !== selectedPrice) return false;
      }
      if (filters.mileageFrom) {
        const mileageFrom = parseInt(filters.mileageFrom.replace(/\s/g, ''));
        if (car.mileage < mileageFrom) return false;
      }
      if (filters.mileageTo) {
        const mileageTo = parseInt(filters.mileageTo.replace(/\s/g, ''));
        if (car.mileage > mileageTo) return false;
      }
      return true;
    });

    // Оновлення URL
    const params = new URLSearchParams();
    if (filters.brand) params.set('brand', filters.brand);
    if (filters.price) params.set('price', filters.price);
    if (filters.mileageFrom) params.set('mileageFrom', filters.mileageFrom);
    if (filters.mileageTo) params.set('mileageTo', filters.mileageTo);

    router.push(`/catalog${params.toString() ? '?' + params.toString() : ''}`, { scroll: false });

    onFilterChange(filteredCars);
  };

  return (
    <div className={styles.filters}>
      <CustomSelect
        label="Car brand"
        placeholder="Choose a brand"
        options={brands}
        value={filters.brand}
        onChange={(value) => handleFilterChange('brand', value)}
        width={204}
      />

      <CustomSelect
        label="Price/ 1 hour"
        placeholder="Choose a price"
        options={prices.map(p => p.toString())}
        value={filters.price}
        onChange={(value) => handleFilterChange('price', value)}
        width={196}
        formatOption={(option) => {
          // Для відображення вибраного значення додаємо $
          return `$${option}`;
        }}
      />

      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Сar mileage / km</label>
        <div className={styles.mileageInputs}>
          <input
            type="text"
            className={styles.mileageInput}
            placeholder="From"
            value={filters.mileageFrom}
            onChange={(e) => handleFilterChange('mileageFrom', e.target.value)}
          />
          <input
            type="text"
            className={styles.mileageInput}
            placeholder="To"
            value={filters.mileageTo}
            onChange={(e) => handleFilterChange('mileageTo', e.target.value)}
          />
        </div>
      </div>

      <button className={styles.searchBtn} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}

