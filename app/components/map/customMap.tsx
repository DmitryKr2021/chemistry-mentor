"use client";

import { useEffect, useState, useRef } from "react";
import { useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// --- Кастомный маркер (чистый React/HTML) ---
interface CustomMarkerProps {
  position: LatLngExpression;
  children?: React.ReactNode;
  className?: string;
}

function CustomMarker({
  position,
  children,
  className = "",
}: CustomMarkerProps) {
  const map = useMap();
  const [pixelPos, setPixelPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const markerRef = useRef<HTMLDivElement>(null);

  // Обновление позиции маркера при движении карты
  useEffect(() => {
    const updatePosition = () => {
      const point = map.latLngToContainerPoint(position);
      setPixelPos({ x: point.x, y: point.y });

      // Скрываем маркер, если он ушёл за пределы видимой области
      const container = map.getContainer();
      setVisible(
        point.x > -50 &&
          point.y > -50 &&
          point.x < container.clientWidth + 50 &&
          point.y < container.clientHeight + 50,
      );
    };

    updatePosition();
    // Подписываемся на события карты
    map.on("move zoom", updatePosition);
    return () => {
      map.off("move zoom", updatePosition);
    };
  }, [map, position]);

  if (!visible) return null;

  return (
    <div
      ref={markerRef}
      className={`absolute transform -translate-x-1/2 -translate-y-full cursor-pointer z-[400] ${className}`}
      style={{
        left: pixelPos.x,
        top: pixelPos.y,
        pointerEvents: "auto",
      }}
    >
      {children}
    </div>
  );
}

// --- Дизайн вашего маркера (полная свобода стилей) ---
function SofiaMarker({ popupText }: { popupText: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col items-center">
      {/* Анимированный пин */}
      <div className="relative group" onClick={() => setIsOpen(!isOpen)}>
        {/* Пульсация */}
        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />

        {/* Сам маркер */}
        <div className="relative w-10 h-10 bg-emerald-500 border-4 border-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
          <span className="text-white text-lg">⚛</span>
        </div>

        {/* Хвостик маркера */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-500 border-r-4 border-b-4 border-white transform rotate-45" />
      </div>
      {/* Кастомный попап (чистый React, не Leaflet) */}
      {isOpen && (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-600 text-xl">⚛</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 text-sm">
                Химия с Дмитрием Крыльским
              </h4>
              <p className="text-slate-600 text-xs mt-1">{popupText}</p>
              <a
                href="/contacts"
                className="inline-block mt-2 text-emerald-600 text-xs font-medium hover:underline"
              >
                Записаться →
              </a>
            </div>
          </div>
          {/* Стрелочка попапа */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-slate-200 transform rotate-45" />
        </div>
      )}
    </div>
  );
}

export { CustomMarker, SofiaMarker };
