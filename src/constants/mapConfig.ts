import type { LatLngExpression, PathOptions } from "leaflet";

export const MAP_CENTER: LatLngExpression = [32.97191, -96.797825] as const;

export const MAP_ZOOM = 15;

export const MAP_MAX_ZOOM = 18;

export const MAP_POLYGON_STYLE: Record<"Default" | "Selected", PathOptions> = {
  Default: {
    color: "#3388ff",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5,
  },
  Selected: {
    color: "#ff0000",
    weight: 3,
    opacity: 1,
    fillOpacity: 0.7,
  },
} as const;
