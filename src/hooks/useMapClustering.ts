import { useMemo } from "react";
import * as turf from "@turf/turf";
import { useMap } from "react-leaflet";
import useSupercluster from "use-supercluster";
import { MAP_MAX_ZOOM } from "@/constants/mapConfig";
import type { GetPropertiesInBoundingBoxResponse } from "@/generated-api/apiComponents";
import type { Property } from "@/generated-api/apiSchemas";
import type { Position } from "geojson";
import type { LatLngExpression } from "leaflet";

export interface ClusterPointFeature {
  id: string | number;
  type: "Feature";
  properties: {
    cluster: boolean;
    point_count: number;
    property?: Property;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export function useMapClustering({
  data,
  zoom,
  bounds,
  isLoading,
}: {
  data: GetPropertiesInBoundingBoxResponse | undefined;
  zoom: number;
  bounds: {
    north: number;
    east: number;
    south: number;
    west: number;
  };
  isLoading: boolean;
}) {
  const map = useMap();

  const points = useMemo(() => {
    if (!data) return [];
    return data.map((property) => {
      const polygon = turf.polygon(property.geom.coordinates as Position[][]);
      const centroid = turf.centroid(polygon);
      return {
        type: "Feature",
        properties: {
          cluster: false,
          property,
        },
        geometry: centroid.geometry,
      };
    });
  }, [data]);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: [bounds.west, bounds.south, bounds.east, bounds.north],
    zoom,
    options: {
      radius: 30,
      maxZoom: MAP_MAX_ZOOM,
    },
    disableRefresh: isLoading,
  });

  function onClusterClick(
    clusterId: number | string,
    coordinates: LatLngExpression,
  ) {
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(clusterId),
      MAP_MAX_ZOOM,
    );

    map.setView(coordinates, expansionZoom, {
      animate: true,
    });
  }

  return {
    clusters,
    supercluster,
    points,
    onClusterClick,
  };
}
