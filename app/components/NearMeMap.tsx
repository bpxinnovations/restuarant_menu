"use client";

import { useEffect, useRef } from "react";
import type { Restaurant } from "../data/restaurants";

const RADIUS_KM = 5;

/** Reverse geocode using OpenStreetMap Nominatim (no API key) */
function reverseGeocode(lat: number, lng: number): Promise<string> {
  return fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    { headers: { "Accept-Language": "en", "User-Agent": "RestaurantMenusApp/1.0" } }
  )
    .then((res) => res.json())
    .then((data) => (data?.display_name ? String(data.display_name) : `${lat.toFixed(5)}, ${lng.toFixed(5)}`))
    .catch(() => `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
}

export type NearMeMapProps = {
  userLat: number;
  userLng: number;
  restaurants: Restaurant[];
  className?: string;
};

export function NearMeMap({ userLat, userLng, restaurants, className = "" }: NearMeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<{ remove: () => void } | null>(null);
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!mapRef.current || typeof window === "undefined") return;

    let cancelled = false;

    import("leaflet").then((L) => {
      if (cancelled || !mapRef.current) return;

      const leaflet = L.default;
      const map = leaflet.map(mapRef.current, {
        zoomControl: true,
      }).setView([userLat, userLng], 13);
      mapInstanceRef.current = map;

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
          minZoom: 2,
        })
        .addTo(map);

      const userIcon = leaflet.divIcon({
        className: "near-me-user-pin",
        html: `<div style="width:24px;height:24px;background:#588B8B;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const userMarker = leaflet
        .marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup("Loading address…");

      reverseGeocode(userLat, userLng).then((address) => {
        if (cancelled) return;
        const escaped = address
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
        userMarker.setPopupContent(escaped);
        userMarker.openPopup();
      });

      leaflet
        .circle([userLat, userLng], { radius: RADIUS_KM * 1000 })
        .addTo(map)
        .setStyle({ color: "#588B8B", fillColor: "#588B8B", fillOpacity: 0.08, weight: 2 });

      const restIcon = leaflet.divIcon({
        className: "near-me-rest-pin",
        html: `<div style="width:20px;height:20px;background:#c53030;border:2px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      restaurants.forEach((r) => {
        if (!r.coordinates) return;
        const esc = (s: string) =>
          s.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
        leaflet
          .marker([r.coordinates.lat, r.coordinates.lng], { icon: restIcon })
          .addTo(map)
          .bindPopup(`<strong>${esc(r.name)}</strong><br/><span class="text-gray-600">${esc(r.location)}</span>`);
      });

      // Fix map size when container was hidden or layout not yet settled
      map.invalidateSize();
      if (!cancelled) {
        resizeTimerRef.current = setTimeout(() => {
          if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize?.();
        }, 150);
      }
    });

    return () => {
      cancelled = true;
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
        resizeTimerRef.current = null;
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLat, userLng, restaurants]);

  return (
    <div
      ref={mapRef}
      className={`h-[320px] min-h-[320px] w-full min-w-0 rounded-xl overflow-hidden bg-gray-100 [&_.leaflet-container]:!h-full [&_.leaflet-container]:!rounded-xl ${className}`}
      style={{ position: "relative" }}
    />
  );
}
