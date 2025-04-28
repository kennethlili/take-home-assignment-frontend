import type { LatLngExpression } from "leaflet";
import { useRef } from "react";
import { MapContainer, Polygon, TileLayer, Tooltip } from "react-leaflet";

const purpleOptions = { color: "purple" };

const center: LatLngExpression = [51.505, -0.09];

const polygon:
  | LatLngExpression[]
  | LatLngExpression[][]
  | LatLngExpression[][][] = [
  [51.515, -0.09],
  [51.52, -0.1],
  [51.52, -0.12],
];

const SimpleMap = () => {
  const mapRef = useRef(null);

  return (
    <MapContainer
      center={center}
      zoom={13}
      ref={mapRef}
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Polygon pathOptions={purpleOptions} positions={polygon}>
        <Tooltip>sticky Tooltip for Polygon</Tooltip>
      </Polygon>
    </MapContainer>
  );
};

export default SimpleMap;
