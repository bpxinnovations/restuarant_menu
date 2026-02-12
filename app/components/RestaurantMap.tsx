"use client";

import { useEffect, useRef } from "react";

export interface RestaurantMapProps {
  lat: number;
  lng: number;
  name: string;
  className?: string;
}

export function RestaurantMap({ lat, lng, name, className = "" }: RestaurantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      const leaflet = L.default;
      const map = leaflet
        .map(mapRef.current, { zoomControl: true })
        .setView([lat, lng], 15);
      mapInstanceRef.current = map;

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
          minZoom: 2,
        })
        .addTo(map);

      const esc = (s: string) =>
        s
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      const icon = leaflet.divIcon({
        className: "restaurant-single-pin",
        html: `<div style="width:32px;height:32px;background:#588B8B;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      leaflet
        .marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${esc(name)}</strong>`);

      map.invalidateSize();
    });

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, name]);

  return (
    <div
      ref={mapRef}
      className={`h-[160px] min-h-[160px] w-full min-w-0 rounded-lg overflow-hidden bg-gray-100 [&_.leaflet-container]:!h-full [&_.leaflet-container]:!rounded-lg ${className}`}
      style={{ position: "relative" }}
    />
  );
}
