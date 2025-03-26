import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface LocationMapProps {
  location: GeolocationPosition | null;
}

export const LocationMap: React.FC<LocationMapProps> = ({ location }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!location || !mapRef.current) return;

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GMAPS_API_KEY || '',
      version: 'weekly',
    });

    loader.load().then(() => {
      const position = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      if (!googleMapRef.current) {
        googleMapRef.current = new google.maps.Map(mapRef.current, {
          center: position,
          zoom: 15,
          styles: [
            {
              featureType: 'all',
              elementType: 'all',
              stylers: [{ saturation: -100 }],
            },
          ],
        });
      } else {
        googleMapRef.current.setCenter(position);
      }

      if (markerRef.current) {
        markerRef.current.setPosition(position);
      } else {
        markerRef.current = new google.maps.Marker({
          position,
          map: googleMapRef.current,
          title: 'Your Location',
          animation: google.maps.Animation.DROP,
        });
      }
    });
  }, [location]);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg">
      <div ref={mapRef} className="h-96 w-full" />
    </div>
  );
};