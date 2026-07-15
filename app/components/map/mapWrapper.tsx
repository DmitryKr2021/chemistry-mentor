"use client";

import { LatLngExpression } from "leaflet";
import dynamic from "next/dynamic";

// Динамический импорт карты с отключённым SSR
const MapNoSSR = dynamic(() => import("./Map"), {
  ssr: false, // ❗ Ключевая настройка — не рендерить на сервере
  loading: () => (
    <div className="w-full h-[400px] bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center">
      <div className="text-slate-500 text-sm">Загрузка карты...</div>
    </div>
  ),
});

interface MapWrapperProps {
  center?: LatLngExpression; //[number, number];
  markerPosition?: LatLngExpression; //[number, number];
  popupText?: string;
}

export default function MapWrapper({
  center,
  markerPosition,
  popupText,
}: MapWrapperProps) {
  return (
    <MapNoSSR
      center={center}
      markerPosition={markerPosition}
      popupText={popupText}
    />
  );
}
