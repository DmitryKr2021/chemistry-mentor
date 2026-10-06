"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Динамический импорт с ssr: false и встроенным fallback (loading)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <MapSkeleton /> },
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false },
);
// 2. Динамически импортируем наш кастомный маркер (без SSR!)
const LeafletMarker = dynamic(() => import("./leafletMarker"), { ssr: false });

// Компонент-заглушка (скелетон) на время загрузки
function MapSkeleton() {
  return (
    <div className="w-full h-[500px] md:h-[600px] bg-slate-100 rounded-lg flex items-center justify-center border-2 border-slate-200 animate-pulse">
      <div className="text-slate-500 font-medium">
        Загрузка интерактивной карты...
      </div>
    </div>
  );
}

// 📍 Список городов ваших учеников
const studentCities = [
  { name: "Владивосток", country: "Россия", lat: 43.1155, lng: 131.8855 },
  { name: "Иркутск", country: "Россия", lat: 52.27527, lng: 104.75277 },
  { name: "Томск", country: "Россия", lat: 56.4874, lng: 84.95431 },
  { name: "Тюмень", country: "Россия", lat: 57.15601, lng: 65.54873 },
  { name: "Екатеринбург", country: "Россия", lat: 56.8389, lng: 60.6057 },
  { name: "Пермь", country: "Россия", lat: 58.01418, lng: 56.22001 },
  { name: "Москва", country: "Россия", lat: 55.7558, lng: 37.6173 },
  { name: "Санкт-Петербург", country: "Россия", lat: 59.9343, lng: 30.3351 },
  { name: "Воронеж", country: "Россия", lat: 51.67209, lng: 39.18054 },
  { name: "Ростов", country: "Россия", lat: 47.25414, lng: 39.79383 },
  { name: "Симферополь", country: "Россия", lat: 44.95469, lng: 34.14224 },
  { name: "Кемерово", country: "Россия", lat: 55.34206, lng: 86.06554 },
  { name: "Дубна", country: "Россия", lat: 56.73297, lng: 37.15948 },
  { name: "Тампере", country: "Финляндия", lat: 61.49194, lng: 23.78004 },
  { name: "Вена", country: "Австрия", lat: 48.2082, lng: 16.3738 },
  { name: "Линц", country: "Австрия", lat: 48.29105, lng: 14.54514 },
  { name: "Прага", country: "Чехия", lat: 50.07723, lng: 14.42528 },
];

const countryFlags: Record<string, string> = {
  Россия: "🇷🇺",
  Финляндия: "🇫🇮",
  Австрия: "🇦🇹",
  Чехия: "🇨🇿",
};

export default function StudentsMap() {
  const countriesCount = new Set(studentCities.map((c) => c.country)).size;

  return (
    <div className="w-full">
      {/* Заголовок и статистика */}
      <div className="mb-6 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
          🌍 География моих учеников
        </h3>
        <p className="text-slate-600 mb-4 max-w-2xl mx-auto">
          Онлайн-формат стирает границы. Мои ученики живут в{" "}
          <strong className="text-emerald-600">
            {studentCities.length} городах
          </strong>{" "}
          и{" "}
          <strong className="text-emerald-600">{countriesCount} странах</strong>{" "}
          — от Владивостока до Вены!
        </p>
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {Object.entries(countryFlags).map(([country, flag]) => {
            const count = studentCities.filter(
              (c) => c.country === country,
            ).length;
            if (count === 0) return null;
            return (
              <div
                key={country}
                className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2"
              >
                <span>{flag}</span>
                <span className="font-medium text-slate-700">
                  {country}:
                </span>{" "}
                <span className="text-emerald-600 font-bold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Контейнер карты */}
      <div className="relative w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden shadow-lg border-2 border-slate-200 bg-slate-50">
        <MapContainer
          center={[55, 60]}
          zoom={3}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%", zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 3. Используем наш динамически импортированный маркер */}
          {studentCities.map((city, idx) => (
            <LeafletMarker key={idx} city={city} countryFlags={countryFlags} />
          ))}
        </MapContainer>
      </div>

      <p className="text-center text-sm text-slate-500 mt-4 italic">
        💡 Кликните на маркер, чтобы увидеть город. Карта интерактивная.
      </p>
    </div>
  );
}
