import type { LatLngExpression, PathOptions } from "leaflet";

export const MAP_CENTER: LatLngExpression = [32.97191, -96.797825] as const;

export const MAP_ZOOM = 15;

export const MAP_POLYGON_STYLE: PathOptions = { color: "blue" } as const;

export const MAP_MAX_ZOOM = 18;
