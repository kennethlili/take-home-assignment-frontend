import { useRef } from "react";
import { MapContainer } from "react-leaflet";
import { MAP_CENTER, MAP_MAX_ZOOM, MAP_ZOOM } from "@/constants/mapConfig";
import { Spinner } from "../ui/spinner";
import { CustomMapContent } from "./CustomMapContent";
import type { GetPropertiesInBoundingBoxResponse } from "@/generated-api/apiComponents";
import type { Property } from "@/generated-api/apiSchemas";
import type { MapBounds } from "@/hooks/useMapAttributes";
import type { DebouncedState } from "use-debounce";

interface CustomMapProps {
  data: GetPropertiesInBoundingBoxResponse | undefined;
  selectedProperties: { id: number }[];
  setSelectedProperties: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
      }[]
    >
  >;
  setSelectedProperty: React.Dispatch<React.SetStateAction<Property | null>>;
  handleMapMove: DebouncedState<
    ({ bounds, zoom }: { bounds: MapBounds; zoom: number }) => void
  >;
  zoom: number;
  bounds: MapBounds;
  isLoading: boolean;
}

export const CustomMap = ({
  data,
  selectedProperties,
  setSelectedProperties,
  setSelectedProperty,
  handleMapMove,
  zoom,
  bounds,
  isLoading,
}: CustomMapProps) => {
  const mapRef = useRef(null);
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      ref={mapRef}
      maxZoom={MAP_MAX_ZOOM}
      className="z-10 h-full w-full"
    >
      <CustomMapContent
        data={data}
        setSelectedProperty={setSelectedProperty}
        selectedProperties={selectedProperties}
        setSelectedProperties={setSelectedProperties}
        handleMapMove={handleMapMove}
        zoom={zoom}
        bounds={bounds}
        isLoading={isLoading}
      />
      {isLoading && (
        <div className="leaflet-bottom leaflet-right bg-accent flex items-center justify-center rounded-md p-4">
          <Spinner />
        </div>
      )}
    </MapContainer>
  );
};
