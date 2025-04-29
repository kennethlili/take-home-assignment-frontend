import { MAP_ZOOM } from "@/constants/mapConfig";
import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";

export function useMapAttributes() {
  const map = useMap();
  const [zoom, setZoom] = useState(MAP_ZOOM);
  const [bounds, setBounds] = useState({
    west: 0,
    south: 0,
    east: 0,
    north: 0,
  });

  useEffect(() => {
    const updateAttributes = () => {
      const mapBounds = map.getBounds();
      setBounds({
        west: mapBounds.getWest(),
        south: mapBounds.getSouth(),
        east: mapBounds.getEast(),
        north: mapBounds.getNorth(),
      });
      const currZoom = map.getZoom();
      setZoom(currZoom);
    };

    updateAttributes();

    // Update attributes on move/zoom
    map.on("moveend", updateAttributes);
    map.on("zoomend", updateAttributes);

    return () => {
      map.off("moveend", updateAttributes);
      map.off("zoomend", updateAttributes);
    };
  }, [map]);

  return { zoom, bounds };
}
