import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// fix default icon paths
const DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow });
L.Marker.prototype.options.icon = DefaultIcon;

function MapView({ isPlaying, speed }) {
  const [trip, setTrip] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  // Load data once
  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/data/trip_1_cross_country.json")
      .then(res => res.json())
      .then(data => {
        console.log("Trip Data Loaded ✅ events:", Array.isArray(data) ? data.length : "not-array");
        setTrip(data);
      })
      .catch(err => console.error("Error loading trip data:", err));
  }, []);

  // prepare positions (must be defined before animation effect)
  const positions = (Array.isArray(trip) ? trip : [])
    .filter(e => e && e.location && typeof e.location.lat === "number" && typeof e.location.lng === "number")
    .map(e => [e.location.lat, e.location.lng]);

  // Car icon (public folder)
  const carIcon = new L.Icon({
    iconUrl: process.env.PUBLIC_URL + "/car-icon.png",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  // Animation effect (controlled by isPlaying + speed)
  useEffect(() => {
    // clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isPlaying || positions.length === 0) return;

    // interval delay (ms) — smaller is faster; divide base by speed
    const delayMs = Math.max(50, Math.floor(500 / speed));

    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < positions.length - 1) return prev + 1;
        // reached end -> stop playing
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return prev;
      });
    }, delayMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speed, positions]);

  // If user hits Play again after finishing, optionally reset (uncomment if desired)
  useEffect(() => {
    if (isPlaying && currentIndex >= positions.length - 1) {
      setCurrentIndex(0);
    }
  }, [isPlaying]); // run when play toggles

  // Force marker re-render using key = currentIndex
  const movingMarker = positions.length > 0 ? (
    <Marker key={currentIndex} position={positions[currentIndex]} icon={carIcon}>
      <Popup>Vehicle moving... index: {currentIndex}</Popup>
    </Marker>
  ) : null;

  return (
    <MapContainer center={[37.0902, -95.7129]} zoom={4} style={{ height: "100vh", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
      {positions.length > 0 && <Polyline positions={positions} color="blue" />}
      {positions.length > 0 && (
        <>
          <Marker position={positions[0]}><Popup>Start</Popup></Marker>
          <Marker position={positions[positions.length - 1]}><Popup>End</Popup></Marker>
        </>
      )}
      {movingMarker}
    </MapContainer>
  );
}

export default MapView;
