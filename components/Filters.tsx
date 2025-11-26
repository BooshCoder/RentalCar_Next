'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filters as FiltersType } from '@/types';
import { getUniqueBrandsService, getUniquePricesService } from '@/lib/carsService';
import CustomSelect from './CustomSelect';
import styles from './Filters.module.css';

interface FiltersProps {
  onFilterChange: () => void;
}

function FiltersContent({ onFilterChange }: FiltersProps) {
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
    applyFilters(filters);
  };

  const applyFilters = (currentFilters: FiltersType) => {
    const urlParams = new URLSearchParams();
    if (currentFilters.brand) urlParams.set('brand', currentFilters.brand);
    if (currentFilters.price) urlParams.set('price', currentFilters.price);
    if (currentFilters.mileageFrom) urlParams.set('mileageFrom', currentFilters.mileageFrom);
    if (currentFilters.mileageTo) urlParams.set('mileageTo', currentFilters.mileageTo);

    router.push(`/catalog${urlParams.toString() ? '?' + urlParams.toString() : ''}`, { scroll: false });
    onFilterChange();
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

export default function Filters({ onFilterChange }: FiltersProps) {
  return (
    <Suspense fallback={<div className={styles.filters}>Завантаження...</div>}>
      <FiltersContent onFilterChange={onFilterChange} />
    </Suspense>
  );
}

