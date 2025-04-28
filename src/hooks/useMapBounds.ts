import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";

export function useMapBounds() {
  const map = useMap();
  const [bounds, setBounds] = useState({
    west: 0,
    south: 0,
    east: 0,
    north: 0,
  });

  useEffect(() => {
    const updateBounds = () => {
      const mapBounds = map.getBounds();
      setBounds({
        west: mapBounds.getWest(),
        south: mapBounds.getSouth(),
        east: mapBounds.getEast(),
        north: mapBounds.getNorth(),
      });
    };

    updateBounds();

    // Update bounds on move/zoom
    map.on("moveend", updateBounds);
    map.on("zoomend", updateBounds);

    return () => {
      map.off("moveend", updateBounds);
      map.off("zoomend", updateBounds);
    };
  }, [map]);

  return bounds;
}
