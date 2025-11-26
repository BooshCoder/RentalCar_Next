'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car } from '@/types';
import { getAllCarsService } from '@/lib/carsService';
import CarCard from '@/components/CarCard';
import styles from './page.module.css';

const CARDS_PER_PAGE = 4;

export default function Home() {
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

  const displayedCars = cars.slice(0, displayedCount);
  const hasMore = displayedCount < cars.length;

  const handleLoadMore = () => {
    setDisplayedCount(prev => prev + CARDS_PER_PAGE);
  };

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroImage}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>Find your perfect rental car</h1>
              <p className={styles.heroSubtitle}>
                Reliable and budget-friendly rentals for any journey
              </p>
            </div>
            <Link href="/catalog" className={styles.btn}>
              View Catalog
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Popular Cars</h2>
          {loading ? (
            <div className={styles.loading}>
              <p>Завантаження...</p>
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
                  <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

