'use client';

import { useState, FormEvent } from 'react';
import styles from './BookingForm.module.css';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    comment: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validateName = (name: string): string => {
    if (!name.trim()) return 'Ім\'я обов\'язкове для заповнення';
    if (name.trim().length < 2) return 'Ім\'я повинно містити мінімум 2 символи';
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'Email обов\'язковий для заповнення';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Введіть коректний email адрес';
    return '';
  };

  const validateDate = (date: string): string => {
    if (!date.trim()) return 'Дата бронювання обов\'язкова';
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return 'Дата повинна бути в майбутньому';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Очищення помилки при зміні
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let error = '';

    if (name === 'name') error = validateName(value);
    else if (name === 'email') error = validateEmail(value);
    else if (name === 'date') error = validateDate(value);

    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const dateError = validateDate(formData.date);

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (dateError) newErrors.date = dateError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Успішна відправка
    setSuccess(true);
    setFormData({ name: '', email: '', date: '', comment: '' });
    setErrors({});

    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

  return (
    <div className={styles.bookingForm}>
      <h2 className={styles.formTitle}>Book your car now</h2>
      <p className={styles.formSubtitle}>Stay connected! We are always ready to help you.</p>

      {success && (
        <div className={styles.successMessage}>
          Дякуємо за ваше замовлення! Ми зв'яжемося з вами найближчим часом.
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <input
            type="text"
            name="name"
            className={`${styles.formInput} ${errors.name ? styles.error : ''}`}
            placeholder="Name*"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
        </div>

        <div className={styles.formGroup}>
          <input
            type="email"
            name="email"
            className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
            placeholder="Email*"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
        </div>

        <div className={styles.formGroup}>
          <input
            type="date"
            name="date"
            className={`${styles.formInput} ${errors.date ? styles.error : ''}`}
            placeholder="Booking date"
            value={formData.date}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.date && <div className={styles.errorMessage}>{errors.date}</div>}
        </div>

        <div className={styles.formGroup}>
          <textarea
            name="comment"
            className={`${styles.formInput} ${styles.formTextarea}`}
            placeholder="Comment"
            rows={4}
            value={formData.comment}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className={styles.btn}>
          Send
        </button>
      </form>
    </div>
  );
}

