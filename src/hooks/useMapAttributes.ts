import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { useDebouncedCallback } from "use-debounce";
import { MAP_ZOOM } from "@/constants/mapConfig";

type MapBounds = {
  west: number;
  south: number;
  east: number;
  north: number;
};

export function useMapAttributes() {
  const map = useMap();
  const [zoom, setZoom] = useState<number>(MAP_ZOOM);
  const [bounds, setBounds] = useState<MapBounds>({
    west: 0,
    south: 0,
    east: 0,
    north: 0,
  });

  const handleMapMove = useDebouncedCallback(() => {
    const bounds = map.getBounds();
    setBounds({
      west: bounds.getWest(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      north: bounds.getNorth(),
    });
    setZoom(map.getZoom());
  }, 500);

  useEffect(() => {
    handleMapMove();

    // Update attributes on move/zoom
    map.on("moveend", handleMapMove);
    map.on("zoomend", handleMapMove);

    return () => {
      map.off("moveend", handleMapMove);
      map.off("zoomend", handleMapMove);
    };
  }, [map, handleMapMove]);

  return { zoom, bounds };
}
