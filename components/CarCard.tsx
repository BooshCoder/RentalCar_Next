'use client';

import Link from 'next/link';
import { Car } from '@/types';
import { formatMileage } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useCarStore } from '@/store/carStore';
import styles from './CarCard.module.css';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { toggleFavorite, isFavorite, loadFavorites } = useCarStore();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(car.id);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardImage}>
        {!imageLoaded && (
          <div className={styles.imageSkeleton}></div>
        )}
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className={`${styles.image} ${imageLoaded ? styles.imageLoaded : styles.imageLoading}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />
        <div className={styles.cardGradient}></div>
        <button
          className={`${styles.heartBtn} ${isFavorite(car.id) ? styles.heartActive : ''}`}
          aria-label="Add to favorites"
          onClick={handleToggleFavorite}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 13.5L3.5 8.5C2.5 7.5 2 6.5 2 5.5C2 3.5 3.5 2 5.5 2C6.5 2 7.5 2.5 8 3C8.5 2.5 9.5 2 10.5 2C12.5 2 14 3.5 14 5.5C14 6.5 13.5 7.5 12.5 8.5L8 13.5Z"
              fill={isFavorite(car.id) ? '#3470FF' : 'none'}
              stroke={isFavorite(car.id) ? 'none' : '#101828'}
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            {car.make} <span className={styles.cardTitleAccent}>{car.model}</span>, {car.year}
          </h3>
          <span className={styles.cardPrice}>${car.price}</span>
        </div>
        <div className={styles.cardInfo}>
          <div className={styles.cardInfoRow}>
            <span>{car.location}</span>
            <span className={styles.separator}></span>
            <span>{car.country}</span>
            <span className={styles.separator}></span>
            <span>{car.rentalCompany}</span>
          </div>
          <div className={styles.cardInfoRow}>
            <span>{car.type.charAt(0).toUpperCase() + car.type.slice(1).toLowerCase()}</span>
            <span className={styles.separator}></span>
            <span>{formatMileage(car.mileage)} km</span>
          </div>
        </div>
      </div>
      <Link href={`/catalog/${car.uuid || car.id.toString()}`} className={styles.btn}>
        Read more
      </Link>
    </div>
  );
}

