import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.title}>404</h1>
      <h2 className={styles.subtitle}>Автомобіль не знайдено</h2>
      <p className={styles.description}>
        Вибачте, але автомобіль з таким ID не існує.
      </p>
      <Link href="/catalog" className={styles.link}>
        Повернутися до каталогу
      </Link>
    </div>
  );
}


