'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

interface CustomSelectProps {
  label: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  width?: number;
  formatOption?: (option: string) => string;
}

export default function CustomSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  width = 204,
  formatOption,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const displayText = value 
    ? (formatOption ? formatOption(value) : value)
    : placeholder;
  
  const getOptionDisplayText = (option: string) => {
    return formatOption ? formatOption(option) : option;
  };

  return (
    <div className={styles.selectWrapper} style={{ width: `${width}px` }} ref={dropdownRef}>
      <div className={styles.inputContainer}>
        <label className={styles.label}>{label}</label>
        <button
          type="button"
          className={`${styles.selectButton} ${isOpen ? styles.selectButtonOpen : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={styles.selectText}>{displayText}</span>
          <svg
            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#101828"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownContent}>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className={`${styles.dropdownItem} ${value === option ? styles.dropdownItemSelected : ''}`}
                onClick={() => handleSelect(option)}
              >
                {getOptionDisplayText(option)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

