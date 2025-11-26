'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Car } from '@/types';
import { getCarsPageService } from '@/lib/carsService';
import Filters from '@/components/Filters';
import CarCard from '@/components/CarCard';
import styles from './page.module.css';

const CARDS_PER_PAGE = 4;

function CatalogContent() {
  const searchParams = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const getFilterParams = () => {
    const brand = searchParams.get('brand');
    const price = searchParams.get('price');
    const mileageFrom = searchParams.get('mileageFrom');
    const mileageTo = searchParams.get('mileageTo');
    
    return {
      brand: brand || undefined,
      rentalPrice: price || undefined,
      mileageFrom: mileageFrom ? mileageFrom.replace(/\s/g, '') : undefined,
      mileageTo: mileageTo ? mileageTo.replace(/\s/g, '') : undefined,
    };
  };

  const loadFirstPage = async () => {
    try {
      setLoading(true);
      setCurrentPage(1);
      
      const params = getFilterParams();
      const response = await getCarsPageService({ ...params, page: 1, limit: CARDS_PER_PAGE });
      
      setCars(response.cars);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = () => {
    loadFirstPage();
  };

  const handleLoadMore = async () => {
    if (currentPage >= totalPages || loadingMore) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const params = getFilterParams();
      const response = await getCarsPageService({ ...params, page: nextPage, limit: CARDS_PER_PAGE });
      
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

        {cars.length === 0 ? (
          <div className={styles.noResults}>
            <p>Автомобілів не знайдено</p>
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
                  className={styles.btn} 
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
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <section className={styles.catalogSection}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>Завантаження...</p>
          </div>
        </div>
      </section>
    }>
      <CatalogContent />
    </Suspense>
  );
}


