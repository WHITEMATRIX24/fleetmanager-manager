import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Map = ({ pos1, pos2, currentLoc }) => {
  const [position1, setPosition1] = useState(null);
  const [position2, setPosition2] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (pos1 && pos2) {
      setPosition1([pos1.lat, pos1.lng]);
      setPosition2([pos2.lat, pos2.lng]);
    }
  }, [pos1, pos2]);

  useEffect(() => {
    if (
      currentLoc &&
      currentLoc.latitude != null &&
      currentLoc.longitude != null
    ) {
      setCurrentLocation([currentLoc.latitude, currentLoc.longitude]);
    }
  }, [currentLoc]);

  return (
    <MapContainer
      key={JSON.stringify(position2)}
      center={position2 || [51.505, -0.09]}
      zoom={8}
      style={{ height: "100%", width: "100%", border: "none" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {position1 && (
        <Marker position={position1}>
          <Popup>Starting place</Popup>
        </Marker>
      )}
      {position2 && (
        <Marker position={position2}>
          <Popup>Destination</Popup>
        </Marker>
      )}
      {currentLocation && (
        <Marker position={currentLocation}>
          <Popup>Current Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
