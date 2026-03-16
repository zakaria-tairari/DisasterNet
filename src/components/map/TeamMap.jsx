import React, { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const ORS_API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImI1NmViNDRiZDBlMDRlZWZiOTJkMmUwNTY3MGQ1NTY2IiwiaCI6Im11cm11cjY0In0="; // 🔑 Replace with your OpenRouteService key

const BOUNDS = [
  [15.5, -17.5],
  [40.5, -0.5],
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

const STATUS_STYLES = {
  pending: {
    text: "text-red-600",
    dot: "bg-red-500",
  },
  dispatched: {
    text: "text-yellow-600",
    dot: "bg-yellow-500",
  },
  on_site: {
    text: "text-blue-600",
    dot: "bg-blue-500",
  },
  resolved: {
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
};

const FitBounds = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 1) {
      map.fitBounds(coords, { padding: [60, 60] });
    }
  }, [coords, map]);
  return null;
};

const userIcon = () =>
  L.divIcon({
    className: "",
    html: `
      <div style="position:relative;width:20px;height:20px;">
        <div style="
          position:absolute;width:20px;height:20px;border-radius:50%;
          background:#3b82f6;opacity:0.35;
          animation:userPulse 1.8s ease-out infinite;
        "></div>
        <div style="
          position:absolute;width:20px;height:20px;border-radius:50%;
          background:#3b82f6;border:2px solid #fff;
          box-shadow:0 0 8px rgba(59,130,246,0.7);
          z-index:1;
        "></div>
      </div>
      <style>
        @keyframes userPulse {
          0%   { transform:scale(1);opacity:0.35; }
          100% { transform:scale(3);opacity:0; }
        }
      </style>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

const getMarkerIcon = (type, status) => {
  const svg = TYPE_ICONS[type] ?? TYPE_ICONS.other;
  const color =
    status === "pending"
      ? "oklch(63.7% 0.237 25.331)"
      : status === "dispatched"
        ? "oklch(79.5% 0.184 86.047)"
        : "oklch(54.6% 0.245 262.881)";

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

const fmtDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}min`;
  return `${m} min`;
};

const fmtDistance = (meters) => {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
};

const TeamMap = ({ incident, zoom = 6, updateStatus }) => {
  const { theme } = useContext(ThemeContext);

  const [userPos, setUserPos] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [routeError, setRouteError] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const watchIdRef = useRef(null);

  // ── 1. Watch user geolocation ──────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGeoError(null);
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        setGeoError(`Location error: ${err.message}`);
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
    );

    return () => {
      if (watchIdRef.current !== null)
        navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (!userPos || !incident?.location) return;

    const { lat: toLat, lng: toLng } = incident.location;

    const fetchRoute = async () => {
      setLoadingRoute(true);
      setRouteError(null);
      try {
        const res = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?` +
            new URLSearchParams({
              api_key: ORS_API_KEY,
              start: `${userPos.lng},${userPos.lat}`,
              end: `${toLng},${toLat}`,
            }),
        );

        if (!res.ok) throw new Error(`ORS error ${res.status}`);

        const data = await res.json();
        const feature = data.features?.[0];
        if (!feature) throw new Error("No route found.");

        const coords = feature.geometry.coordinates.map(([lng, lat]) => [
          lat,
          lng,
        ]);
        const summary = feature.properties.summary;

        setRouteCoords(coords);
        setRouteInfo({
          distance: summary.distance,
          duration: summary.duration,
        });
      } catch (err) {
        setRouteError(err.message);
        setRouteCoords([]);
        setRouteInfo(null);
      } finally {
        setLoadingRoute(false);
      }
    };

    fetchRoute();
  }, [userPos, incident]);

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const mapCenter = userPos
    ? [userPos.lat, userPos.lng]
    : incident?.location
      ? [incident.location.lat, incident.location.lng]
      : [31.7917, -7.0926];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* ── Map ── */}
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        maxBounds={BOUNDS}
        minZoom={5}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />

        {/* User location marker */}
        {userPos && (
          <Marker position={[userPos.lat, userPos.lng]} icon={userIcon()} />
        )}

        {/* Incident marker */}
        {incident?.location && (
          <Marker
            position={[incident.location.lat, incident.location.lng]}
            icon={getMarkerIcon(incident.type, incident.status)}
          >
            <Popup>
              <div className="font-sans">
                <strong className="text-slate-900 block mb-1">
                  {incident.cin} - {incident.fullName}
                </strong>

                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold ${STATUS_STYLES[incident.status].text}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${STATUS_STYLES[incident.status].dot} inline-block`}
                  />
                  {incident.status}
                </span>

                <span className="text-sm text-slate-600 block mb-2">
                  {incident.type}
                </span>

                <span className="text-xs text-slate-600 block mb-2">
                  {incident.description}
                </span>

                {incident.assignedTeam && (
                  <span className="text-sm text-emerald-600 block mb-2 font-medium">
                    Assigned Team: {incident.teamName || "Loading..."}
                  </span>
                )}

                {incident.status === "dispached" ? (
                  <button
                    onClick={() => updateStatus(incident.id, "on_site", "on_mission")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 text-xs rounded-md w-full transition-colors cursor-pointer"
                  >
                    Set On Site
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(incident.id, "resolved", "available")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 text-xs rounded-md w-full transition-colors cursor-pointer"
                  >
                    Set Resolved
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route polyline */}
        {routeCoords.length > 1 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: "#3b82f6",
              weight: 5,
              opacity: 0.85,
              dashArray: null,
              lineJoin: "round",
              lineCap: "round",
            }}
          />
        )}

        {/* Auto-fit bounds to route */}
        {routeCoords.length > 1 && <FitBounds coords={routeCoords} />}
      </MapContainer>

      {/* ── HUD overlay ── */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        {/* Route info pill */}
        {routeInfo && (
          <div
            style={{
              background:
                theme === "dark"
                  ? "rgba(15,23,42,0.88)"
                  : "rgba(255,255,255,0.92)",
              backdropFilter: "blur(10px)",
              borderRadius: 999,
              padding: "6px 18px",
              display: "flex",
              alignItems: "center",
              gap: 18,
              boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
              border:
                theme === "dark"
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid rgba(0,0,0,0.06)",
            }}
          >
            {/* Distance */}
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12h18M3 12l4-4M3 12l4 4M21 12l-4-4M21 12l-4 4" />
              </svg>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: theme === "dark" ? "#e2e8f0" : "#1e293b",
                }}
              >
                {fmtDistance(routeInfo.distance)}
              </span>
            </span>

            {/* Divider */}
            <span
              style={{
                width: 1,
                height: 16,
                background: theme === "dark" ? "#334155" : "#cbd5e1",
              }}
            />

            {/* Duration */}
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 14,
                  color: theme === "dark" ? "#e2e8f0" : "#1e293b",
                }}
              >
                {fmtDuration(routeInfo.duration)}
              </span>
            </span>
          </div>
        )}

        {/* Loading indicator */}
        {loadingRoute && (
          <div
            style={{
              background:
                theme === "dark"
                  ? "rgba(15,23,42,0.88)"
                  : "rgba(255,255,255,0.92)",
              backdropFilter: "blur(10px)",
              borderRadius: 999,
              padding: "5px 16px",
              fontSize: 12,
              fontWeight: 500,
              color: "#64748b",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            }}
          >
            Calculating route…
          </div>
        )}

        {/* Errors */}
        {(geoError || routeError) && (
          <div
            style={{
              background: "rgba(239,68,68,0.12)",
              backdropFilter: "blur(10px)",
              borderRadius: 999,
              padding: "5px 16px",
              fontSize: 12,
              fontWeight: 500,
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            ⚠ {geoError ?? routeError}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMap;
