import { MAP_MAX_ZOOM } from "@/constants/mapConfig";
import type { GetPropertiesInBoundingBoxResponse } from "@/generated-api/apiComponents";
import { calculateCentroid } from "@/utils";
import type { LatLngExpression } from "leaflet";
import { useMemo } from "react";
import { useMap } from "react-leaflet";
import useSupercluster from "use-supercluster";

type PolygonFeature = Omit<
  GetPropertiesInBoundingBoxResponse[number],
  "geom"
> & {
  geom: {
    type: "Polygon";
    coordinates: [number, number][][];
  };
};

export interface ClusterPointFeature {
  id: string | number;
  type: "Feature";
  properties: Omit<PolygonFeature, "geom"> & {
    originalGeom: PolygonFeature["geom"];
    cluster: boolean;
    point_count: number;
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
        property.geom.coordinates as [number, number][][]
      );
      const { geom, ..._property } = property;
      return {
        type: "Feature",
        properties: {
          cluster: false,
          originalGeom: geom,
          ..._property,
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
    options: { radius: 30, maxZoom: MAP_MAX_ZOOM },
  });

  function onClusterClick(
    clusterId: number | string,
    coordinates: LatLngExpression
  ) {
    const expansionZoom = Math.min(
      supercluster.getClusterExpansionZoom(clusterId),
      MAP_MAX_ZOOM
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
