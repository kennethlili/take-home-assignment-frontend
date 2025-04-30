import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { MAP_ZOOM } from "@/constants/mapConfig";

export type MapBounds = {
  west: number;
  south: number;
  east: number;
  north: number;
};

export function useMapAttributes() {
  const [zoom, setZoom] = useState<number>(MAP_ZOOM);
  const [bounds, setBounds] = useState<MapBounds>({
    west: 0,
    south: 0,
    east: 0,
    north: 0,
  });

  const handleMapMove = useDebouncedCallback(
    ({ bounds, zoom }: { bounds: MapBounds; zoom: number }) => {
      setBounds(bounds);
      setZoom(zoom);
    },
    300,
  );

  return { zoom, bounds, handleMapMove };
}
