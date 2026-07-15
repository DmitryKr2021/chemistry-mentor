"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import { CustomMarker, SofiaMarker } from "./customMap";
import "leaflet/dist/leaflet.css";

// Фикс иконок маркеров для Leaflet в Next.js
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  center?: LatLngExpression;
  markerPosition?: LatLngExpression;
  popupText?: string;
}

export default function Map({
  center = [55.7558, 37.6173],
  markerPosition = [55.7558, 37.6173],
  popupText = "Онлайн-занятия по химии. Подготовка к ЕГЭ и олимпиадам.",
}: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={15}
      scrollWheelZoom={true}
      className="w-full h-[400px] rounded-lg shadow-lg border border-slate-200"
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <CustomMarker position={markerPosition}>
        <SofiaMarker popupText={popupText} />
      </CustomMarker>
    </MapContainer>
  );
}
