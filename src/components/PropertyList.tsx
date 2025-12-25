import React, { useEffect, useState, useMemo } from 'react';
import type { Property } from '../types/property';
import { fetchProperties } from '../api/properties';
import PropertyCard from './PropertyCard';
import FilterControls from './FilterControls';

interface Filters {
  minPrice: number | undefined;
  maxPrice: number | undefined;
  minBedrooms: number | undefined;
  minBathrooms: number | undefined;
}

const PropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    minPrice: undefined,
    maxPrice: undefined,
    minBedrooms: undefined,
    minBathrooms: undefined,
  });
  const [showFilters, setShowFilters] = useState<boolean>(true);

  useEffect(() => {
    const getProperties = async () => {
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (err) {
        setError('שגיאה בטעינת הנכסים');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProperties();
  }, []);

  const handleToggleFavorite = (id: string) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === id ? { ...property, isFavorite: !property.isFavorite } : property
      )
    );
  };

  const handleToggleHidden = (id: string) => {
    setProperties((prevProperties) =>
      prevProperties.map((property) =>
        property.id === id ? { ...property, isHidden: !property.isHidden } : property
      )
    );
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties.filter((property) => !property.isHidden);

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((property) => property.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((property) => property.price <= filters.maxPrice!);
    }
    if (filters.minBedrooms !== undefined) {
      filtered = filtered.filter((property) => property.bedrooms >= filters.minBedrooms!);
    }
    if (filters.minBathrooms !== undefined) {
      filtered = filtered.filter((property) => property.bathrooms >= filters.minBathrooms!);
    }

    filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1;
      if (!a.isFavorite && b.isFavorite) return 1;
      return 0;
    });

    return filtered;
  }, [properties, filters]);


  if (loading) return <div style={{ marginTop: 40, fontSize: '1.2rem', color: '#666' }}>טוען נכסים...</div>;
  if (error) return <div style={{ color: 'red', marginTop: 40 }}>שגיאה: {error}</div>;

  const styles = {
    toggleBtn: {
      marginBottom: '20px',
      backgroundColor: 'transparent',
      border: '1px solid var(--primary-color)',
      color: 'var(--primary-color)',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '0.9rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '30px',
      padding: '10px 0',
    }
  };

  return (
    <div>
      <button onClick={() => setShowFilters(!showFilters)} style={styles.toggleBtn}>
        {showFilters ? 'הסתר סינון' : 'הצג אפשרויות סינון'}
      </button>

      {showFilters && <FilterControls onFilterChange={handleFilterChange} />}

      <div style={styles.grid}>
        {filteredAndSortedProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onToggleFavorite={handleToggleFavorite}
            onToggleHidden={handleToggleHidden}
          />
        ))}
      </div>

      {filteredAndSortedProperties.length === 0 && (
        <div style={{ marginTop: 40, color: '#888' }}>לא נמצאו נכסים התואמים את החיפוש.</div>
      )}
    </div>
  );
};

export default PropertyList;
