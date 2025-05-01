
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapIcon } from 'lucide-react';

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
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Check if WebGL is supported
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        setMapError('WebGL is not supported in your browser');
        return;
      }

      // Initialize map
      mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHR3bjNtcm0wMTRqMmptbGFpdnJ3OWR2In0.Zb3J4JTqolqQnZJJVgXqbg';
      
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [longitude, latitude],
        zoom: 15,
        failIfMajorPerformanceCaveat: false, // Allow fallback rendering
      });

      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Failed to load map');
      });

      // Add marker when the map is loaded
      mapInstance.on('load', () => {
        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(mapInstance);
      });

      // Add navigation controls
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current = mapInstance;

      // Cleanup
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error("Map initialization error:", error);
      setMapError('Failed to initialize map');
    }
  }, [latitude, longitude]);

  // Fallback content when map fails to load
  if (mapError) {
    return (
      <div 
        style={{ height }} 
        className="w-full rounded-lg overflow-hidden bg-gray-100 flex flex-col items-center justify-center text-gray-500"
      >
        <MapIcon size={36} />
        <p className="mt-2">Map not available</p>
        <p className="text-sm mt-1">Coordinates: {latitude}, {longitude}</p>
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
