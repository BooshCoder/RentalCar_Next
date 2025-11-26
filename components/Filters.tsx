'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filters as FiltersType } from '@/types';
import { Car } from '@/types';
import { getUniqueBrandsService, getUniquePricesService, filterCarsService } from '@/lib/carsService';
import CustomSelect from './CustomSelect';
import styles from './Filters.module.css';

interface FiltersProps {
  onFilterChange: (filteredCars: Car[]) => void;
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

  const [brands, setBrands] = useState<string[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    if (!loading) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const loadFilterOptions = async () => {
    try {
      setLoading(true);
      const [brandsData, pricesData] = await Promise.all([
        getUniqueBrandsService(),
        getUniquePricesService()
      ]);
      setBrands(brandsData);
      setPrices(pricesData);
    } catch (error) {
      console.error('Error loading filter options:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FiltersType, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    applyFilters();
  };

  const applyFilters = async () => {
    try {
      const params = {
        make: filters.brand || undefined,
        rentalPrice: filters.price ? `$${filters.price}` : undefined,
        mileageFrom: filters.mileageFrom ? filters.mileageFrom.replace(/\s/g, '') : undefined,
        mileageTo: filters.mileageTo ? filters.mileageTo.replace(/\s/g, '') : undefined,
      };

      const filteredCars = await filterCarsService(params);

      // Оновлення URL
      const urlParams = new URLSearchParams();
      if (filters.brand) urlParams.set('brand', filters.brand);
      if (filters.price) urlParams.set('price', filters.price);
      if (filters.mileageFrom) urlParams.set('mileageFrom', filters.mileageFrom);
      if (filters.mileageTo) urlParams.set('mileageTo', filters.mileageTo);

      router.push(`/catalog${urlParams.toString() ? '?' + urlParams.toString() : ''}`, { scroll: false });

      onFilterChange(filteredCars);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
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

