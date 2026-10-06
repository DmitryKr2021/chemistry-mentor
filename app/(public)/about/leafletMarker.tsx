// app/components/LeafletMarker.tsx
"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet"; // ✅ Теперь это безопасно, так как компонент не рендерится на сервере

// Настраиваем иконку (используем стандартные ссылки CDN, чтобы не возиться с public папкой)
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LeafletMarkerProps {
  city: {
    name: string;
    country: string;
    lat: number;
    lng: number;
  };
  countryFlags: Record<string, string>;
}

export default function LeafletMarker({
  city,
  countryFlags,
}: LeafletMarkerProps) {
  return (
    <Marker position={[city.lat, city.lng]} icon={customIcon}>
      <Popup>
        <div className="text-center min-w-[120px]">
          <div className="text-2xl mb-1">
            {countryFlags[city.country] || "📍"}
          </div>
          <div className="font-bold text-slate-800">{city.name}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wide">
            {city.country}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
