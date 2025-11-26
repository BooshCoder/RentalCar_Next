'use client';

import { useState, useEffect } from 'react';
import { Car } from '@/types';
import { getAllCarsService } from '@/lib/carsService';
import Filters from '@/components/Filters';
import CarCard from '@/components/CarCard';
import styles from './page.module.css';

const CARDS_PER_PAGE = 4;

export default function CatalogPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(CARDS_PER_PAGE);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const allCars = await getAllCarsService();
      setCars(allCars);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filteredCars: Car[]) => {
    setCars(filteredCars);
    setDisplayedCount(CARDS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + CARDS_PER_PAGE);
  };

  const displayedCars = cars.slice(0, displayedCount);
  const hasMore = displayedCount < cars.length;

  if (loading) {
    return (
      <section className={styles.catalogSection}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>Завантаження...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.catalogSection}>
      <div className={styles.container}>
        <Filters onFilterChange={handleFilterChange} />

        {displayedCars.length === 0 ? (
          <div className={styles.noResults}>
            <p>Автомобілів не знайдено</p>
          </div>
        ) : (
          <>
            <div className={styles.cardsGrid}>
              {displayedCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {hasMore && (
              <div className={styles.loadMoreWrapper}>
                <button className={styles.btn} onClick={handleLoadMore}>
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}


