import React, { useState } from 'react';

interface FilterControlsProps {
  onFilterChange: (filters: {
    minPrice: number | undefined;
    maxPrice: number | undefined;
    minBedrooms: number | undefined;
    minBathrooms: number | undefined;
  }) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ onFilterChange }) => {
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minBedrooms, setMinBedrooms] = useState<number | undefined>(undefined);
  const [minBathrooms, setMinBathrooms] = useState<number | undefined>(undefined);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMinPrice(isNaN(value) ? undefined : value);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMaxPrice(isNaN(value) ? undefined : value);
  };

  const handleMinBedroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMinBedrooms(isNaN(value) ? undefined : value);
  };

  const handleMinBathroomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setMinBathrooms(isNaN(value) ? undefined : value);
  };

  const applyFilters = () => {
    onFilterChange({ minPrice, maxPrice, minBedrooms, minBathrooms });
  };

  // Styles object for cleaner JSX
  const styles = {
    container: {
      backgroundColor: 'var(--surface-color)',
      padding: '24px',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '20px',
      alignItems: 'end',
      marginBottom: '40px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '8px',
      textAlign: 'right' as const,
    },
    label: {
      fontSize: '0.9rem',
      fontWeight: 500,
      color: 'var(--text-secondary)',
    },
    input: {
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid var(--border-color)',
      fontSize: '1rem',
      backgroundColor: '#f9f9f9',
      transition: 'border-color 0.2s',
      outline: 'none',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: 600,
      transition: 'all 0.2s',
      height: '46px', // match input height approx
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputGroup}>
        <label htmlFor="minPrice" style={styles.label}>מחיר מינימלי (₪)</label>
        <input
          type="number"
          id="minPrice"
          placeholder="0"
          value={minPrice || ''}
          onChange={handleMinPriceChange}
          style={styles.input}
        />
      </div>
      <div style={styles.inputGroup}>
        <label htmlFor="maxPrice" style={styles.label}>מחיר מקסימלי (₪)</label>
        <input
          type="number"
          id="maxPrice"
          placeholder="ללא הגבלה"
          value={maxPrice || ''}
          onChange={handleMaxPriceChange}
          style={styles.input}
        />
      </div>
      <div style={styles.inputGroup}>
        <label htmlFor="minBedrooms" style={styles.label}>חדרים</label>
        <input
          type="number"
          id="minBedrooms"
          placeholder="0"
          value={minBedrooms || ''}
          onChange={handleMinBedroomsChange}
          style={styles.input}
        />
      </div>
      {/* Bathrooms filter removed as data is not available from feed */}
      {/* 
      <div style={styles.inputGroup}>
        <label htmlFor="minBathrooms" style={styles.label}>מקלחות</label>
        <input 
          type="number" 
          id="minBathrooms" 
          placeholder="0"
          value={minBathrooms || ''} 
          onChange={handleMinBathroomsChange} 
          style={styles.input} 
        />
      </div> 
      */}
      <button
        onClick={applyFilters}
        style={styles.button}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
      >
        סנן תוצאות
      </button>
    </div>
  );
};

export default FilterControls;
