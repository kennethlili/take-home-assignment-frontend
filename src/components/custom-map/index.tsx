import { useRef } from "react";
import { MapContainer } from "react-leaflet";
import { MAP_CENTER, MAP_MAX_ZOOM, MAP_ZOOM } from "@/constants/mapConfig";
import { CustomMapContent } from "./CustomMapContent";

export const CustomMap = ({
  selectedProperties,
  setSelectedProperties,
}: {
  selectedProperties: { id: number }[];
  setSelectedProperties: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
      }[]
    >
  >;
}) => {
  const mapRef = useRef(null);

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      ref={mapRef}
      maxZoom={MAP_MAX_ZOOM}
      className="h-screen w-full z-10"
    >
      <CustomMapContent
        selectedProperties={selectedProperties}
        setSelectedProperties={setSelectedProperties}
      />
    </MapContainer>
  );
};
