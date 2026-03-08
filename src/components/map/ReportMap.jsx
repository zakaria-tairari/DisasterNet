import React, { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// Fix for default Leaflet icon paths in Vite
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ReportMap = ({ center = [31.7917, -7.0926], zoom = 6, reports = [] }) => {
  const { theme } = useContext(ThemeContext);

  const BOUNDS = [
    [20.5, -17.5], // southwest — bottom of Western Sahara + Atlantic coast
    [36.5, -0.5], // northeast corner
  ];

  const TYPE_ICONS = {
    flood:
      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-waves-icon lucide-waves">
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      </svg>`,
    fire:
      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame-icon lucide-flame">
      <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>
      </svg>`,
    medical:`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ambulance-icon lucide-ambulance">
      <path d="M10 10H6"/>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/><path d="M8 8v4"/>
      <path d="M9 18h6"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>
      </svg>`,
    traffic:
      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-traffic-cone-icon lucide-traffic-cone">
      <path d="M16.05 10.966a5 2.5 0 0 1-8.1 0"/>
      <path d="m16.923 14.049 4.48 2.04a1 1 0 0 1 .001 1.831l-8.574 3.9a2 2 0 0 1-1.66 0l-8.574-3.91a1 1 0 0 1 0-1.83l4.484-2.04"/>
      <path d="M16.949 14.14a5 2.5 0 1 1-9.9 0L10.063 3.5a2 2 0 0 1 3.874 0z"/><path d="M9.194 6.57a5 2.5 0 0 0 5.61 0"/>
      </svg>`,
    infrastructure:
      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building-icon lucide-building">
      <path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M12 6h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/><path d="M8 6h.01"/>
      <path d="M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      </svg>`,
    other:
      `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
      <path d="M12 9v4"/><path d="M12 17h.01"/>
      </svg>`,
  };

  const getMarkerIcon = (type, status) => {
    const svg = TYPE_ICONS[type] ?? TYPE_ICONS.other;
    const color =
      status === "pending"
        ? "#f59e0b"
        : status === "dispached"
          ? "#3b82f6"
          : "#10b981";

    return L.divIcon({
      className: "",
      html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <div style="
          position: absolute;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: ${color};
          opacity: 0.4;
          animation: pulse 1.8s ease-out infinite;
        "></div>
        <div style="
          position: absolute;
          width: 32px; height: 32px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        ">${svg}</div>
      </div>
      <style>
        @keyframes pulse {
          0%   { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      </style>
    `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18],
    });
  };

  // Switch tile URL based on active theme to maintain cohesive UI
  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // Dark Matter
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"; // Positron

  return (
    <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors overflow-hidden h-112.5 md:h-150 z-0 relative">
      <MapContainer
        maxBounds={BOUNDS}
        minZoom={6}
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />
        {reports.map((report, idx) => (
          <Marker
            key={idx}
            icon={getMarkerIcon(report.type, report.status)}
            position={[report.location.lat, report.location.lng]}
          >
            <Popup>
              <div className="font-sans">
                <strong className="text-slate-900 block mb-1">
                  {report.cin} - {report.fullName}
                </strong>
                <span className="text-sm text-slate-600 block mb-2">
                  {report.type}
                </span>
                <span className="text-xs text-slate-600 block mb-2">
                  {report.description}
                </span>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 text-xs rounded-md w-full transition-colors">
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default ReportMap;
