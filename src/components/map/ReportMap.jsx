import React, { useContext, useState } from "react";
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
    [15.5, -17.5], // southwest — bottom of Western Sahara + Atlantic coast
    [40.5, -0.5], // northeast corner
  ];

  const TYPE_ICONS = {
    flood: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-waves-icon lucide-waves">
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      </svg>`,
    fire: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame-icon lucide-flame">
      <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>
      </svg>`,
    medical: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-pulse-icon lucide-heart-pulse"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`,
    traffic: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-traffic-cone-icon lucide-traffic-cone">
      <path d="M16.05 10.966a5 2.5 0 0 1-8.1 0"/>
      <path d="m16.923 14.049 4.48 2.04a1 1 0 0 1 .001 1.831l-8.574 3.9a2 2 0 0 1-1.66 0l-8.574-3.91a1 1 0 0 1 0-1.83l4.484-2.04"/>
      <path d="M16.949 14.14a5 2.5 0 1 1-9.9 0L10.063 3.5a2 2 0 0 1 3.874 0z"/><path d="M9.194 6.57a5 2.5 0 0 0 5.61 0"/>
      </svg>`,
    infrastructure: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2-icon lucide-building-2"><path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/></svg>`,
    other: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert">
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
              <button
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 text-xs rounded-md w-full transition-colors"
              >
                Assign Team
              </button>
            </div>
            
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ReportMap;
