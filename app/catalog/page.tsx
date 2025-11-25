'use client';

import { useState, useEffect } from 'react';
import { Car } from '@/types';
import { getAllCars } from '@/data/cars';
import Filters from '@/components/Filters';
import CarCard from '@/components/CarCard';
import styles from './page.module.css';

const CARDS_PER_PAGE = 4;

export default function CatalogPage() {
  const [cars, setCars] = useState<Car[]>(getAllCars());
  const [displayedCount, setDisplayedCount] = useState(CARDS_PER_PAGE);

  const handleFilterChange = (filteredCars: Car[]) => {
    setCars(filteredCars);
    setDisplayedCount(CARDS_PER_PAGE);
  };

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + CARDS_PER_PAGE);
  };

  const displayedCars = cars.slice(0, displayedCount);
  const hasMore = displayedCount < cars.length;

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

