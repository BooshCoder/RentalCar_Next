'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car } from '@/types';
import { getCarsPageService } from '@/lib/carsService';
import CarCard from '@/components/CarCard';
import styles from './page.module.css';

const CARDS_PER_PAGE = 4;

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadFirstPage();
  }, []);

  const loadFirstPage = async () => {
    try {
      setLoading(true);
      const response = await getCarsPageService({ page: 1, limit: CARDS_PER_PAGE });
      setCars(response.cars);
      setTotalPages(response.totalPages);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (currentPage >= totalPages || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const response = await getCarsPageService({ page: nextPage, limit: CARDS_PER_PAGE });
      setCars(prev => [...prev, ...response.cars]);
      setCurrentPage(nextPage);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading more cars:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = currentPage < totalPages;

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
                {cars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
              {hasMore && (
                <div className={styles.loadMoreWrapper}>
                  <button 
                    className={styles.loadMoreBtn} 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Завантаження...' : 'Load more'}
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

