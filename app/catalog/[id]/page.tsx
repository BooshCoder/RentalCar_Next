import { notFound } from 'next/navigation';
import { getCarByIdService } from '@/lib/carsService';
import { formatMileage } from '@/lib/utils';
import BookingForm from '@/components/BookingForm';
import styles from './page.module.css';

interface DetailsPageProps {
  params: {
    id: string;
  };
}

export default async function DetailsPage({ params }: DetailsPageProps) {
  const car = await getCarByIdService(params.id);

  if (!car) {
    notFound();
  }

  return (
    <section className={styles.detailsSection}>
      <div className={styles.container}>
        <div className={styles.detailsLayout}>
          <div className={styles.detailsLeft}>
            <div className={styles.carImageLarge}>
              <img
                src={car.image}
                alt={`${car.make} ${car.model}`}
                className={styles.image}
                loading="lazy"
              />
            </div>
            <BookingForm />
          </div>

          <div className={styles.detailsRight}>
            <div className={styles.carTitleSection}>
              <div className={styles.carTitleGroup}>
                <h1 className={styles.carTitle}>
                  {car.make} {car.model}, {car.year}
                </h1>
                <span className={styles.carId}>Id: {car.id}</span>
              </div>
              <div className={styles.carMetaRow}>
                <div className={styles.carLocation}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 8.5C8.82843 8.5 9.5 7.82843 9.5 7C9.5 6.17157 8.82843 5.5 8 5.5C7.17157 5.5 6.5 6.17157 6.5 7C6.5 7.82843 7.17157 8.5 8 8.5Z"
                      fill="#101828"
                    />
                    <path
                      d="M8 2C5.79 2 4 3.79 4 6C4 9.5 8 13 8 13C8 13 12 9.5 12 6C12 3.79 10.21 2 8 2ZM8 8.5C7.17 8.5 6.5 7.83 6.5 7C6.5 6.17 7.17 5.5 8 5.5C8.83 5.5 9.5 6.17 9.5 7C9.5 7.83 8.83 8.5 8 8.5Z"
                      fill="#101828"
                    />
                  </svg>
                  <span>{car.location}, {car.country}</span>
                </div>
                <span className={styles.carMileage}>
                  Mileage: {formatMileage(car.mileage)} km
                </span>
              </div>
              <div className={styles.carPriceLarge}>${car.price}</div>
            </div>

            <p className={styles.carDescription}>{car.description}</p>

            <div className={styles.carInfoSection}>
              <h3 className={styles.infoSectionTitle}>Rental Conditions:</h3>
              <div className={styles.infoList}>
                <div className={styles.infoBlock}>
                  {car.rentalConditions.slice(0, 2).map((condition, index) => (
                    <div key={index} className={styles.infoItem}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="7.5" fill="#FFFFFF" stroke="#101828" strokeWidth="1"/>
                        <path
                          d="M6.5 12L3 8.5L4.5 7L6.5 9L11.5 4L13 5.5L6.5 12Z"
                          fill="#101828"
                        />
                      </svg>
                      <span>{condition}</span>
                    </div>
                  ))}
                </div>
                {car.rentalConditions.length > 2 && (
                  <div className={styles.infoBlock}>
                    {car.rentalConditions.slice(2).map((condition, index) => (
                      <div key={index + 2} className={styles.infoItem}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7.5" fill="#FFFFFF" stroke="#101828" strokeWidth="1"/>
                          <path
                            d="M6.5 12L3 8.5L4.5 7L6.5 9L11.5 4L13 5.5L6.5 12Z"
                            fill="#101828"
                          />
                        </svg>
                        <span>{condition}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.carInfoSection}>
              <h3 className={styles.infoSectionTitle}>Car Specifications:</h3>
              <div className={styles.infoList}>
                <div className={styles.infoBlock}>
                  <div className={styles.infoItem}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M12 2H4C2.9 2 2 2.9 2 4V12C2 13.1 2.9 14 4 14H12C13.1 14 14 13.1 14 12V4C14 2.9 13.1 2 12 2ZM12 12H4V4H12V12Z"
                        fill="#101828"
                      />
                      <path
                        d="M6 6H10V7H6V6ZM6 8H10V9H6V8ZM6 10H8V11H6V10Z"
                        fill="#101828"
                      />
                    </svg>
                    <span>Year: {car.specifications.year}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 0L10 6H16L11 9.5L13 15.5L8 12L3 15.5L5 9.5L0 6H6L8 0Z"
                        fill="#101828"
                      />
                    </svg>
                    <span>Type: {car.specifications.type}</span>
                  </div>
                </div>
                <div className={styles.infoBlock}>
                  <div className={styles.infoItem}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M2 2H4V4H2V2ZM6 2H8V4H6V2ZM10 2H12V4H10V2ZM14 2H16V4H14V2ZM2 6H4V8H2V6ZM6 6H8V8H6V6ZM10 6H12V8H10V6ZM14 6H16V8H14V6ZM2 10H4V12H2V10ZM6 10H8V12H6V10ZM10 10H12V12H10V10ZM14 10H16V12H14V10ZM2 14H4V16H2V14ZM6 14H8V16H6V14ZM10 14H12V16H10V14ZM14 14H16V16H14V14Z"
                        fill="#101828"
                      />
                    </svg>
                    <span>Fuel Consumption: {car.specifications.fuelConsumption}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C11.31 2 14 4.69 14 8C14 11.31 11.31 14 8 14ZM8.5 4H7.5V8.5L11 10.5L11.5 9.5L8.5 7.5V4Z"
                        fill="#101828"
                      />
                    </svg>
                    <span>Engine Size: {car.specifications.engineSize}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.carInfoSection}>
              <h3 className={styles.infoSectionTitle}>Accessories and functionalities:</h3>
              <div className={styles.infoList}>
                {car.accessories.map((accessory, index) => (
                  <div key={index} className={styles.infoItem}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7.5" fill="#FFFFFF" stroke="#101828" strokeWidth="1"/>
                      <path
                        d="M6.5 12L3 8.5L4.5 7L6.5 9L11.5 4L13 5.5L6.5 12Z"
                        fill="#101828"
                      />
                    </svg>
                    <span>{accessory}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

