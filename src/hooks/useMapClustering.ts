import { useMemo } from "react";
import { useMap } from "react-leaflet";
import useSupercluster from "use-supercluster";
import { MAP_MAX_ZOOM } from "@/constants/mapConfig";
import { calculateCentroid } from "@/utils";
import type { GetPropertiesInBoundingBoxResponse } from "@/generated-api/apiComponents";
import type { Property } from "@/generated-api/apiSchemas";
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
}: {
  data: GetPropertiesInBoundingBoxResponse | undefined;
  zoom: number;
  bounds: {
    north: number;
    east: number;
    south: number;
    west: number;
  };
}) {
  const map = useMap();

  const points = useMemo(() => {
    if (!data) return [];
    return data.map((property) => {
      const centroid = calculateCentroid(
        property.geom.coordinates as [number, number][][],
      );
      return {
        type: "Feature",
        properties: {
          cluster: false,
          property,
        },
        geometry: {
          type: "Point",
          coordinates: [centroid[0], centroid[1]],
        },
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
