import { MAP_CENTER, MAP_ZOOM } from "@/constants/mapConfig";
import { useRef } from "react";
import { MapContainer } from "react-leaflet";
import { CustomMapContent } from "./CustomMapContent";

export const CustomMap = () => {
  const mapRef = useRef(null);

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      ref={mapRef}
      style={{ height: "100vh", width: "100vw" }}
    >
      <CustomMapContent />
    </MapContainer>
  );
};
