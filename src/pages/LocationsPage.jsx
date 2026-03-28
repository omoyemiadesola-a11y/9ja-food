import { useEffect, useState } from 'react';
import { fetchLocations } from '../services/api';

const fallbackLocations = [
  {
    id: 'oshinle',
    name: 'Oshinle, Ondo Road, Igbatoro, Akure',
    address: 'Oshinle, Ondo Road, Igbatoro, Akure, Ondo State',
    latitude: 7.1934,
    longitude: 5.2018,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'prime-junction',
    name: 'Prime Junction, Oshogbo',
    address: 'Prime Junction, Oshogbo, Osun State',
    latitude: 7.7833,
    longitude: 4.5589,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80',
  },
];

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const run = async () => {
      try {
        const data = await fetchLocations();
        setLocations(data.length ? data : fallbackLocations);
      } catch {
        setLocations(fallbackLocations);
      }
    };

    run();
  }, []);

  const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const markerQuery = encodeURIComponent(
    'Oshinle Ondo Road Igbatoro Akure Ondo State|Prime Junction Oshogbo Osun State',
  );
  const mapSrc = `https://www.google.com/maps/embed/v1/search?key=${mapsApiKey}&q=${markerQuery}`;

  return (
    <div className="container section">
      <h1>Our Locations</h1>
      <p>Find the nearest branch and order from your preferred outlet.</p>

      <section className="map-wrap mt-sm">
        <iframe
          title="9ja Food locations map"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={mapSrc}
        />
      </section>

      <section className="grid locations-grid mt-md">
        {locations.map((location) => (
          <article key={location.id} className="card">
            <img src={location.image_url || location.image} alt={location.name} className="card-image" />
            <h3>{location.name}</h3>
            <p>{location.address}</p>
            <p className="small">Lat: {location.latitude} • Lng: {location.longitude}</p>
            <button className="btn btn-primary mt-sm" type="button">Order from this branch</button>
          </article>
        ))}
      </section>
    </div>
  );
}
