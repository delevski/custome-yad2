import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Property } from '../types/property';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PropertyCardProps {
  property: Property;
  onToggleFavorite: (id: string) => void;
  onToggleHidden: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onToggleFavorite, onToggleHidden }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);

  const images = property.images && property.images.length > 0 ? property.images : [property.imageUrl];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const styles = {
    card: {
      backgroundColor: 'var(--surface-color)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'column' as const,
      position: 'relative' as const,
      height: 'auto', // Allow height to grow when map is shown
    },
    mediaContainer: {
      position: 'relative' as const,
      width: '100%',
      paddingTop: '56.25%', // 16:9 aspect ratio
      backgroundColor: '#eee',
      overflow: 'hidden',
    },
    absoluteContent: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    },
    navButton: {
      position: 'absolute' as const,
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(0,0,0,0.5)',
      color: 'white',
      border: 'none',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      zIndex: 10,
    },
    prevButton: {
      left: '10px',
    },
    nextButton: {
      right: '10px',
    },
    mapToggle: {
      position: 'absolute' as const,
      top: '10px',
      left: '10px',
      zIndex: 20,
      backgroundColor: 'white',
      color: 'var(--text-primary)',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: 600,
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    indicator: {
      position: 'absolute' as const,
      bottom: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'rgba(0,0,0,0.6)',
      color: 'white',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '0.75rem',
      zIndex: 10,
    },
    mapContainer: {
      height: '200px',
      width: '100%',
      borderBottom: '1px solid #eee'
    },
    content: {
      padding: '20px',
      display: 'flex',
      flexDirection: 'column' as const,
      flexGrow: 1,
      textAlign: 'right' as const,
    },
    price: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: 'var(--primary-color)',
      marginBottom: '8px',
    },
    address: {
      fontSize: '1.1rem',
      fontWeight: 600,
      marginBottom: '12px',
      color: 'var(--text-primary)',
      lineHeight: 1.3,
    },
    meta: {
      display: 'flex',
      gap: '16px',
      color: 'var(--text-secondary)',
      fontSize: '0.95rem',
      marginBottom: '16px',
      paddingBottom: '16px',
      borderBottom: '1px solid #eee',
    },
    description: {
      color: 'var(--text-secondary)',
      fontSize: '0.9rem',
      lineHeight: 1.6,
      marginBottom: '20px',
    },
    footer: {
      marginTop: 'auto',
      display: 'flex',
      gap: '10px',
    },
    button: {
      flex: 1,
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '0.9rem',
      fontWeight: 500,
      transition: 'background-color 0.2s',
      backgroundColor: '#f5f5f5',
      color: '#333',
    },
    favoriteBtn: {
      backgroundColor: property.isFavorite ? '#fff0f0' : '#f5f5f5',
      color: property.isFavorite ? '#ff4d4f' : '#333',
    }
  };

  return (
    <div style={styles.card} className="property-card">
      <div style={styles.mediaContainer}>
        <div style={styles.absoluteContent}>
          <img src={images[currentImageIndex]} alt={`${property.address} - ${currentImageIndex + 1}`} style={styles.image} />

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                style={{ ...styles.navButton, ...styles.prevButton }}
                aria-label="Previous image"
              >
                &#10094;
              </button>
              <button
                onClick={handleNextImage}
                style={{ ...styles.navButton, ...styles.nextButton }}
                aria-label="Next image"
              >
                &#10095;
              </button>
              <div style={styles.indicator}>
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}

          <button onClick={toggleMap} style={styles.mapToggle}>
            {showMap ? ' סגור מפה' : '📍 הצג מפה'}
          </button>
        </div>
      </div>

      {showMap && (
        <div style={styles.mapContainer}>
          <MapContainer
            center={[property.coordinates.lat, property.coordinates.lon]}
            zoom={14}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[property.coordinates.lat, property.coordinates.lon]}>
              <Popup>
                {property.address}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.price}>₪{property.price.toLocaleString()}</div>
        <div style={styles.address}>{property.address}</div>
        <div style={styles.meta}>
          <span>{property.bedrooms} חדרים</span>
          <span>|</span>
          {property.bathrooms !== undefined && (
            <>
              <span>{property.bathrooms} מקלחות</span>
              <span>|</span>
            </>
          )}
          <span>{property.area} מ״ר</span>
        </div>
        <div style={styles.description}>{property.description}</div>

        <div style={styles.footer}>
          <button
            style={{ ...styles.button, ...styles.favoriteBtn }}
            onClick={() => onToggleFavorite(property.id)}
          >
            {property.isFavorite ? '❤️ במועדפים' : '🤍 הוסף למועדפים'}
          </button>
          <button
            style={styles.button}
            onClick={() => onToggleHidden(property.id)}
          >
            {property.isHidden ? '👁️ הצג' : '👁️‍🗨️ הסתר'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
