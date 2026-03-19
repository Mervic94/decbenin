
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapIcon } from 'lucide-react';

// Fix default marker icons for Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapProps {
  latitude?: number;
  longitude?: number;
  height?: string;
}

const Map = ({
  latitude = 6.3702928,
  longitude = 2.3912362,
  height = "300px"
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([latitude, longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.current);

    L.marker([latitude, longitude]).addTo(map.current);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [latitude, longitude]);

  return (
    <div style={{ height }} className="w-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;
