import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Default Marker Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapComponent = ({ locations }) => {
    const defaultCenter = [locations[0].lat, locations[0].lng]; // Default center from the first location
    const lineCoordinates = locations.map((loc) => [loc.lat, loc.lng]);

    return (
        <MapContainer
            center={defaultCenter}
            zoom={5}
            style={{ height: "500px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            {locations.map((location, index) => (
                <Marker position={[location.lat, location.lng]} key={index}>
                    <Popup>{location.address}</Popup>
                </Marker>
            ))}
            {lineCoordinates.length > 1 && <Polyline positions={lineCoordinates} />}
        </MapContainer>
    );
};

export default MapComponent;
