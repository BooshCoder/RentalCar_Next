'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './DatePicker.module.css';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

const MONTHS_UA = [
  'січень', 'лютий', 'березень', 'квітень', 'травень', 'червень',
  'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень'
];

const DAYS_EN = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export default function DatePicker({ value, onChange, placeholder = 'дд.мм.рррр', className = '', error = false }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const parts = dateString.split('.');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  };

  const selectedDate = value ? parseDate(value) : null;

  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number): number => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    onChange(formatDate(newDate));
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };


  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const days: Array<{ day: number; isCurrentMonth: boolean }> = [];

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const prevMonthDays = getDaysInMonth(prevMonth, prevYear);

  for (let i = prevMonthDays - firstDay + 1; i <= prevMonthDays; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  const displayValue = value || '';

  return (
    <div ref={datePickerRef} className={`${styles.datePicker} ${className}`}>
      <div
        className={`${styles.dateInput} ${error ? styles.error : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <input
          type="text"
          readOnly
          value={displayValue}
          placeholder={placeholder}
          className={styles.input}
        />
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.calendarIcon}>
          <path
            d="M12 2H4C2.9 2 2 2.9 2 4V12C2 13.1 2.9 14 4 14H12C13.1 14 14 13.1 14 12V4C14 2.9 13.1 2 12 2ZM12 12H4V4H12V12Z"
            fill="#8d929a"
          />
          <path
            d="M6 6H10V7H6V6ZM6 8H10V9H6V8ZM6 10H8V11H6V10Z"
            fill="#8d929a"
          />
        </svg>
      </div>

      {isOpen && (
        <div className={styles.calendar}>
          <div className={styles.calendarHeader}>
            <div className={styles.monthYear}>
              <span>{MONTHS_UA[currentMonth]} {currentYear} р.</span>
            </div>
            <div className={styles.navigation}>
              <button type="button" onClick={handlePrevMonth} className={styles.navButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="#3470ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button type="button" onClick={handleNextMonth} className={styles.navButton}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6L15 12L9 18" stroke="#3470ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          <div className={styles.daysOfWeek}>
            {DAYS_EN.map((day, index) => (
              <div key={index} className={styles.dayName}>{day}</div>
            ))}
          </div>

          <div className={styles.daysGrid}>
            {days.map((item, index) => {
              const isSelected = selectedDate &&
                item.isCurrentMonth &&
                item.day === selectedDate.getDate() &&
                currentMonth === selectedDate.getMonth() &&
                currentYear === selectedDate.getFullYear();
              const today = new Date();
              const isToday = item.isCurrentMonth &&
                item.day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

              return (
                <button
                  key={index}
                  type="button"
                  className={`${styles.day} ${!item.isCurrentMonth ? styles.otherMonth : ''} ${isSelected ? styles.selected : ''} ${isToday && !isSelected ? styles.today : ''}`}
                  onClick={() => item.isCurrentMonth && handleDateSelect(item.day)}
                  disabled={!item.isCurrentMonth}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}

