
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Map as MapIcon } from 'lucide-react';

interface MapProps {
  latitude?: number;
  longitude?: number;
  height?: string;
}

const Map = ({ 
  latitude = 6.3702928, // Default coordinates for Cotonou
  longitude = 2.3912362,
  height = "300px"
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHR3bjNtcm0wMTRqMmptbGFpdnJ3OWR2In0.Zb3J4JTqolqQnZJJVgXqbg';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: 15,
    });

    // Add marker
    new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude]);

  return (
    <div style={{ height }} className="w-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
